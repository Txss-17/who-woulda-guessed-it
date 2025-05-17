
import React from 'react';
import { Message } from '@/types/onlineGame';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-60 text-muted-foreground">
        Aucun message pour le moment
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === currentUserId;
          
          return (
            <div 
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isOwnMessage && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{message.senderName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`
                  rounded-lg px-4 py-2 
                  ${isOwnMessage 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                  }
                `}>
                  {!isOwnMessage && (
                    <div className="text-xs font-medium mb-1">{message.senderName}</div>
                  )}
                  <p className="text-sm">{message.content}</p>
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {formatDistanceToNow(message.timestamp, { 
                      addSuffix: true,
                      locale: fr
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default MessageList;
