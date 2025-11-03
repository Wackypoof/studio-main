"use client";

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface Conversation {
  id: string;
  title?: string;
  listing_id?: string;
  created_at: string;
  updated_at: string;
  participants: Array<{
    user_id: string;
    role: string;
  }>;
  last_message?: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
    sender: {
      id: string;
      full_name: string;
      avatar_url?: string;
    };
  };
  unread_count: number;
  participant_count: number;
}

export interface Message {
  id: string;
  content: string;
  message_type: 'text' | 'file';
  file_url?: string;
  file_name?: string;
  file_size?: number;
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender_id: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url?: string;
  };
}

export interface SendMessageData {
  content: string;
  message_type?: 'text' | 'file';
  file_url?: string;
  file_name?: string;
  file_size?: number;
}

const supabase = createSupabaseClient();

// Hook for fetching conversations
// Note: Real-time updates are handled by useMessagingSubscription
// Polling removed to avoid redundant traffic - subscriptions handle updates
export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async (): Promise<{ conversations: Conversation[]; has_more: boolean }> => {
      const response = await fetch('/api/messages/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      return response.json();
    },
    // No polling - rely on real-time subscriptions for updates
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}

// Hook for fetching messages in a conversation
// Note: Real-time updates are handled by useMessagingSubscription
// Polling removed to avoid redundant traffic - subscriptions handle updates
export function useMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async (): Promise<{ messages: Message[]; has_more: boolean }> => {
      if (!conversationId) return { messages: [], has_more: false };

      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`);
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      return response.json();
    },
    enabled: !!conversationId,
    // No polling - rely on real-time subscriptions for updates
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    staleTime: 1000 * 30, // Consider data fresh for 30 seconds
  });
}

// Hook for creating a conversation
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title?: string;
      listing_id?: string;
      participant_ids: string[];
    }) => {
      const response = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create conversation');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      toast.success('Conversation created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook for sending a message
export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendMessageData) => {
      const response = await fetch(`/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch conversations and messages
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });

      // Optimistically update the conversation's last message
      queryClient.setQueryData(['conversations'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          conversations: oldData.conversations?.map((conv: Conversation) =>
            conv.id === conversationId
              ? { ...conv, updated_at: new Date().toISOString() }
              : conv
          )
        };
      });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// Hook for real-time messaging subscriptions
export function useMessagingSubscription(conversationId: string | null) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received:', payload);

          // Invalidate queries to refetch new data
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Handle message updates (like read status)
          queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, queryClient]);
}

// Hook for keeping the conversation list in sync across tabs and new messages
export function useConversationsSubscription(userId?: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const messagesChannel = supabase
      .channel(`messaging:user:${userId}:messages`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    const participantsChannel = supabase
      .channel(`messaging:user:${userId}:participants`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversation_participants',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [queryClient, userId]);
}

// Hook for marking messages as read
export function useMarkAsRead(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/messages/conversations/${conversationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read_at: new Date().toISOString() }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to mark as read');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
    },
    onError: (error: Error) => {
      console.error('Error marking as read:', error);
    },
  });
}

// Hook for typing indicators (placeholder for future implementation)
export function useTypingIndicator(conversationId: string, userId: string) {
  const [isTyping, setIsTyping] = useState(false);

  const startTyping = useCallback(() => {
    setIsTyping(true);
    // In a real implementation, you'd broadcast this to other participants
  }, []);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    // In a real implementation, you'd stop broadcasting
  }, []);

  return { isTyping, startTyping, stopTyping };
}
