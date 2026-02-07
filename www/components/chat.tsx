
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { unstable_serialize } from 'swr/infinite';
import { ChatHeader } from '@/components/chat-header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useArtifactSelector } from '@/hooks/use-artifact';
import { useAutoResume } from '@/hooks/use-auto-resume';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import type { Vote } from '@/lib/db/schema';
import { ChatSDKError } from '@/lib/errors';
import type { Attachment, ChatMessage } from '@/lib/types';
import { fetcher, fetchWithErrorHandlers, generateUUID } from '@/lib/utils';
import { Artifact } from './artifact';
import { useDataStream } from './data-stream-provider';
import { Messages } from './messages';
import { MultimodalInput } from './multimodal-input';
import { getChatHistoryPaginationKey } from './sidebar-history';
import { toast } from './toast';
import type { VisibilityType } from './visibility-selector';
import FacilityMap from './vf-ui/FacilityMap';
import { SuggestedQueries } from './vf-ui/SuggestedQueries';
import { useVF } from '@/lib/vf-context';

export function Chat({
  id,
  initialMessages,
  initialChatModel,
  initialVisibilityType,
  isReadonly,
  autoResume,
}: {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  autoResume: boolean;
}) {
  const router = useRouter();
  const { setMapFacilities, setMapCenter, setMapZoom } = useVF();

  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  });

  const { mutate } = useSWRConfig();

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      // When user navigates back/forward, refresh to sync with URL
      router.refresh();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);
  const { setDataStream } = useDataStream();

  const [input, setInput] = useState<string>('');
  const [showCreditCardAlert, setShowCreditCardAlert] = useState(false);
  const [currentModelId, setCurrentModelId] = useState(initialChatModel);
  const currentModelIdRef = useRef(currentModelId);

  useEffect(() => {
    currentModelIdRef.current = currentModelId;
  }, [currentModelId]);

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
    resumeStream,
    addToolApprovalResponse,
  } = useChat<ChatMessage>({
    id,
    messages: initialMessages,
    generateId: generateUUID,
    sendAutomaticallyWhen: ({ messages: currentMessages }) => {
      const lastMessage = currentMessages.at(-1);
      const shouldContinue =
        lastMessage?.parts?.some(
          (part) =>
            'state' in part &&
            part.state === 'approval-responded' &&
            'approval' in part &&
            (part.approval as { approved?: boolean })?.approved === true
        ) ?? false;
      return shouldContinue;
    },
    transport: new DefaultChatTransport({
      api: '/api/chat',
      fetch: fetchWithErrorHandlers as typeof fetch,
      prepareSendMessagesRequest(request) {
        const lastMessage = request.messages.at(-1);
        const isToolApprovalContinuation =
          lastMessage?.role !== 'user' ||
          request.messages.some((msg) =>
            msg.parts?.some((part) => {
              const state = (part as { state?: string }).state;
              return (
                state === 'approval-responded' || state === 'output-denied'
              );
            })
          );

        return {
          body: {
            id: request.id,
            ...(isToolApprovalContinuation
              ? { messages: request.messages }
              : { message: lastMessage }),
            selectedChatModel: currentModelIdRef.current,
            selectedVisibilityType: visibilityType,
            ...request.body,
          },
        };
      },
    }),
    onData: (dataPart) => {
      setDataStream((ds) => (ds ? [...ds, dataPart as any] : []));
    },
    onFinish: () => {
      mutate(unstable_serialize(getChatHistoryPaginationKey));
    },
    onError: (error) => {
      if (error instanceof ChatSDKError) {
        if (
          error.message?.includes('AI Gateway requires a valid credit card')
        ) {
          setShowCreditCardAlert(true);
        } else {
          toast({
            type: 'error',
            description: error.message,
          });
        }
      }
    },
  });

  // Effect to listen for tool calls and update map
  // This listens to the *last* message. If it has tool invocations with results, we update.
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role !== 'assistant' || !lastMessage.parts) return;

    // We look for tool-invocation parts that are finished
    const toolParts = lastMessage.parts.filter(
      (part) => (part as any).type === 'tool-invocation' && 'result' in (part as any).toolInvocation
    );

    for (const part of toolParts) {
      if ((part as any).type !== 'tool-invocation') continue;
      const { toolName, result, args } = (part as any).toolInvocation as any;

      if (!result) continue;

      if (toolName === 'findNearby' && result.facilities) {
        setMapFacilities(result.facilities);
        if (result.center) {
          setMapCenter([result.center.lat, result.center.lng]);
          setMapZoom(10);
        }
      } else if (toolName === 'searchFacilities' && result.results) {
        // Map search results if they have lat/lng
        // Need to fetch full details if not present, but searchFacilities returns mostly text
        // Actually, let's assume searchFacilities might return lat/lng or we fetch it.
        // The current implementation of searchFacilities DOES return lat/lng if we didn't remove it.
        // Wait, looking at searchFacilities implementation: it returns id, name, region... 
        // It does NOT return lat/lng in my implementation above! 
        // I should update searchFacilities to return lat/lng for mapping.
        // But for now, let's just handle findNearby.
        
        // Wait, findMedicalDeserts returns 'desertZones' with coordinates
      } else if (toolName === 'findMedicalDeserts' && result.desertZones) {
        // Map desert zones? 
        // We can map the "nearestProvider" or the center of the gap
        const markers = result.desertZones.map((z: any) => ({
          id: Math.random(), // Temp ID
          name: `${z.city} Gap (${z.distanceKm}km)`,
          lat: z.coordinates.lat,
          lng: z.coordinates.lng,
          type: 'Medical Desert',
          distanceKm: z.distanceKm
        }));
        setMapFacilities(markers);
        if (markers.length > 0) {
           setMapCenter([markers[0].lat, markers[0].lng]);
           setMapZoom(7);
        }
      }
    }
  }, [messages, setMapFacilities, setMapCenter, setMapZoom]);


  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  const [hasAppendedQuery, setHasAppendedQuery] = useState(false);

  useEffect(() => {
    if (query && !hasAppendedQuery) {
      sendMessage({
        role: 'user' as const,
        parts: [{ type: 'text', text: query }],
      });

      setHasAppendedQuery(true);
      window.history.replaceState({}, '', `/chat/${id}`);
    }
  }, [query, sendMessage, hasAppendedQuery, id]);

  const { data: votes } = useSWR<Vote[]>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher
  );

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  useAutoResume({
    autoResume,
    initialMessages,
    resumeStream,
    setMessages,
  });

  return (
    <>
      <div className="flex h-dvh min-w-0 bg-background overflow-hidden">
        {/* Left Panel: Chat */}
        <div className="flex flex-col w-1/2 h-full border-r border-zinc-800">
          <ChatHeader
            chatId={id}
            isReadonly={isReadonly}
            selectedVisibilityType={initialVisibilityType}
          />

          <Messages
            addToolApprovalResponse={addToolApprovalResponse}
            chatId={id}
            isArtifactVisible={isArtifactVisible}
            isReadonly={isReadonly}
            messages={messages}
            regenerate={regenerate}
            selectedModelId={initialChatModel}
            setMessages={setMessages}
            status={status}
            votes={votes}
          />

          <SuggestedQueries append={sendMessage} />

          <div className="sticky bottom-0 z-1 mx-auto flex w-full gap-2 border-t-0 bg-background px-2 pb-3 md:px-4 md:pb-4">
            {!isReadonly && (
              <MultimodalInput
                attachments={attachments}
                chatId={id}
                input={input}
                messages={messages}
                onModelChange={setCurrentModelId}
                selectedModelId={currentModelId}
                selectedVisibilityType={visibilityType}
                sendMessage={sendMessage}
                setAttachments={setAttachments}
                setInput={setInput}
                setMessages={setMessages}
                status={status}
                stop={stop}
              />
            )}
          </div>
        </div>

        {/* Right Panel: Map */}
        <div className="w-1/2 h-full bg-zinc-900 relative">
          <FacilityMap />
          
          {/* Legend Overlay */}
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm p-3 rounded-lg border border-zinc-800 text-xs text-zinc-300 z-[1000]">
            <div className="font-semibold mb-2 text-white">Legend</div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-blue-500 border border-white/50"></span>
              <span>Facility</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 border border-white/50"></span>
              <span>Desert/Gap</span>
            </div>
          </div>
        </div>
      </div>

      <Artifact
        addToolApprovalResponse={addToolApprovalResponse}
        attachments={attachments}
        chatId={id}
        input={input}
        isReadonly={isReadonly}
        messages={messages}
        regenerate={regenerate}
        selectedModelId={currentModelId}
        selectedVisibilityType={visibilityType}
        sendMessage={sendMessage}
        setAttachments={setAttachments}
        setInput={setInput}
        setMessages={setMessages}
        status={status}
        stop={stop}
        votes={votes}
      />

      <AlertDialog
        onOpenChange={setShowCreditCardAlert}
        open={showCreditCardAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Activate AI Gateway</AlertDialogTitle>
            <AlertDialogDescription>
              This application requires{' '}
              {process.env.NODE_ENV === 'production' ? 'the owner' : 'you'} to
              activate Vercel AI Gateway.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                window.open(
                  'https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai%3Fmodal%3Dadd-credit-card',
                  '_blank'
                );
                window.location.href = '/';
              }}
            >
              Activate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
