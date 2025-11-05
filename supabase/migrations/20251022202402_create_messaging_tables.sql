CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  listing_id UUID, -- Reference to business listings (if you have them)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.conversations
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS title TEXT;

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS listing_id UUID;

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.conversations
  ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE public.conversations
  ALTER COLUMN updated_at SET DEFAULT NOW();

-- Create conversation_participants table
CREATE TABLE IF NOT EXISTS public.conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'participant', -- 'participant', 'admin'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

ALTER TABLE public.conversation_participants
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.conversation_participants
  ADD COLUMN IF NOT EXISTS conversation_id UUID;

ALTER TABLE public.conversation_participants
  ADD COLUMN IF NOT EXISTS user_id UUID;

ALTER TABLE public.conversation_participants
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'participant';

ALTER TABLE public.conversation_participants
  ADD COLUMN IF NOT EXISTS joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.conversation_participants
  ADD COLUMN IF NOT EXISTS last_read_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.conversation_participants
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.conversation_participants
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.conversation_participants
  ALTER COLUMN joined_at SET DEFAULT NOW();

ALTER TABLE public.conversation_participants
  ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE public.conversation_participants
  ALTER COLUMN updated_at SET DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'conversation_participants_conversation_id_user_id_key'
  ) THEN
    ALTER TABLE public.conversation_participants
      ADD CONSTRAINT conversation_participants_conversation_id_user_id_key UNIQUE (conversation_id, user_id);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'conversation_participants_conversation_id_fkey'
  ) THEN
    ALTER TABLE public.conversation_participants
      ADD CONSTRAINT conversation_participants_conversation_id_fkey
      FOREIGN KEY (conversation_id)
      REFERENCES public.conversations(id)
      ON DELETE CASCADE;
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'conversation_participants_user_id_fkey'
  ) THEN
    ALTER TABLE public.conversation_participants
      ADD CONSTRAINT conversation_participants_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES public.profiles(id)
      ON DELETE CASCADE;
  END IF;
END;
$$;

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'file', 'system'
  file_url TEXT, -- For file attachments
  file_name TEXT, -- Original file name
  file_size INTEGER, -- File size in bytes
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.messages
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS conversation_id UUID;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS sender_id UUID;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS content TEXT;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text';

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS file_url TEXT;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS file_name TEXT;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS file_size INTEGER;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE public.messages
  ALTER COLUMN message_type SET DEFAULT 'text';

ALTER TABLE public.messages
  ALTER COLUMN is_read SET DEFAULT FALSE;

ALTER TABLE public.messages
  ALTER COLUMN created_at SET DEFAULT NOW();

ALTER TABLE public.messages
  ALTER COLUMN updated_at SET DEFAULT NOW();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'messages_conversation_id_fkey'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_conversation_id_fkey
      FOREIGN KEY (conversation_id)
      REFERENCES public.conversations(id)
      ON DELETE CASCADE;
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'messages_sender_id_fkey'
  ) THEN
    ALTER TABLE public.messages
      ADD CONSTRAINT messages_sender_id_fkey
      FOREIGN KEY (sender_id)
      REFERENCES public.profiles(id)
      ON DELETE CASCADE;
  END IF;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS conversations_created_at_idx ON public.conversations (created_at DESC);
CREATE INDEX IF NOT EXISTS conversations_updated_at_idx ON public.conversations (updated_at DESC);
CREATE INDEX IF NOT EXISTS conversation_participants_conversation_id_idx ON public.conversation_participants (conversation_id);
CREATE INDEX IF NOT EXISTS conversation_participants_user_id_idx ON public.conversation_participants (user_id);
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON public.messages (conversation_id);
CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages (sender_id);
CREATE INDEX IF NOT EXISTS messages_created_at_idx ON public.messages (created_at DESC);
CREATE INDEX IF NOT EXISTS messages_is_read_idx ON public.messages (is_read);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversations policies
DROP POLICY IF EXISTS "Users can view conversations they participate in" ON public.conversations;
CREATE POLICY "Users can view conversations they participate in"
  ON public.conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = conversations.id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create conversations" ON public.conversations;
CREATE POLICY "Users can create conversations"
  ON public.conversations
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update conversations they participate in" ON public.conversations;
CREATE POLICY "Users can update conversations they participate in"
  ON public.conversations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = conversations.id
      AND user_id = auth.uid()
    )
  );

-- Conversation participants policies
DROP POLICY IF EXISTS "Users can view participants of conversations they are in" ON public.conversation_participants;
CREATE POLICY "Users can view participants of conversations they are in"
  ON public.conversation_participants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can join conversations" ON public.conversation_participants;
CREATE POLICY "Users can join conversations"
  ON public.conversation_participants
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own participation" ON public.conversation_participants;
CREATE POLICY "Users can update their own participation"
  ON public.conversation_participants
  FOR UPDATE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can leave conversations" ON public.conversation_participants;
CREATE POLICY "Users can leave conversations"
  ON public.conversation_participants
  FOR DELETE
  USING (user_id = auth.uid());

-- Messages policies
DROP POLICY IF EXISTS "Users can view messages in conversations they participate in" ON public.messages;
CREATE POLICY "Users can view messages in conversations they participate in"
  ON public.messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can send messages to conversations they participate in" ON public.messages;
CREATE POLICY "Users can send messages to conversations they participate in"
  ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.conversation_participants
      WHERE conversation_id = messages.conversation_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update messages they sent" ON public.messages;
CREATE POLICY "Users can update messages they sent"
  ON public.messages
  FOR UPDATE
  USING (sender_id = auth.uid());

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_conversations_updated_at ON public.conversations;
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_conversation_participants_updated_at ON public.conversation_participants;
CREATE TRIGGER update_conversation_participants_updated_at
  BEFORE UPDATE ON public.conversation_participants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_messages_updated_at ON public.messages;
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically add participants when creating a conversation
CREATE OR REPLACE FUNCTION public.add_conversation_creator()
RETURNS TRIGGER AS $$
BEGIN
  -- Add the creator as a participant
  INSERT INTO public.conversation_participants (conversation_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'admin');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to add creator as participant
DROP TRIGGER IF EXISTS add_conversation_creator_trigger ON public.conversations;
CREATE TRIGGER add_conversation_creator_trigger
  AFTER INSERT ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.add_conversation_creator();

-- Create function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_as_read()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark all messages in the conversation as read for the current user
  UPDATE public.messages
  SET is_read = TRUE, read_at = NOW()
  WHERE conversation_id = NEW.conversation_id
  AND sender_id != NEW.user_id
  AND is_read = FALSE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to mark messages as read when user reads conversation
DROP TRIGGER IF EXISTS mark_messages_as_read_trigger ON public.conversation_participants;
CREATE TRIGGER mark_messages_as_read_trigger
  AFTER UPDATE OF last_read_at ON public.conversation_participants
  FOR EACH ROW
  WHEN (NEW.last_read_at IS NOT NULL AND OLD.last_read_at IS DISTINCT FROM NEW.last_read_at)
  EXECUTE FUNCTION public.mark_messages_as_read();

-- Create function to get unread message count for a user
CREATE OR REPLACE FUNCTION public.get_unread_count(user_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM public.messages m
    WHERE m.is_read = FALSE
    AND m.sender_id != get_unread_count.user_id
    AND EXISTS (
      SELECT 1 FROM public.conversation_participants cp
      WHERE cp.conversation_id = m.conversation_id
      AND cp.user_id = get_unread_count.user_id
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
