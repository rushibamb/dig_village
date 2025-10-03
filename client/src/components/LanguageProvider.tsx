import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'mr';

export interface Translation {
  en: string;
  mr: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (translation: Translation) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (translation: Translation) => translation[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'mr' ? 'font-devanagari' : 'font-inter'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

// Common translations
export const translations = {
  // Navigation
  home: { en: 'Home', mr: 'मुख्यपृष्ठ' },
  login: { en: 'Login', mr: 'लॉगिन' },
  logout: { en: 'Logout', mr: 'लॉगआउट' },
  profile: { en: 'Profile', mr: 'प्रोफाइल' },
  dashboard: { en: 'Dashboard', mr: 'डॅशबोर्ड' },
  
  // Portal
  smartVillagePortal: { en: 'Smart Village Portal', mr: 'स्मार्ट व्हिलेज पोर्टल' },
  languageToggle: { en: 'मराठी', mr: 'English' },
  
  // Actions
  submit: { en: 'Submit', mr: 'सबमिट करा' },
  cancel: { en: 'Cancel', mr: 'रद्द करा' },
  save: { en: 'Save', mr: 'जतन करा' },
  edit: { en: 'Edit', mr: 'संपादन' },
  delete: { en: 'Delete', mr: 'हटवा' },
  view: { en: 'View', mr: 'पहा' },
  search: { en: 'Search', mr: 'शोधा' },
  
  // Forms
  fullName: { en: 'Full Name', mr: 'पूर्ण नाव' },
  mobileNumber: { en: 'Mobile Number', mr: 'मोबाईल क्रमांक' },
  password: { en: 'Password', mr: 'पासवर्ड' },
  sendOTP: { en: 'Send OTP', mr: 'ओटीपी पाठवा' },
  enterOTP: { en: 'Enter 6-digit OTP', mr: '६ अंकी ओटीपी टाका' },
  gender: { en: 'Gender', mr: 'लिंग' },
  dateOfBirth: { en: 'Date of Birth', mr: 'जन्मतारीख' },
  address: { en: 'Address', mr: 'पत्ता' },
  
  // Status
  pending: { en: 'Pending', mr: 'प्रलंबित' },
  approved: { en: 'Approved', mr: 'मंजूर' },
  rejected: { en: 'Rejected', mr: 'नाकारले' },
  inProgress: { en: 'In Progress', mr: 'कार्यरत' },
  completed: { en: 'Completed', mr: 'पूर्ण' },
  
  // Modules
  villagerManagement: { en: 'Villager Management', mr: 'गावकरी व्यवस्थापन' },
  taxPayment: { en: 'Tax Payment', mr: 'कर भरणा' },
  grievanceRedressal: { en: 'Grievance Redressal', mr: 'तक्रार निवारण' },
  newsUpdates: { en: 'News & Updates', mr: 'बातम्या आणि अपडेट्स' },
  serviceApplications: { en: 'Service Applications', mr: 'सेवा अर्ज' },
  adminPanel: { en: 'Admin Panel', mr: 'प्रशासन पॅनेल' },
  
  // Quick Actions
  payTax: { en: 'Pay Tax', mr: 'कर भरा' },
  submitGrievance: { en: 'Submit Grievance', mr: 'तक्रार सबमिट करा' },
  applyForService: { en: 'Apply for Service', mr: 'सेवेसाठी अर्ज करा' },
  
  // Common phrases
  welcomeTo: { en: 'Welcome to', mr: 'येथे स्वागत आहे' },
  selectLanguage: { en: 'Select Language', mr: 'भाषा निवडा' },
  loading: { en: 'Loading...', mr: 'लोड होत आहे...' },
  error: { en: 'Error', mr: 'त्रुटी' },
  success: { en: 'Success', mr: 'यशस्वी' },
};