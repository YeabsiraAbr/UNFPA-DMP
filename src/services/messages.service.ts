/**
 * Messaging API client. Maps backend responses with { data: ... } into { success, conversations|messages|conversation|message }.
 * See src/app/dashboard/messages/page.tsx for which methods the UI actually calls.
 */
import { api } from "./api-client";
import type { Conversation, Message, SuccessResponse } from "./types";

export const messagesService = {
  async listConversations(params?: {
    folder?: "inbox" | "outbox";
    search?: string;
  }): Promise<{ success: boolean; conversations: Conversation[] }> {
    const raw = await api.get<Record<string, unknown>>("/messages/conversations", { params });
    const conversations = (raw.data ?? raw.conversations ?? []) as Conversation[];
    return { success: true, conversations };
  },

  async getOrCreateConversation(otherUserId: string): Promise<{ success: boolean; conversation: Conversation }> {
    const raw = await api.post<Record<string, unknown>>("/messages/conversations", { body: { otherUserId } });
    const conversation = (raw.data ?? raw.conversation ?? raw) as Conversation;
    return { success: true, conversation };
  },

  async getConversation(id: string): Promise<{ success: boolean; conversation: Conversation }> {
    const raw = await api.get<Record<string, unknown>>(`/messages/conversations/${id}`);
    const conversation = (raw.data ?? raw.conversation ?? raw) as Conversation;
    return { success: true, conversation };
  },

  async listMessages(conversationId: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; messages: Message[] }> {
    const raw = await api.get<Record<string, unknown>>(`/messages/conversations/${conversationId}/messages`, { params });
    const messages = (raw.data ?? raw.messages ?? []) as Message[];
    return { success: true, messages };
  },

  async sendMessage(conversationId: string, data: {
    body: string;
    attachmentUrl?: string;
  }): Promise<{ success: boolean; message: Message }> {
    const raw = await api.post<Record<string, unknown>>(`/messages/conversations/${conversationId}/messages`, { body: data });
    const message = (raw.data ?? raw.message ?? raw) as Message;
    return { success: true, message };
  },

  async markConversationRead(conversationId: string): Promise<SuccessResponse> {
    await api.patch(`/messages/conversations/${conversationId}/read`);
    return { success: true };
  },

  async markMessageRead(messageId: string): Promise<SuccessResponse> {
    await api.patch(`/messages/messages/${messageId}/read`);
    return { success: true };
  },
};
