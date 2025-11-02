-- Create optimized function to get conversations with latest message and unread count
-- This eliminates N+1 queries by using LATERAL joins to fetch all data in a single query
CREATE OR REPLACE FUNCTION public.get_conversations_with_details(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  conversation_id UUID,
  conversation_title TEXT,
  listing_id UUID,
  conversation_created_at TIMESTAMP WITH TIME ZONE,
  conversation_updated_at TIMESTAMP WITH TIME ZONE,
  participant_count BIGINT,
  unread_count BIGINT,
  last_message_id UUID,
  last_message_content TEXT,
  last_message_sender_id UUID,
  last_message_created_at TIMESTAMP WITH TIME ZONE,
  last_message_sender_full_name TEXT,
  last_message_sender_avatar_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH user_conversations AS (
    -- Get all conversations the user participates in
    SELECT 
      c.id,
      c.title,
      c.listing_id,
      c.created_at,
      c.updated_at
    FROM public.conversations c
    INNER JOIN public.conversation_participants cp 
      ON c.id = cp.conversation_id
    WHERE cp.user_id = p_user_id
    ORDER BY c.updated_at DESC
    LIMIT p_limit
    OFFSET p_offset
  ),
  conversation_stats AS (
    -- Get participant count for each conversation
    SELECT 
      cp.conversation_id,
      COUNT(*) as participant_count
    FROM public.conversation_participants cp
    WHERE cp.conversation_id IN (SELECT id FROM user_conversations)
    GROUP BY cp.conversation_id
  ),
  unread_stats AS (
    -- Get unread count for each conversation (messages not from the user and not read)
    SELECT 
      m.conversation_id,
      COUNT(*) as unread_count
    FROM public.messages m
    WHERE m.conversation_id IN (SELECT id FROM user_conversations)
      AND m.sender_id != p_user_id
      AND m.is_read = FALSE
    GROUP BY m.conversation_id
  ),
  latest_messages AS (
    -- Get the latest message for each conversation
    SELECT DISTINCT ON (m.conversation_id)
      m.conversation_id,
      m.id as message_id,
      m.content,
      m.sender_id,
      m.created_at,
      p.full_name as sender_full_name,
      p.avatar_url as sender_avatar_url
    FROM public.messages m
    INNER JOIN public.profiles p ON m.sender_id = p.id
    WHERE m.conversation_id IN (SELECT id FROM user_conversations)
    ORDER BY m.conversation_id, m.created_at DESC
  )
  SELECT 
    uc.id,
    uc.title,
    uc.listing_id,
    uc.created_at,
    uc.updated_at,
    COALESCE(cs.participant_count, 0),
    COALESCE(us.unread_count, 0),
    lm.message_id,
    lm.content,
    lm.sender_id,
    lm.created_at,
    lm.sender_full_name,
    lm.sender_avatar_url
  FROM user_conversations uc
  LEFT JOIN conversation_stats cs ON uc.id = cs.conversation_id
  LEFT JOIN unread_stats us ON uc.id = us.conversation_id
  LEFT JOIN latest_messages lm ON uc.id = lm.conversation_id
  ORDER BY uc.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_conversations_with_details TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION public.get_conversations_with_details IS 
'Efficiently fetches conversations with latest message and unread count in a single query. Eliminates N+1 query problem.';
