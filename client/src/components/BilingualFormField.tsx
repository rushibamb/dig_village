import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLanguage, Translation } from './LanguageProvider';
import { cn } from './ui/utils';

interface BaseFieldProps {
  label: Translation;
  placeholder?: Translation;
  helperText?: Translation;
  error?: string;
  required?: boolean;
  className?: string;
  id: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'text' | 'email' | 'tel' | 'number' | 'date';
  value: string;
  onChange: (value: string) => void;
  pattern?: string;
  maxLength?: number;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: Translation }[];
}

type BilingualFormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

export function BilingualFormField(props: BilingualFormFieldProps) {
  const { t } = useLanguage();
  const { label, placeholder, helperText, error, required, className, id } = props;

  const fieldClassName = cn(
    "w-full",
    error && "border-destructive focus-visible:ring-destructive",
    className
  );

  const renderField = () => {
    switch (props.type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={placeholder ? t(placeholder) : undefined}
            className={fieldClassName}
            rows={props.rows || 3}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          />
        );
      
      case 'select':
        return (
          <Select value={props.value} onValueChange={props.onChange}>
            <SelectTrigger className={fieldClassName} id={id}>
              <SelectValue placeholder={placeholder ? t(placeholder) : undefined} />
            </SelectTrigger>
            <SelectContent>
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.label)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      default:
        return (
          <Input
            id={id}
            type={props.type}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            placeholder={placeholder ? t(placeholder) : undefined}
            className={fieldClassName}
            pattern={props.pattern}
            maxLength={props.maxLength}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className={cn(
          "flex items-center gap-1",
          error && "text-destructive"
        )}
      >
        {t(label)}
        {required && (
          <span className="text-destructive" aria-label="Required">
            *
          </span>
        )}
      </Label>
      
      {renderField()}
      
      {error && (
        <p 
          id={`${id}-error`} 
          className="text-sm text-destructive" 
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p 
          id={`${id}-helper`} 
          className="text-sm text-muted-foreground"
        >
          {t(helperText)}
        </p>
      )}
    </div>
  );
}