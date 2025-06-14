
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onValidatedChange: (value: string, isValid: boolean) => void;
  validator: (value: string) => boolean;
  errorMessage?: string;
  sanitize?: boolean;
}

const SecureInput = React.forwardRef<HTMLInputElement, SecureInputProps>(
  ({ className, onValidatedChange, validator, errorMessage, sanitize = true, ...props }, ref) => {
    const [isValid, setIsValid] = useState(true);
    const [touched, setTouched] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      
      // Basic sanitization
      if (sanitize) {
        value = value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        value = value.replace(/javascript:/gi, '');
        value = value.replace(/on\w+\s*=/gi, '');
      }

      const valid = validator(value);
      setIsValid(valid);
      onValidatedChange(value, valid);
      
      if (props.onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value }
        };
        props.onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    return (
      <div className="space-y-1">
        <Input
          className={cn(
            className,
            touched && !isValid && "border-red-500 focus-visible:ring-red-500"
          )}
          ref={ref}
          {...props}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {touched && !isValid && errorMessage && (
          <p className="text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

SecureInput.displayName = "SecureInput";

export default SecureInput;
