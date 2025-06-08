
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useFriends } from '@/hooks/useFriends';
import { useAuth } from '@/hooks/useAuth';
import { Users, UserPlus, Check, X, Search } from 'lucide-react';
import { toast } from 'sonner';

const FriendsDialog = () => {
  const { user } = useAuth();
  const { friends, pendingRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useFriends(user?.id);
  const [open, setOpen] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');

  const handleSendRequest = async () => {
    if (!searchEmail.trim()) return;
    
    // Dans un vrai projet, on chercherait l'utilisateur par email
    // Pour la démo, on simule avec un ID aléatoire
    try {
      await sendFriendRequest('demo-user-id');
      setSearchEmail('');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="h-4 w-4" />
          Amis
          {pendingRequests.length > 0 && (
            <Badge variant="destructive" className="ml-1">
              {pendingRequests.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mes amis</DialogTitle>
          <DialogDescription>
            Gérez votre liste d'amis et envoyez des invitations
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="friends">Amis</TabsTrigger>
            <TabsTrigger value="requests">
              Demandes
              {pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="add">Ajouter</TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-3">
            {friends.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun ami pour le moment</p>
              </div>
            ) : (
              friends.map((friendship) => (
                <div key={friendship.id} className="flex items-center gap-3 p-2 rounded-md border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>AM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Ami #{friendship.friend_id.slice(-4)}</p>
                    <p className="text-xs text-muted-foreground">En ligne</p>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-3">
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune demande en attente</p>
              </div>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-3 p-2 rounded-md border">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Demande de #{request.user_id.slice(-4)}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => acceptFriendRequest(request.id)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => rejectFriendRequest(request.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Email de l'ami à ajouter"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                />
                <Button onClick={handleSendRequest} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Entrez l'email d'un utilisateur pour lui envoyer une demande d'ami
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default FriendsDialog;
