'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RoleAwareButton } from '@/components/dashboard/RoleAwareButton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search, MessageSquare, Paperclip, Send, Smile, Check, CheckCheck,
  ArrowLeft, Phone as PhoneIcon, Video, User, Mail as MailIcon, MoreVertical, Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';
import { useAuthState } from '@/hooks/useAuthState';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMessagingSubscription,
  useMarkAsRead,
  type Conversation,
  type Message,
} from '@/hooks/useMessaging';

function formatMessageTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  const { user } = useAuthState();
  const currentUserId = user?.id;

  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations();
  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(selectedConversation);
  const sendMessageMutation = useSendMessage(selectedConversation || '');
  const { mutate: markAsRead } = useMarkAsRead(selectedConversation || '');

  useMessagingSubscription(selectedConversation);

  const conversations = useMemo(() => {
    return (conversationsData?.conversations || []) as Conversation[];
  }, [conversationsData]);

  const filteredConversations = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return conversations
      .filter((conv) => {
        const other = (conv.participants as any)?.[0];
        const title = conv.title || '';
        const last = conv.last_message?.content || '';
        const name = other?.full_name || conv.last_message?.sender?.full_name || '';
        const matchesSearch =
          title.toLowerCase().includes(term) ||
          name.toLowerCase().includes(term) ||
          last.toLowerCase().includes(term);
        const hasUnread = conv.unread_count > 0;
        const matchesTab = activeTab === 'all' || (activeTab === 'unread' && hasUnread);
        return matchesSearch && matchesTab;
      })
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }, [conversations, searchTerm, activeTab]);

  const messages = useMemo(() => {
    return (messagesData?.messages || []) as Message[];
  }, [messagesData]);

  useEffect(() => {
    if (selectedConversation && !isLoadingMessages) {
      markAsRead();
    }
  }, [selectedConversation, isLoadingMessages, markAsRead]);

  const unreadCount = useMemo(() => {
    return conversations.reduce((sum, c) => sum + (c.unread_count || 0), 0);
  }, [conversations]);

  function handleSendMessage() {
    if (!newMessage.trim() || !selectedConversation) return;
    sendMessageMutation.mutate(
      { content: newMessage.trim(), message_type: 'text' },
      { onSuccess: () => setNewMessage('') }
    );
  }

  const currentConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversation);
  }, [conversations, selectedConversation]);

  const otherParticipant = useMemo(() => {
    const other: any = currentConversation?.participants?.[0];
    const name = other?.full_name || currentConversation?.last_message?.sender?.full_name || 'Conversation';
    const avatar = other?.avatar_url || currentConversation?.last_message?.sender?.avatar_url;
    return { name, avatar };
  }, [currentConversation]);

  return (
    <div className="w-full flex flex-col h-[calc(100vh-200px)]">
      <PageHeader title="Messages" description="Communicate with potential buyers and manage your conversations" />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${selectedConversation ? 'hidden md:block md:w-1/3 lg:w-1/4' : 'w-full'}`}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b space-y-3">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">
                    <div className="flex items-center">
                      <span>Unread</span>
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                          {unreadCount}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoadingConversations ? (
                <div className="p-4 text-sm text-muted-foreground">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No conversations found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'No conversations match your search.' : 'You have no messages yet.'}
                  </p>
                  <div className="mt-4">
                    <RoleAwareButton asChild size="sm">
                      <Link href="/dashboard/leads">Start new conversation</Link>
                    </RoleAwareButton>
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations.map((conversation) => {
                    const other: any = conversation.participants?.[0];
                    const name = other?.full_name || conversation.last_message?.sender?.full_name || 'Conversation';
                    const avatar = other?.avatar_url || conversation.last_message?.sender?.avatar_url;
                    return (
                      <div
                        key={conversation.id}
                        className={`p-4 hover:bg-muted/50 cursor-pointer ${selectedConversation === conversation.id ? 'bg-muted/50' : ''}`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={avatar} alt={name} />
                              <AvatarFallback>{name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium truncate">{conversation.title || name}</h4>
                                <span className="text-xs text-muted-foreground">{formatMessageTime(conversation.updated_at)}</span>
                              </div>
                              <p className={`text-sm truncate ${conversation.unread_count > 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                                {conversation.last_message?.content || 'No messages yet'}
                              </p>
                            </div>
                          </div>
                          {conversation.unread_count > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">{conversation.unread_count}</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation && (
          <div className={`${selectedConversation ? 'w-full md:w-2/3 lg:w-3/4' : 'hidden'} flex flex-col h-full`}>
            {/* Chat Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedConversation(null)}>
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherParticipant.avatar} alt={otherParticipant.name} />
                  <AvatarFallback>{otherParticipant.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-medium">{currentConversation?.title || otherParticipant.name}</h3>
                  <p className="text-xs text-muted-foreground">{currentConversation?.title ? 'Group conversation' : 'Direct message'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <PhoneIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MailIcon className="mr-2 h-4 w-4" />
                      <span>Send Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete Conversation</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
              {isLoadingMessages ? (
                <div className="text-sm text-muted-foreground">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-sm text-muted-foreground">No messages yet.</div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender_id === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>
                      <p>{message.content}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${message.sender_id === currentUserId ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        <span>{formatMessageTime(message.created_at)}</span>
                        {message.sender_id === currentUserId && (message.is_read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="relative">
                <div className="absolute left-3 top-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>

                <Textarea
                  placeholder={`Message ${otherParticipant.name}...`}
                  className="min-h-[60px] max-h-[200px] resize-y pl-12 pr-20 py-3"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                <div className="absolute right-3 top-3 flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                  <RoleAwareButton size="sm" className="h-8" onClick={handleSendMessage} disabled={!newMessage.trim() || sendMessageMutation.isPending}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </RoleAwareButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
