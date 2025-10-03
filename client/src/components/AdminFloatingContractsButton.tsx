import React from 'react';
import { Button } from './ui/button';
import { FileBarChart } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

interface AdminFloatingContractsButtonProps {
  onNavigate?: (page: string) => void;
}

export function AdminFloatingContractsButton({ onNavigate }: AdminFloatingContractsButtonProps) {
  const { t } = useLanguage();

  const handleContractsNavigation = () => {
    if (onNavigate) {
      onNavigate('admin-contracts');
    } else {
      // Fallback to direct navigation
      window.location.href = '/admin/contracts';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleContractsNavigation}
        className="bg-contracts hover:bg-contracts/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2 px-6 py-3 rounded-full border-2 border-white/20 backdrop-blur-sm"
        size="lg"
      >
        <FileBarChart className="h-5 w-5" />
        <span className="hidden sm:inline">{t({ en: 'Manage Contracts', mr: 'कंत्राट व्यवस्थापित करा' })}</span>
        <span className="sm:hidden">{t({ en: 'Contracts', mr: 'कंत्राटे' })}</span>
      </Button>
    </div>
  );
}