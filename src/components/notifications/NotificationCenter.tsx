
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Check, CheckCheck, Users, MessageSquare, Trophy, Gamepad2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const NotificationCenter = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user?.id);
  const [open, setOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'party_invite': return <Gamepad2 className="h-4 w-4 text-blue-500" />;
      case 'friend_request': return <Users className="h-4 w-4 text-green-500" />;
      case 'message': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'turn_start': return <Bell className="h-4 w-4 text-orange-500" />;
      case 'party_result': return <Trophy className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Notifications
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Tout marquer comme lu
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            Restez informé de toute l'activité
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] w-full">
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucune notification</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-colors
                    ${notification.read 
                      ? 'bg-background hover:bg-secondary/50' 
                      : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                    }
                  `}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                          locale: fr
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationCenter;
