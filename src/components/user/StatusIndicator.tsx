
import { UserStatus, userStatusLabels } from '@/types/onlineGame';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface StatusIndicatorProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const StatusIndicator = ({ 
  status, 
  size = 'sm',
  showTooltip = true
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  };
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-400'
  };

  const indicator = (
    <span 
      className={`block rounded-full ${sizeClasses[size]} ${statusColors[status]}`}
      aria-label={userStatusLabels[status]}
    />
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {indicator}
          </TooltipTrigger>
          <TooltipContent>
            <p>{userStatusLabels[status]}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return indicator;
};

export default StatusIndicator;
