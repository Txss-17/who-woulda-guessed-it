
import React, { useState } from 'react';
import { Message } from '@/types/onlineGame';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MessagingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId?: string;
  currentUserId: string;
  currentUserName: string;
  players?: { id: string; name: string }[];
}

const MessagingDialog = ({
  open,
  onOpenChange,
  gameId,
  currentUserId,
  currentUserName,
  players = []
}: MessagingDialogProps) => {
  const [activeTab, setActiveTab] = useState('group');
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    // Sample messages for demonstration
    {
      id: '1',
      senderId: 'system',
      senderName: 'Système',
      gameId,
      content: 'Bienvenue dans la messagerie du jeu!',
      timestamp: new Date(),
      read: true
    },
  ]);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      gameId,
      ...(activeTab === 'private' && selectedPlayer ? { recipientId: selectedPlayer } : {}),
      content,
      timestamp: new Date(),
      read: false
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    // In a real app, you would send this to your backend/API
    console.log('Message sent:', newMessage);
  };

  const filteredMessages = messages.filter((msg) => {
    if (activeTab === 'group') {
      return !msg.recipientId && msg.gameId === gameId;
    } else if (activeTab === 'private' && selectedPlayer) {
      return (msg.senderId === currentUserId && msg.recipientId === selectedPlayer) || 
             (msg.senderId === selectedPlayer && msg.recipientId === currentUserId);
    }
    return false;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Messages</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="group" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="group">Groupe</TabsTrigger>
            <TabsTrigger value="private">Privé</TabsTrigger>
          </TabsList>
          
          <TabsContent value="group" className="mt-4 space-y-4">
            <MessageList messages={filteredMessages} currentUserId={currentUserId} />
            <MessageInput 
              onSendMessage={handleSendMessage} 
              placeholder="Message à tous les joueurs..."
            />
          </TabsContent>
          
          <TabsContent value="private" className="mt-4 space-y-4">
            {players.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {players.filter(p => p.id !== currentUserId).map((player) => (
                    <div 
                      key={player.id}
                      className={`p-2 rounded-md cursor-pointer ${
                        selectedPlayer === player.id 
                          ? 'bg-primary/20 border border-primary' 
                          : 'hover:bg-secondary'
                      }`}
                      onClick={() => setSelectedPlayer(player.id)}
                    >
                      {player.name}
                    </div>
                  ))}
                </div>
                
                {selectedPlayer ? (
                  <>
                    <MessageList messages={filteredMessages} currentUserId={currentUserId} />
                    <MessageInput 
                      onSendMessage={handleSendMessage} 
                      placeholder={`Message à ${players.find(p => p.id === selectedPlayer)?.name}...`}
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-60 text-muted-foreground">
                    Sélectionnez un joueur pour chatter
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-60 text-muted-foreground">
                Aucun joueur disponible
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingDialog;
