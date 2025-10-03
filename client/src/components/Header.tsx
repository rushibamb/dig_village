import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, CreditCard, FileText, LogIn, Languages, Menu, X } from 'lucide-react';
import { useLanguage, translations } from './LanguageProvider';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface HeaderProps {
  isLoggedIn?: boolean;
  userRole?: 'villager' | 'admin' | 'superadmin';
  onLoginClick?: () => void;
  onPayTaxClick?: () => void;
  onGrievanceClick?: () => void;
}

export function Header({ 
  isLoggedIn = false, 
  userRole,
  onLoginClick,
  onPayTaxClick,
  onGrievanceClick 
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  const QuickActions = () => (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="hidden sm:inline-flex"
        onClick={onPayTaxClick}
        aria-label={t(translations.payTax)}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {t(translations.payTax)}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="hidden sm:inline-flex"
        onClick={onGrievanceClick}
        aria-label={t(translations.submitGrievance)}
      >
        <FileText className="h-4 w-4 mr-2" />
        {t(translations.submitGrievance)}
      </Button>

      {!isLoggedIn && (
        <Button 
          variant="default" 
          size="sm"
          onClick={onLoginClick}
          aria-label={t(translations.login)}
        >
          <LogIn className="h-4 w-4 mr-2" />
          {t(translations.login)}
        </Button>
      )}
    </>
  );

  const MobileMenu = () => (
    <div className="flex flex-col gap-3 pt-4">
      <Button 
        variant="outline" 
        className="justify-start"
        onClick={onPayTaxClick}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {t(translations.payTax)}
      </Button>
      
      <Button 
        variant="outline" 
        className="justify-start"
        onClick={onGrievanceClick}
      >
        <FileText className="h-4 w-4 mr-2" />
        {t(translations.submitGrievance)}
      </Button>

      {!isLoggedIn && (
        <Button 
          variant="default" 
          className="justify-start"
          onClick={onLoginClick}
        >
          <LogIn className="h-4 w-4 mr-2" />
          {t(translations.login)}
        </Button>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-semibold text-primary-foreground text-lg">
                  SV
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold leading-tight">
                  {t(translations.smartVillagePortal)}
                </h1>
                {userRole && (
                  <Badge variant="secondary" className="w-fit text-xs">
                    {userRole === 'admin' ? 'Admin' : userRole === 'superadmin' ? 'Super Admin' : 'Villager'}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={language === 'en' ? 'Search...' : 'शोधा...'}
                className="pl-9 pr-3 py-2 w-64 rounded-md border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label={t(translations.search)}
              />
            </div>

            <QuickActions />

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="gap-2"
              aria-label={t(translations.selectLanguage)}
            >
              <Languages className="h-4 w-4" />
              {t(translations.languageToggle)}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Language Toggle Mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              aria-label={t(translations.selectLanguage)}
            >
              <Languages className="h-4 w-4" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" aria-label="Open menu">
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                      <span className="font-semibold text-primary-foreground">
                        SV
                      </span>
                    </div>
                    <div>
                      <h2 className="font-semibold">
                        {t(translations.smartVillagePortal)}
                      </h2>
                    </div>
                  </div>

                  {/* Mobile Search */}
                  <div className="relative my-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Search...' : 'शोधा...'}
                      className="pl-9 pr-3 py-2 w-full rounded-md border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <MobileMenu />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}