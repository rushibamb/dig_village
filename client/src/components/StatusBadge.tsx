import React from 'react';
import { Badge } from './ui/badge';
import { useLanguage, translations } from './LanguageProvider';
import { cn } from './ui/utils';

export type Status = 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { t } = useLanguage();

  const getStatusConfig = (status: Status) => {
    switch (status) {
      case 'pending':
        return {
          label: t(translations.pending),
          className: 'bg-status-pending text-status-pending-foreground hover:bg-status-pending/80'
        };
      case 'approved':
        return {
          label: t(translations.approved),
          className: 'bg-status-approved text-status-approved-foreground hover:bg-status-approved/80'
        };
      case 'rejected':
        return {
          label: t(translations.rejected),
          className: 'bg-status-rejected text-status-rejected-foreground hover:bg-status-rejected/80'
        };
      case 'in-progress':
        return {
          label: t(translations.inProgress),
          className: 'bg-status-in-progress text-status-in-progress-foreground hover:bg-status-in-progress/80'
        };
      case 'completed':
        return {
          label: t(translations.completed),
          className: 'bg-primary text-primary-foreground hover:bg-primary/80'
        };
      default:
        return {
          label: status,
          className: 'bg-muted text-muted-foreground'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      className={cn(config.className, className)}
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </Badge>
  );
}