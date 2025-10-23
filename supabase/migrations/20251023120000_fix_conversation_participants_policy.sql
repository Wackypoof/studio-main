-- Fix recursive RLS policy on conversation_participants by using a helper function
-- that checks membership without triggering RLS recursion.

-- Helper function: checks if a user is a participant of a conversation.
-- SECURITY DEFINER ensures the query runs with the function owner's privileges
-- (table owner), which bypasses RLS to avoid recursion.
CREATE OR REPLACE FUNCTION public.is_user_in_conversation(
  conv_id uuid,
  uid uuid
) RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversation_participants cp
    WHERE cp.conversation_id = conv_id
      AND cp.user_id = uid
  );
$$;

-- Replace the recursive policy on conversation_participants SELECT with one that
-- relies on the helper function instead of self-querying the same table.
DROP POLICY IF EXISTS "Users can view participants of conversations they are in"
  ON public.conversation_participants;

CREATE POLICY "Users can view participants of conversations they are in"
  ON public.conversation_participants
  FOR SELECT
  USING (
    public.is_user_in_conversation(conversation_participants.conversation_id, auth.uid())
  );

-- Note: Other policies on conversations/messages can continue to reference
-- conversation_participants directly since they are not self-referential.
-- If desired, they can be refactored to call is_user_in_conversation(...) for consistency.

