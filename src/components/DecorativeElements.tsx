import { CircleDot, Sparkles, Stars, Grid, Palette } from 'lucide-react';

interface DecorationProps {
  variant?: 'primary' | 'accent' | 'minimal';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export const BackgroundDecoration = ({ 
  variant = 'primary', 
  position = 'top-right',
  className = ''
}: DecorationProps) => {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0'
  };

  const variantClasses = {
    primary: 'text-primary/30',
    accent: 'text-accent/30',
    minimal: 'text-muted/20'
  };

  return (
    <div className={`absolute -z-10 ${positionClasses[position]} ${variantClasses[variant]} ${className}`}>
      {variant === 'primary' && (
        <div className="flex">
          <Sparkles className="h-24 w-24 opacity-20" />
          <CircleDot className="h-16 w-16 opacity-10 -mt-3" />
        </div>
      )}
      
      {variant === 'accent' && (
        <div className="flex">
          <Stars className="h-24 w-24 opacity-20" />
          <Palette className="h-16 w-16 opacity-10 mt-5" />
        </div>
      )}
      
      {variant === 'minimal' && (
        <Grid className="h-20 w-20 opacity-15" />
      )}
    </div>
  );
};

interface BlobProps {
  color?: 'primary' | 'accent' | 'secondary';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Blob = ({
  color = 'primary',
  position = 'top-right',
  size = 'md',
  className = ''
}: BlobProps) => {
  const colorClasses = {
    primary: 'bg-primary/10',
    accent: 'bg-accent/10',
    secondary: 'bg-secondary/50'
  };
  
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-64 h-64'
  };
  
  const positionClasses = {
    'top-left': 'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
    'top-right': 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
    'bottom-left': 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
    'bottom-right': 'bottom-0 right-0 translate-x-1/2 translate-y-1/2'
  };

  return (
    <div 
      className={`
        absolute -z-10 rounded-full blur-3xl opacity-50
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${positionClasses[position]}
        ${className}
      `}
    />
  );
};

export const PatternBackground = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 -z-20 opacity-5 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
};
