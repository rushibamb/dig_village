import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useLanguage } from './LanguageProvider';
import { ContractsContentManager } from './ContractsContentManager';
import { ArrowLeft, Settings, FileBarChart } from 'lucide-react';

export function AdminContractsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t({ en: 'Back to Admin', mr: 'प्रशासनात परत' })}</span>
              </Button>
              
              <div className="h-8 w-px bg-gray-300"></div>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-contracts rounded-full flex items-center justify-center">
                  <FileBarChart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {t({ en: 'Contracts Administration', mr: 'कंत्राट प्रशासन' })}
                  </h1>
                  <p className="text-gray-600">
                    {t({ en: 'Manage all contract page content and data', mr: 'सर्व कंत्राट पृष्ठ सामग्री आणि डेटा व्यवस्थापित करा' })}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Settings className="h-4 w-4" />
                <span>{t({ en: 'Admin Panel', mr: 'प्रशासन पॅनेल' })}</span>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <span className="hover:text-gray-700">
                  {t({ en: 'Admin', mr: 'प्रशासन' })}
                </span>
              </li>
              <li>
                <span>/</span>
              </li>
              <li>
                <span className="text-contracts font-medium">
                  {t({ en: 'Contracts Management', mr: 'कंत्राट व्यवस्थापन' })}
                </span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="border-b border-gray-200/50">
            <CardTitle className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-contracts/10 rounded-lg flex items-center justify-center">
                <FileBarChart className="h-5 w-5 text-contracts" />
              </div>
              <span>{t({ en: 'Content Management System', mr: 'सामग्री व्यवस्थापन प्रणाली' })}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <ContractsContentManager />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            {t({ 
              en: 'Smart Village Portal - Contracts Administration Module', 
              mr: 'स्मार्ट व्हिलेज पोर्टल - कंत्राट प्रशासन मॉड्यूल' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
}