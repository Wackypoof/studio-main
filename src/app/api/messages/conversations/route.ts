import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// Types for RPC function response
interface ConversationDetail {
  conversation_id: string;
  conversation_title: string | null;
  listing_id: string | null;
  conversation_created_at: string;
  conversation_updated_at: string;
  participant_count: number;
  unread_count: number;
  last_message_id: string | null;
  last_message_content: string | null;
  last_message_sender_id: string | null;
  last_message_created_at: string | null;
  last_message_sender_full_name: string | null;
  last_message_sender_avatar_url: string | null;
}

interface ParticipantData {
  conversation_id: string;
  user_id: string;
  role: string;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  } | null;
}

// Schema for creating a conversation
const createConversationSchema = z.object({
  title: z.string().optional(),
  listing_id: z.string().uuid().optional(),
  participant_ids: z.array(z.string().uuid()).min(1, 'At least one participant is required')
});

// GET /api/messages/conversations - List conversations for the current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Use optimized RPC function to get all conversation data in a single query
    // This eliminates N+1 queries (was: 1 + 2N queries, now: 1 query)
    const { data: conversationDetails, error: rpcError } = await supabase
      .rpc('get_conversations_with_details', {
        p_user_id: user.id,
        p_limit: limit,
        p_offset: offset
      });

    if (rpcError) {
      console.error('Error fetching conversations:', rpcError);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }

    // Get all unique conversation IDs to fetch participants
    const conversationIds = (conversationDetails || []).map((c: ConversationDetail) => c.conversation_id);

    if (!conversationIds.length) {
      return NextResponse.json({
        conversations: [],
        has_more: false,
      });
    }

    // Fetch participants for all conversations in one query
    const { data: allParticipants, error: participantsError } = await supabase
      .from('conversation_participants')
      .select(`
        conversation_id,
        user_id,
        role,
        profiles:profiles(
          id,
          full_name,
          avatar_url
        )
      `)
      .in('conversation_id', conversationIds);

    if (participantsError) {
      console.error('Error fetching participants:', participantsError);
      return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
    }

    // Group participants by conversation ID
    const participantsByConversation = (allParticipants || []).reduce((acc: Record<string, any[]>, p: any) => {
      if (!acc[p.conversation_id]) {
        acc[p.conversation_id] = [];
      }
      if (p.user_id !== user.id) {
        const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
        acc[p.conversation_id].push({
          user_id: p.user_id,
          role: p.role,
          full_name: profile?.full_name || '',
          avatar_url: profile?.avatar_url || null,
        });
      }
      return acc;
    }, {} as Record<string, any[]>);

    // Transform the data to match the expected format
    const transformedConversations = (conversationDetails || []).map((conv: ConversationDetail) => ({
      id: conv.conversation_id,
      title: conv.conversation_title,
      listing_id: conv.listing_id,
      created_at: conv.conversation_created_at,
      updated_at: conv.conversation_updated_at,
      participants: participantsByConversation[conv.conversation_id] || [],
      last_message: conv.last_message_id ? {
        id: conv.last_message_id,
        content: conv.last_message_content,
        sender_id: conv.last_message_sender_id,
        created_at: conv.last_message_created_at,
        sender: {
          id: conv.last_message_sender_id,
          full_name: conv.last_message_sender_full_name,
          avatar_url: conv.last_message_sender_avatar_url
        }
      } : null,
      unread_count: Number(conv.unread_count) || 0,
      participant_count: Number(conv.participant_count) || 0
    }));

    return NextResponse.json({
      conversations: transformedConversations,
      has_more: transformedConversations.length === limit
    });

  } catch (error) {
    console.error('Error in conversations API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/messages/conversations - Create a new conversation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createConversationSchema.parse(body);

    // Create the conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        title: validatedData.title,
        listing_id: validatedData.listing_id
      })
      .select()
      .single();

    if (conversationError) {
      console.error('Error creating conversation:', conversationError);
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }

    // Add all participants (including the creator)
    const allParticipantIds = [user.id, ...validatedData.participant_ids];
    const uniqueParticipantIds = [...new Set(allParticipantIds)];

    const participants = uniqueParticipantIds.map(participantId => ({
      conversation_id: conversation.id,
      user_id: participantId,
      role: participantId === user.id ? 'admin' : 'participant'
    }));

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert(participants);

    if (participantsError) {
      console.error('Error adding participants:', participantsError);
      return NextResponse.json({ error: 'Failed to add participants' }, { status: 500 });
    }

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        title: conversation.title,
        listing_id: conversation.listing_id,
        created_at: conversation.created_at,
        updated_at: conversation.updated_at,
        participants: participants.map(p => ({ user_id: p.user_id, role: p.role })),
        participant_count: participants.length
      }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }

    console.error('Error in create conversation API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
