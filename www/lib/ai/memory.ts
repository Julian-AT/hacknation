import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { conversationMessages, workingMemory } from "../db/schema";

// ── Types (previously from @ai-sdk-tools/memory) ────────────────────

export type MemoryScope = "chat" | "user";

export type WorkingMemory = {
  content: string;
  updatedAt: Date;
};

export type ConversationMessage = {
  chatId: string;
  userId?: string;
  role: "user" | "assistant" | "system";
  content: string | unknown;
  timestamp: Date;
};

export interface MemoryProvider {
  getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null>;

  updateWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
    content: string;
  }): Promise<void>;

  saveMessage(message: ConversationMessage): Promise<void>;

  getMessages<T = unknown>(params: {
    chatId: string;
    userId?: string;
    limit?: number;
  }): Promise<T[]>;
}

// ── Utilities (previously from @ai-sdk-tools/memory) ─────────────────

export const DEFAULT_TEMPLATE = `# Working Memory

## User Preferences
- [preferences]

## Context
- [important context]

## Past Interactions
- [key findings]
`;

/**
 * Format a working memory object into a string for the LLM context.
 */
export function formatWorkingMemory(wm: WorkingMemory): string {
  return wm.content;
}

/**
 * Generate instructions for the LLM on how to update working memory.
 */
export function getWorkingMemoryInstructions(template: string): string {
  return [
    "If you learn important new facts about this user (preferences, regions of interest, role, etc.),",
    "include an <update_working_memory> block at the end of your response with the updated memory.",
    "Use the template below as a guide — keep it concise and only include confirmed facts.",
    "",
    "Template:",
    template,
  ].join("\n");
}

/**
 * Working memory template for Meridian healthcare analysis.
 */
export const MERIDIAN_MEMORY_TEMPLATE = `# Working Memory

## User Role
- [NGO coordinator / Volunteer doctor / Healthcare planner / Researcher]

## Regions of Interest
- [Regions or cities the user frequently asks about]

## Past Analyses
- [Key findings from previous conversations]

## Preferences
- [Preferred facility types, specialties, output format]

## Important Context
- [Any other relevant facts learned about this user]
`;

/**
 * Custom Drizzle-based memory provider for Meridian.
 * Uses the existing PostgreSQL database via Drizzle ORM.
 */
export class MeridianMemoryProvider implements MemoryProvider {
  async getWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
  }): Promise<WorkingMemory | null> {
    const scopeKey = params.scope === "user" ? params.userId : params.chatId;
    if (!scopeKey) {
      return null;
    }

    const rows = await db
      .select()
      .from(workingMemory)
      .where(
        and(
          eq(workingMemory.scope, params.scope),
          params.scope === "user"
            ? eq(workingMemory.userId, scopeKey)
            : eq(workingMemory.chatId, scopeKey)
        )
      )
      .limit(1);

    if (rows.length === 0) {
      return null;
    }

    return {
      content: rows[0].content,
      updatedAt: rows[0].updatedAt,
    };
  }

  async updateWorkingMemory(params: {
    chatId?: string;
    userId?: string;
    scope: MemoryScope;
    content: string;
  }): Promise<void> {
    const scopeKey = params.scope === "user" ? params.userId : params.chatId;
    if (!scopeKey) {
      return;
    }

    const id = `${params.scope}:${scopeKey}`;
    const now = new Date();

    await db
      .insert(workingMemory)
      .values({
        id,
        scope: params.scope,
        chatId: params.chatId ?? null,
        userId: params.userId ?? null,
        content: params.content,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: workingMemory.id,
        set: {
          content: params.content,
          updatedAt: now,
        },
      });
  }

  async saveMessage(message: ConversationMessage): Promise<void> {
    await db.insert(conversationMessages).values({
      chatId: message.chatId,
      userId: message.userId ?? null,
      role: message.role,
      content:
        typeof message.content === "string"
          ? message.content
          : JSON.stringify(message.content),
      timestamp: message.timestamp,
    });
  }

  async getMessages<T = unknown>(params: {
    chatId: string;
    userId?: string;
    limit?: number;
  }): Promise<T[]> {
    const rows = await db
      .select()
      .from(conversationMessages)
      .where(eq(conversationMessages.chatId, params.chatId))
      .orderBy(desc(conversationMessages.timestamp))
      .limit(params.limit ?? 15);

    return rows.reverse().map((row) => ({
      chatId: row.chatId,
      userId: row.userId ?? undefined,
      role: row.role as "user" | "assistant" | "system",
      content: row.content,
      timestamp: row.timestamp,
    })) as T[];
  }
}

export const memoryProvider = new MeridianMemoryProvider();
