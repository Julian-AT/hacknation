import type {
  ConversationMessage,
  MemoryProvider,
  MemoryScope,
  WorkingMemory,
} from "@ai-sdk-tools/memory";

export {
  DEFAULT_TEMPLATE,
  formatWorkingMemory,
  getWorkingMemoryInstructions,
} from "@ai-sdk-tools/memory";

import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { conversationMessages, workingMemory } from "../db/schema";

/**
 * Working memory template for CareMap healthcare analysis.
 */
export const CAREMAP_MEMORY_TEMPLATE = `# Working Memory

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
 * Custom Drizzle-based memory provider for CareMap.
 * Uses the existing PostgreSQL database via Drizzle ORM.
 */
export class CareMapMemoryProvider implements MemoryProvider {
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

export const memoryProvider = new CareMapMemoryProvider();
