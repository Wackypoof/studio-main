'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Filter, User, Mail, Phone, MessageSquare, Calendar, Clock, 
  ChevronDown, MoreVertical, Paperclip, Send, Smile, Check, CheckCheck, 
  ArrowLeft, Phone as PhoneIcon, Video, UserPlus, Mail as MailIcon, Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { mockData } from '@/lib/data';
import { PageHeader } from '@/components/page-header';

// Mock data for messages
const generateConversations = () => {
  const statuses = ['read', 'unread'];
  const listings = ['Dental Clinic', 'Tuition Center', 'Fashion Boutique', 'Cafe', 'Manufacturing'];
  
  return Array.from({ length: 8 }, (_, i) => {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const lastMessageTime = new Date();
    lastMessageTime.setDate(lastMessageTime.getDate() - daysAgo);
    
    return {
      id: `conv_${i + 1}`,
      contact: {
        id: `contact_${i + 1}`,
        name: `Contact ${i + 1}`,
        email: `contact${i + 1}@example.com`,
        phone: `+65 ${Math.floor(80000000 + Math.random() * 20000000)}`,
        company: `Company ${String.fromCharCode(65 + i)}`,
        avatar: `https://i.pravatar.cc/150?u=contact_${i + 1}`,
      },
      listing: listings[Math.floor(Math.random() * listings.length)],
      status,
      lastMessage: `Hello, I'm interested in your ${listings[Math.floor(Math.random() * listings.length)]} listing. Can we schedule a call to discuss further?`,
      lastMessageTime: lastMessageTime.toISOString(),
      unreadCount: status === 'unread' ? Math.floor(Math.random() * 5) + 1 : 0,
    };
  });
};

// Mock message thread
const generateMessages = (conversationId: string) => {
  return Array.from({ length: 10 }, (_, i) => {
    const isUser = i % 3 === 0; // Every 3rd message is from the user
    const hoursAgo = i * 2;
    const messageTime = new Date();
    messageTime.setHours(messageTime.getHours() - hoursAgo);
    
    return {
      id: `msg_${conversationId}_${i}`,
      text: isUser 
        ? [
            "Hello, I'm interested in your listing.",
            "Can you provide more details about the business?",
            "What's the asking price?",
            "Can we schedule a call?",
            "Thanks for the information!"
          ][i % 5]
        : [
            "Thank you for your interest in our listing. What would you like to know?",
            "The business has been operating for 5 years with consistent revenue growth.",
            "The asking price is $500,000. We're open to reasonable offers.",
            "Yes, I'm available for a call tomorrow. What time works for you?",
            "You're welcome! Let me know if you have any other questions."
          ][i % 5],
      sender: isUser ? 'user' : 'contact',
      time: messageTime.toISOString(),
      status: i === 0 ? 'sent' : 'delivered',
      read: i > 3, // First few messages are unread
    };
  }).reverse(); // Most recent messages at the bottom
};

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  // Generate mock conversations
  const conversations = useMemo(() => generateConversations(), []);
  
  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations
      .filter(conv => {
        const matchesSearch = 
          conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          conv.listing.toLowerCase().includes(searchTerm.toLowerCase());
          
        const matchesTab = 
          activeTab === 'all' || 
          (activeTab === 'unread' && conv.status === 'unread') ||
          (activeTab === 'archived' && conv.status === 'archived');
          
        return matchesSearch && matchesTab;
      })
      .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());
  }, [conversations, searchTerm, activeTab]);
  
  // Get messages for selected conversation
  const messages = useMemo(() => {
    return selectedConversation ? generateMessages(selectedConversation) : [];
  }, [selectedConversation]);
  
  // Get current conversation details
  const currentConversation = useMemo(() => {
    return conversations.find(conv => conv.id === selectedConversation);
  }, [conversations, selectedConversation]);
  
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    // In a real app, this would send the message to the server
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };
  
  const formatMessageTime = (dateString: string) => {
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
  };
  
  const getUnreadCount = () => {
    return conversations.filter(conv => conv.status === 'unread').length;
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <PageHeader
        title="Messages"
        description="Communicate with potential buyers and manage your conversations"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className={`${selectedConversation ? 'hidden md:block md:w-1/3 lg:w-1/4' : 'w-full'} border-r`}>
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <Tabs 
                defaultValue="all" 
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    <div className="flex items-center">
                      <span>Unread</span>
                      {getUnreadCount() > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                          {getUnreadCount()}
                        </Badge>
                      )}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="archived">Archived</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-1">No conversations found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm 
                      ? 'No conversations match your search.' 
                      : 'You have no messages yet.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className={`p-4 hover:bg-muted/50 cursor-pointer ${selectedConversation === conversation.id ? 'bg-muted/50' : ''}`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.contact.avatar} alt={conversation.contact.name} />
                            <AvatarFallback>{conversation.contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium truncate">{conversation.contact.name}</h4>
                              <span className="text-xs text-muted-foreground">
                                {formatMessageTime(conversation.lastMessageTime)}
                              </span>
                            </div>
                            <p className="text-sm font-medium truncate">{conversation.listing}</p>
                            <p className={`text-sm truncate ${conversation.status === 'unread' ? 'font-medium' : 'text-muted-foreground'}`}>
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Chat Area */}
        {selectedConversation ? (
          <div className={`${selectedConversation ? 'w-full md:w-2/3 lg:w-3/4' : 'hidden'} flex flex-col h-full`}>
            {/* Chat Header */}
            <div className="border-b p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentConversation?.contact.avatar} alt={currentConversation?.contact.name} />
                  <AvatarFallback>{currentConversation?.contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="font-medium">{currentConversation?.contact.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {currentConversation?.contact.company} • {currentConversation?.listing}
                  </p>
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
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-background border'
                    }`}
                  >
                    <p>{message.text}</p>
                    <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                      message.sender === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      <span>{formatMessageTime(message.time)}</span>
                      {message.sender === 'user' && (
                        message.read ? (
                          <CheckCheck className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                  placeholder={`Message ${currentConversation?.contact.name}...`}
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
                  <Button 
                    size="sm" 
                    className="h-8"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-muted/20">
            <div className="text-center max-w-md p-6 space-y-2">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list or start a new one to begin messaging.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
