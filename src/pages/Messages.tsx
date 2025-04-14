
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, SendIcon, PaperclipIcon, InfoIcon } from 'lucide-react';

// Mock data for messages
const mockChats = [
  {
    id: 1,
    person: {
      name: 'Dr. Sarah Johnson',
      avatar: '/placeholder.svg',
      role: 'Professor',
      status: 'online'
    },
    lastMessage: {
      text: 'Please submit your assignment by Friday',
      time: '10:30 AM',
      isRead: true,
      sender: 'them'
    },
    unread: 0
  },
  {
    id: 2,
    person: {
      name: 'Academic Department',
      avatar: '/placeholder.svg',
      role: 'Department',
      status: 'online'
    },
    lastMessage: {
      text: 'Your request for subject change has been approved',
      time: 'Yesterday',
      isRead: false,
      sender: 'them'
    },
    unread: 1
  },
  {
    id: 3,
    person: {
      name: 'Prof. Robert Chen',
      avatar: '/placeholder.svg',
      role: 'Professor',
      status: 'offline'
    },
    lastMessage: {
      text: 'Thank you for your presentation today',
      time: 'Yesterday',
      isRead: true,
      sender: 'them'
    },
    unread: 0
  },
  {
    id: 4,
    person: {
      name: 'Library Services',
      avatar: '/placeholder.svg',
      role: 'Services',
      status: 'offline'
    },
    lastMessage: {
      text: 'Your book is due for return in 2 days',
      time: '2 days ago',
      isRead: true,
      sender: 'them'
    },
    unread: 0
  },
  {
    id: 5,
    person: {
      name: 'Examination Cell',
      avatar: '/placeholder.svg',
      role: 'Department',
      status: 'offline'
    },
    lastMessage: {
      text: 'Your exam schedule has been updated',
      time: '3 days ago',
      isRead: true,
      sender: 'them'
    },
    unread: 0
  }
];

// Sample messages for a conversation
const sampleConversation = [
  {
    id: 1,
    text: 'Hello, I wanted to discuss the assignment due next week.',
    sender: 'user',
    time: '10:15 AM'
  },
  {
    id: 2,
    text: 'Good morning! Sure, what questions do you have about the assignment?',
    sender: 'them',
    time: '10:18 AM'
  },
  {
    id: 3,
    text: 'I was wondering if we could have an extension for the submission deadline?',
    sender: 'user',
    time: '10:20 AM'
  },
  {
    id: 4,
    text: 'What\'s the reason for needing an extension?',
    sender: 'them',
    time: '10:22 AM'
  },
  {
    id: 5,
    text: 'I have two other major assignments due on the same day, and I\'m finding it difficult to complete all of them on time while maintaining quality.',
    sender: 'user',
    time: '10:25 AM'
  },
  {
    id: 6,
    text: 'I understand. I can give a 2-day extension, but please ensure your work is complete and thorough.',
    sender: 'them',
    time: '10:30 AM'
  }
];

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(mockChats[0]);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredChats = mockChats.filter(chat => 
    chat.person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      // For now we'll just clear the input
      setMessage('');
    }
  };
  
  return (
    <DashboardLayout title="Messages">
      <div className="flex h-[calc(100vh-170px)] overflow-hidden">
        {/* Sidebar - Chat List */}
        <Card className="w-full sm:w-96 flex-shrink-0 mr-0 sm:mr-4 overflow-hidden flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input 
                placeholder="Search messages..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {filteredChats.length > 0 ? (
              filteredChats.map(chat => (
                <div 
                  key={chat.id}
                  className={`p-3 flex items-start hover:bg-gray-50 cursor-pointer transition-colors ${selectedChat.id === chat.id ? 'bg-gray-50' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.person.avatar} alt={chat.person.name} />
                      <AvatarFallback>{chat.person.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${chat.person.status === 'online' ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-gray-900 truncate">{chat.person.name}</h3>
                      <span className="text-xs text-gray-500">{chat.lastMessage.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage.text}</p>
                    <div className="mt-1 flex items-center">
                      <span className="text-xs text-gray-500">{chat.person.role}</span>
                      {chat.unread > 0 && (
                        <Badge className="ml-2 text-xs px-1.5" variant="destructive">{chat.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={selectedChat.person.avatar} alt={selectedChat.person.name} />
                    <AvatarFallback>{selectedChat.person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedChat.person.name}</h3>
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${selectedChat.person.status === 'online' ? 'bg-green-400' : 'bg-gray-300'}`}></span>
                      <span className="text-xs text-gray-600 capitalize">{selectedChat.person.status}</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <InfoIcon className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {sampleConversation.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'them' && (
                      <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
                        <AvatarImage src={selectedChat.person.avatar} alt={selectedChat.person.name} />
                        <AvatarFallback>{selectedChat.person.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-lpu-blue text-white' : 'bg-gray-100 text-gray-800'} p-3 rounded-lg`}>
                      <p>{msg.text}</p>
                      <div className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Message Input */}
              <div className="p-3 border-t">
                <div className="flex items-center">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <PaperclipIcon className="h-5 w-5" />
                  </Button>
                  <Input 
                    placeholder="Type a message..." 
                    className="mx-2" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="icon" className="rounded-full" onClick={handleSendMessage}>
                    <SendIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-gray-700 font-medium mb-2">Select a conversation</h3>
                <p className="text-gray-500 text-sm">Choose a chat from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
