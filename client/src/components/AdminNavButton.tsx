import React from 'react';
import { Button } from './ui/button';
import { FileBarChart } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export function AdminNavButton() {
  const { t } = useLanguage();

  const handleContractsNavigation = () => {
    window.location.href = '/admin/contracts';
  };

  return (
    <Button
      onClick={handleContractsNavigation}
      className="bg-contracts hover:bg-contracts/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
    >
      <FileBarChart className="h-4 w-4" />
      <span>{t({ en: 'Manage Contracts', mr: 'कंत्राट व्यवस्थापित करा' })}</span>
    </Button>
  );
}