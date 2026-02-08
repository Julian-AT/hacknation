// Curated list of top models from Vercel AI Gateway
export const DEFAULT_CHAT_MODEL = "google/gemini-2.5-flash-lite";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
  image: string;
};

export const chatModels: ChatModel[] = [
    {
        "id": "anthropic/claude-sonnet-4.5",
        "name": "Claude Sonnet 4.5",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "kwaipilot/kat-coder-pro-v1",
        "name": "Kat Coder Pro V1",
        "provider": "kwaipilot",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fkwaipilot.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "moonshotai/kimi-k2.5",
        "name": "Kimi K2.5",
        "provider": "moonshotai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmoonshotai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-3-flash",
        "name": "Gemini 3 Flash",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "minimax/minimax-m2.1",
        "name": "Minimax M2.1",
        "provider": "minimax",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fminimax.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-2.5-flash-lite",
        "name": "Gemini 2.5 Flash Lite",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-haiku-4.5",
        "name": "Claude Haiku 4.5",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-3.7-sonnet",
        "name": "Claude 3.7 Sonnet",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-opus-4.6",
        "name": "Claude Opus 4.6",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5.2",
        "name": "Gpt 5.2",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-opus-4.5",
        "name": "Claude Opus 4.5",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-sonnet-4",
        "name": "Claude Sonnet 4",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5-chat",
        "name": "Gpt 5 Chat",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-3-pro-preview",
        "name": "Gemini 3 Pro Preview",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "zai/glm-4.7",
        "name": "Glm 4.7",
        "provider": "zai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fzai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-4.1-fast-non-reasoning",
        "name": "Grok 4.1 Fast Non Reasoning",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-2.5-flash",
        "name": "Gemini 2.5 Flash",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5.2-codex",
        "name": "Gpt 5.2 Codex",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5-mini",
        "name": "Gpt 5 Mini",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-2.5-pro",
        "name": "Gemini 2.5 Pro",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5-nano",
        "name": "Gpt 5 Nano",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-4.1-fast-reasoning",
        "name": "Grok 4.1 Fast Reasoning",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5.1-instant",
        "name": "Gpt 5.1 Instant",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "deepseek/deepseek-v3.2",
        "name": "Deepseek V3.2",
        "provider": "deepseek",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fdeepseek.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5",
        "name": "Gpt 5",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-oss-120b",
        "name": "Gpt Oss 120b",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-4o-mini",
        "name": "Gpt 4o Mini",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-4-fast-non-reasoning",
        "name": "Grok 4 Fast Non Reasoning",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5.1-thinking",
        "name": "Gpt 5.1 Thinking",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/devstral-2",
        "name": "Devstral 2",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-2.5-flash-image",
        "name": "Gemini 2.5 Flash Image",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-4.1-mini",
        "name": "Gpt 4.1 Mini",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/text-embedding-3-small",
        "name": "Text Embedding 3 Small",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-oss-safeguard-20b",
        "name": "Gpt Oss Safeguard 20b",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-coder",
        "name": "Qwen3 Coder",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5-codex",
        "name": "Gpt 5 Codex",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "moonshotai/kimi-k2-0905",
        "name": "Kimi K2 0905",
        "provider": "moonshotai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmoonshotai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-4.1",
        "name": "Gpt 4.1",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-code-fast-1",
        "name": "Grok Code Fast 1",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-oss-20b",
        "name": "Gpt Oss 20b",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-4o",
        "name": "Gpt 4o",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-2.0-flash-lite",
        "name": "Gemini 2.0 Flash Lite",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-4-fast-reasoning",
        "name": "Grok 4 Fast Reasoning",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/mistral-embed",
        "name": "Mistral Embed",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "zai/glm-4.6",
        "name": "Glm 4.6",
        "provider": "zai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fzai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5.1-codex",
        "name": "Gpt 5.1 Codex",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "amazon/nova-micro",
        "name": "Nova Micro",
        "provider": "amazon",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Famazon%20bedrock.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-2.0-flash",
        "name": "Gemini 2.0 Flash",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/ministral-3b",
        "name": "Ministral 3b",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "arcee-ai/trinity-large-preview",
        "name": "Trinity Large Preview",
        "provider": "arcee-ai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Farcee-ai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "deepseek/deepseek-v3.2-thinking",
        "name": "Deepseek V3.2 Thinking",
        "provider": "deepseek",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fdeepseek.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5.1-codex-mini",
        "name": "Gpt 5.1 Codex Mini",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-4.1-nano",
        "name": "Gpt 4.1 Nano",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/text-multilingual-embedding-002",
        "name": "Text Multilingual Embedding 002",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-3-pro-image",
        "name": "Gemini 3 Pro Image",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/text-embedding-3-large",
        "name": "Text Embedding 3 Large",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-embedding-001",
        "name": "Gemini Embedding 001",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/ministral-8b",
        "name": "Ministral 8b",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-2.5-flash-lite-preview-09-2025",
        "name": "Gemini 2.5 Flash Lite Preview 09 2025",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "deepseek/deepseek-r1",
        "name": "Deepseek R1",
        "provider": "deepseek",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fdeepseek.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "deepseek/deepseek-v3.2-exp",
        "name": "Deepseek V3.2 Exp",
        "provider": "deepseek",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fdeepseek.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-4",
        "name": "Grok 4",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen-3-235b",
        "name": "Qwen 3 235b",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "morph/morph-v3-fast",
        "name": "Morph V3 Fast",
        "provider": "morph",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmorph.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5.1-codex-max",
        "name": "Gpt 5.1 Codex Max",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-3.5-haiku",
        "name": "Claude 3.5 Haiku",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "deepseek/deepseek-v3",
        "name": "Deepseek V3",
        "provider": "deepseek",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fdeepseek.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meta/llama-3.1-8b",
        "name": "Llama 3.1 8b",
        "provider": "meta",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeta.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "zai/glm-4.7-flashx",
        "name": "Glm 4.7 Flashx",
        "provider": "zai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fzai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xiaomi/mimo-v2-flash",
        "name": "Mimo V2 Flash",
        "provider": "xiaomi",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxiaomi.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-max",
        "name": "Qwen3 Max",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "zai/glm-4.7-flash",
        "name": "Glm 4.7 Flash",
        "provider": "zai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fzai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5.2-chat",
        "name": "Gpt 5.2 Chat",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "perplexity/sonar",
        "name": "Sonar",
        "provider": "perplexity",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fperplexity.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "minimax/minimax-m2.1-lightning",
        "name": "Minimax M2.1 Lightning",
        "provider": "minimax",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fminimax.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/o3",
        "name": "O3",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "minimax/minimax-m2",
        "name": "Minimax M2",
        "provider": "minimax",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fminimax.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/mistral-nemo",
        "name": "Mistral Nemo",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/o1",
        "name": "O1",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "moonshotai/kimi-k2",
        "name": "Kimi K2",
        "provider": "moonshotai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmoonshotai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-3.5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meta/llama-3.3-70b",
        "name": "Llama 3.3 70b",
        "provider": "meta",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeta.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-2.5-flash-preview-09-2025",
        "name": "Gemini 2.5 Flash Preview 09 2025",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "moonshotai/kimi-k2-thinking",
        "name": "Kimi K2 Thinking",
        "provider": "moonshotai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmoonshotai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/o4-mini",
        "name": "O4 Mini",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meta/llama-4-scout",
        "name": "Llama 4 Scout",
        "provider": "meta",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeta.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "perplexity/sonar-pro",
        "name": "Sonar Pro",
        "provider": "perplexity",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fperplexity.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen-3-32b",
        "name": "Qwen 3 32b",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/o3-mini",
        "name": "O3 Mini",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "amazon/nova-lite",
        "name": "Nova Lite",
        "provider": "amazon",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Famazon%20bedrock.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-coder-next",
        "name": "Qwen3 Coder Next",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "deepseek/deepseek-v3.1-terminus",
        "name": "Deepseek V3.1 Terminus",
        "provider": "deepseek",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fdeepseek.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-opus-4.1",
        "name": "Claude Opus 4.1",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "deepseek/deepseek-v3.1",
        "name": "Deepseek V3.1",
        "provider": "deepseek",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fdeepseek.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-3-mini-fast",
        "name": "Grok 3 Mini Fast",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-coder-30b-a3b",
        "name": "Qwen3 Coder 30b A3b",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-opus-4",
        "name": "Claude Opus 4",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-3-haiku",
        "name": "Claude 3 Haiku",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/mistral-large-3",
        "name": "Mistral Large 3",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/devstral-small-2",
        "name": "Devstral Small 2",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/codestral",
        "name": "Codestral",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/codestral-embed",
        "name": "Codestral Embed",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "nvidia/nemotron-nano-12b-v2-vl",
        "name": "Nemotron Nano 12b V2 Vl",
        "provider": "nvidia",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fnvidia.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meituan/longcat-flash-chat",
        "name": "Longcat Flash Chat",
        "provider": "meituan",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeituan.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-235b-a22b-thinking",
        "name": "Qwen3 235b A22b Thinking",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-coder-plus",
        "name": "Qwen3 Coder Plus",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/text-embedding-005",
        "name": "Text Embedding 005",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-3-mini",
        "name": "Grok 3 Mini",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "zai/glm-4.6v-flash",
        "name": "Glm 4.6v Flash",
        "provider": "zai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fzai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/gemini-2.5-flash-image-preview",
        "name": "Gemini 2.5 Flash Image Preview",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "moonshotai/kimi-k2-turbo",
        "name": "Kimi K2 Turbo",
        "provider": "moonshotai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmoonshotai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "cohere/embed-v4.0",
        "name": "Embed V4.0",
        "provider": "cohere",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fcohere.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "moonshotai/kimi-k2-thinking-turbo",
        "name": "Kimi K2 Thinking Turbo",
        "provider": "moonshotai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmoonshotai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/text-embedding-ada-002",
        "name": "Text Embedding Ada 002",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/mistral-small",
        "name": "Mistral Small",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meta/llama-3.2-3b",
        "name": "Llama 3.2 3b",
        "provider": "meta",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeta.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "amazon/nova-2-lite",
        "name": "Nova 2 Lite",
        "provider": "amazon",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Famazon%20bedrock.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "zai/glm-4.6v",
        "name": "Glm 4.6v",
        "provider": "zai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fzai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-3.5-sonnet-20240620",
        "name": "Claude 3.5 Sonnet 20240620",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-vl-thinking",
        "name": "Qwen3 Vl Thinking",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-3",
        "name": "Grok 3",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-next-80b-a3b-thinking",
        "name": "Qwen3 Next 80b A3b Thinking",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/ministral-14b",
        "name": "Ministral 14b",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-vl-instruct",
        "name": "Qwen3 Vl Instruct",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meituan/longcat-flash-thinking-2601",
        "name": "Longcat Flash Thinking 2601",
        "provider": "meituan",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeituan.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5.2-pro",
        "name": "Gpt 5.2 Pro",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "prime-intellect/intellect-3",
        "name": "Intellect 3",
        "provider": "prime-intellect",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fprime-intellect.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "perplexity/sonar-reasoning-pro",
        "name": "Sonar Reasoning Pro",
        "provider": "perplexity",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fperplexity.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-3.5-turbo",
        "name": "Gpt 3.5 Turbo",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-4-turbo",
        "name": "Gpt 4 Turbo",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-next-80b-a3b-instruct",
        "name": "Qwen3 Next 80b A3b Instruct",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bytedance/seed-1.6",
        "name": "Seed 1.6",
        "provider": "bytedance",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fbytedance.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-2-vision",
        "name": "Grok 2 Vision",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "zai/glm-4.5",
        "name": "Glm 4.5",
        "provider": "zai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fzai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "vercel/v0-1.0-md",
        "name": "V0 1.0 Md",
        "provider": "vercel",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fvercel.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "arcee-ai/trinity-mini",
        "name": "Trinity Mini",
        "provider": "arcee-ai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Farcee-ai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "vercel/v0-1.5-md",
        "name": "V0 1.5 Md",
        "provider": "vercel",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fvercel.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen-3-14b",
        "name": "Qwen 3 14b",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meta/llama-4-maverick",
        "name": "Llama 4 Maverick",
        "provider": "meta",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeta.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-5-pro",
        "name": "Gpt 5 Pro",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-4o-mini-search-preview",
        "name": "Gpt 4o Mini Search Preview",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "zai/glm-4.5-air",
        "name": "Glm 4.5 Air",
        "provider": "zai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fzai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen-3-30b",
        "name": "Qwen 3 30b",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "cohere/command-a",
        "name": "Command A",
        "provider": "cohere",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fcohere.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "nvidia/nemotron-nano-9b-v2",
        "name": "Nemotron Nano 9b V2",
        "provider": "nvidia",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fnvidia.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bytedance/seed-1.8",
        "name": "Seed 1.8",
        "provider": "bytedance",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fbytedance.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "zai/glm-4.5v",
        "name": "Glm 4.5v",
        "provider": "zai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fzai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/devstral-small",
        "name": "Devstral Small",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "amazon/nova-pro",
        "name": "Nova Pro",
        "provider": "amazon",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Famazon%20bedrock.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "nvidia/nemotron-3-nano-30b-a3b",
        "name": "Nemotron 3 Nano 30b A3b",
        "provider": "nvidia",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fnvidia.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "xai/grok-3-fast",
        "name": "Grok 3 Fast",
        "provider": "xai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fxai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meta/llama-3.1-70b",
        "name": "Llama 3.1 70b",
        "provider": "meta",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeta.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/codex-mini",
        "name": "Codex Mini",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/pixtral-12b",
        "name": "Pixtral 12b",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/o3-pro",
        "name": "O3 Pro",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-max-thinking",
        "name": "Qwen3 Max Thinking",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/magistral-small",
        "name": "Magistral Small",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/mistral-medium",
        "name": "Mistral Medium",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meta/llama-3.2-11b",
        "name": "Llama 3.2 11b",
        "provider": "meta",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeta.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meta/llama-3.2-1b",
        "name": "Llama 3.2 1b",
        "provider": "meta",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeta.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-max-preview",
        "name": "Qwen3 Max Preview",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-embedding-0.6b",
        "name": "Qwen3 Embedding 0.6b",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/magistral-medium",
        "name": "Magistral Medium",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meta/llama-3.2-90b",
        "name": "Llama 3.2 90b",
        "provider": "meta",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeta.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/pixtral-large",
        "name": "Pixtral Large",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "anthropic/claude-3-opus",
        "name": "Claude 3 Opus",
        "provider": "anthropic",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fanthropic.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "morph/morph-v3-large",
        "name": "Morph V3 Large",
        "provider": "morph",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmorph.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "voyage/voyage-3-large",
        "name": "Voyage 3 Large",
        "provider": "voyage",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fvoyage.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-embedding-8b",
        "name": "Qwen3 Embedding 8b",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "mistral/mixtral-8x22b-instruct",
        "name": "Mixtral 8x22b Instruct",
        "provider": "mistral",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmistral.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "amazon/titan-embed-text-v2",
        "name": "Titan Embed Text V2",
        "provider": "amazon",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Famazon%20bedrock.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "voyage/voyage-3.5-lite",
        "name": "Voyage 3.5 Lite",
        "provider": "voyage",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fvoyage.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "voyage/voyage-3.5",
        "name": "Voyage 3.5",
        "provider": "voyage",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fvoyage.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "alibaba/qwen3-embedding-4b",
        "name": "Qwen3 Embedding 4b",
        "provider": "alibaba",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Falibaba%20cloud.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-2-max",
        "name": "Flux 2 Max",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-2-klein-4b",
        "name": "Flux 2 Klein 4b",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/gpt-3.5-turbo-instruct",
        "name": "Gpt 3.5 Turbo Instruct",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-kontext-pro",
        "name": "Flux Kontext Pro",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "recraft/recraft-v2",
        "name": "Recraft V2",
        "provider": "recraft",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Frecraft.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-pro-1.1",
        "name": "Flux Pro 1.1",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/imagen-4.0-generate-001",
        "name": "Imagen 4.0 Generate 001",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/imagen-4.0-ultra-generate-001",
        "name": "Imagen 4.0 Ultra Generate 001",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "inception/mercury-coder-small",
        "name": "Mercury Coder Small",
        "provider": "inception",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Finception.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-2-klein-9b",
        "name": "Flux 2 Klein 9b",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-pro-1.1-ultra",
        "name": "Flux Pro 1.1 Ultra",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "openai/o3-deep-research",
        "name": "O3 Deep Research",
        "provider": "openai",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fopenai.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "google/imagen-4.0-fast-generate-001",
        "name": "Imagen 4.0 Fast Generate 001",
        "provider": "google",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fgoogle.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-kontext-max",
        "name": "Flux Kontext Max",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "meituan/longcat-flash-thinking",
        "name": "Longcat Flash Thinking",
        "provider": "meituan",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fmeituan.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "perplexity/sonar-reasoning",
        "name": "Sonar Reasoning",
        "provider": "perplexity",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fperplexity.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-2-pro",
        "name": "Flux 2 Pro",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-2-flex",
        "name": "Flux 2 Flex",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "recraft/recraft-v3",
        "name": "Recraft V3",
        "provider": "recraft",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Frecraft.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "bfl/flux-pro-1.0-fill",
        "name": "Flux Pro 1.0 Fill",
        "provider": "bfl",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fblackforestlabs.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "voyage/voyage-code-2",
        "name": "Voyage Code 2",
        "provider": "voyage",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fvoyage.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "voyage/voyage-code-3",
        "name": "Voyage Code 3",
        "provider": "voyage",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fvoyage.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "voyage/voyage-finance-2",
        "name": "Voyage Finance 2",
        "provider": "voyage",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fvoyage.png&w=64&q=75",
        "description": ""
    },
    {
        "id": "voyage/voyage-law-2",
        "name": "Voyage Law 2",
        "provider": "voyage",
        "image": "https://vercel.com/vc-ap-vercel-marketing/_next/image?url=https%3A%2F%2F7nyt0uhk7sse4zvn.public.blob.vercel-storage.com%2Fdocs-assets%2Fstatic%2Fdocs%2Fai-gateway%2Flogos%2Fvoyage.png&w=64&q=75",
        "description": ""
    }
];

// Top models for quick access (order preserved)
export const TOP_CHAT_MODEL_IDS = [
  "anthropic/claude-sonnet-4.5",
  "anthropic/claude-opus-4.6",
  "anthropic/claude-haiku-4.5",
  "openai/gpt-5.2",
  "openai/gpt-5-chat",
  "openai/gpt-4.1-mini",
  "google/gemini-3-flash",
  "google/gemini-3-pro-preview",
  "google/gemini-2.5-flash-lite",
  "deepseek/deepseek-v3.2",
  "xai/grok-4.1-fast-non-reasoning",
] as const;

export const topChatModels: ChatModel[] = TOP_CHAT_MODEL_IDS.map((id) =>
  chatModels.find((m) => m.id === id)
).filter((m): m is ChatModel => m != null);

// Group models by provider for UI
export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
