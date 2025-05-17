
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatusIndicator from './user/StatusIndicator';
import { UserStatus } from '@/types/onlineGame';

interface PlayerAvatarProps {
  name: string;
  image?: string;
  size?: 'sm' | 'md' | 'lg';
  highlighted?: boolean;
  count?: number;
  status?: UserStatus;
}

const PlayerAvatar = ({ 
  name, 
  image, 
  size = 'md', 
  highlighted = false, 
  count,
  status
}: PlayerAvatarProps) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
    
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg'
  };
  
  const getRandomColor = () => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    
    // Use a hash of the name to get a consistent color
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`${sizeClasses[size]} ${highlighted ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
        <AvatarImage src={image} />
        <AvatarFallback className={getRandomColor()}>
          {initials}
        </AvatarFallback>
      </Avatar>
      
      {status && (
        <div className="absolute -bottom-1 -right-1">
          <StatusIndicator status={status} size={size === 'lg' ? 'md' : 'sm'} />
        </div>
      )}
      
      {count !== undefined && (
        <div className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {count}
        </div>
      )}
    </div>
  );
};

export default PlayerAvatar;
