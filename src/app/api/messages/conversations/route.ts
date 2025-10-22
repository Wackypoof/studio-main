import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

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

    // Get conversations with last message and unread count
    const { data: conversations, error } = await supabase
      .from('conversations')
      .select(`
        id,
        title,
        listing_id,
        created_at,
        updated_at,
        conversation_participants!inner(
          user_id,
          role,
          last_read_at,
          profiles:profiles(
            id,
            full_name,
            avatar_url
          )
        ),
        messages(
          id,
          content,
          sender_id,
          created_at,
          is_read,
          profiles!messages_sender_id_fkey(
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('conversation_participants.user_id', user.id)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }

    // Transform the data to match the expected format
    const transformedConversations = conversations?.map(conv => {
      const participants = conv.conversation_participants || [];
      const messages = conv.messages || [];

      // Get the last message
      const lastMessage = messages
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      // Get other participants (excluding current user)
      const otherParticipants = participants.filter(p => p.user_id !== user.id);

      // Get unread count
      const unreadCount = messages.filter(m =>
        !m.is_read && m.sender_id !== user.id
      ).length;

      return {
        id: conv.id,
        title: conv.title,
        listing_id: conv.listing_id,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        participants: otherParticipants.map((p: any) => ({
          user_id: p.user_id,
          role: p.role,
          full_name: p.profiles?.full_name,
          avatar_url: p.profiles?.avatar_url,
        })),
        last_message: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          sender_id: lastMessage.sender_id,
          created_at: lastMessage.created_at,
          sender: lastMessage.profiles
        } : null,
        unread_count: unreadCount,
        participant_count: participants.length
      };
    }) || [];

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
