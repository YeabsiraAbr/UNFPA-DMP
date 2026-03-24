import { api } from "./api-client";
import type { Conversation, Message, SuccessResponse } from "./types";

export const messagesService = {
  async listConversations(params?: {
    folder?: "inbox" | "outbox";
    search?: string;
  }): Promise<{ success: boolean; conversations: Conversation[] }> {
    return api.get("/messages/conversations", { params });
  },

  async getOrCreateConversation(otherUserId: string): Promise<{ success: boolean; conversation: Conversation }> {
    return api.post("/messages/conversations", { body: { otherUserId } });
  },

  async getConversation(id: string): Promise<{ success: boolean; conversation: Conversation }> {
    return api.get(`/messages/conversations/${id}`);
  },

  async listMessages(conversationId: string, params?: {
    limit?: number;
    offset?: number;
  }): Promise<{ success: boolean; messages: Message[] }> {
    return api.get(`/messages/conversations/${conversationId}/messages`, { params });
  },

  async sendMessage(conversationId: string, data: {
    body: string;
    attachmentUrl?: string;
  }): Promise<{ success: boolean; message: Message }> {
    return api.post(`/messages/conversations/${conversationId}/messages`, { body: data });
  },

  async markConversationRead(conversationId: string): Promise<SuccessResponse> {
    return api.patch(`/messages/conversations/${conversationId}/read`);
  },

  async markMessageRead(messageId: string): Promise<SuccessResponse> {
    return api.patch(`/messages/messages/${messageId}/read`);
  },
};
