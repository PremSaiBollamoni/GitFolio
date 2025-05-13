
import React from 'react';
import { GitFolioProvider, useGitFolio } from '@/contexts/GitFolioContext';
import { AuthForm } from '@/components/AuthForm';
import { UserProfile } from '@/components/UserProfile';
import { RepositoryList } from '@/components/RepositoryList';
import { PortfolioExport } from '@/components/PortfolioExport';
import { Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();

  return (
    <GitFolioProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6 sticky top-0 z-10 shadow-sm">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">GitFolio</h1>
            </div>
            <div className="text-sm text-muted-foreground">AI-Powered Portfolio Generator</div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="container mx-auto py-8 px-4 flex-1">
          <GitFolioContent />
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            <p>GitFolio - An AI-powered GitHub portfolio generator</p>
          </div>
        </footer>
      </div>
    </GitFolioProvider>
  );
};

const GitFolioContent: React.FC = () => {
  const { user, repositories, aiEnhancedRepos } = useGitFolio();
  
  return (
    <div className="space-y-8">
      {/* Landing section when no user is loaded */}
      {!user && (
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Generate Your AI-Enhanced GitHub Portfolio</h1>
          <p className="text-lg text-muted-foreground mb-8">
            GitFolio analyzes your GitHub repositories and uses AI to create professional
            project descriptions, resume bullet points, and tech keyword tags.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3 bg-purple-100 dark:bg-purple-900 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto">
                <Github className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Connect GitHub</h3>
              <p className="text-sm text-muted-foreground">
                Enter your GitHub username and optional personal access token to fetch your repositories.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3 bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto">
                <svg className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.75 12.75a.75.75 0 0 0 0-1.5h-15.5a.75.75 0 0 0 0 1.5h15.5ZM18 7.75a.75.75 0 0 0 0-1.5H6a.75.75 0 0 0 0 1.5h12ZM18 17.75a.75.75 0 0 0 0-1.5H6a.75.75 0 0 0 0 1.5h12Z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">AI Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Gemini AI will analyze your code repositories and generate professional summaries.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3 bg-green-100 dark:bg-green-900 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2c-4.42 0-8 1.79-8 4v4c0 2.21 3.58 4 8 4s8-1.79 8-4V6c0-2.21-3.58-4-8-4z" />
                  <path d="M4 10v4c0 2.21 3.58 4 8 4s8-1.79 8-4v-4c0 2.21-3.58 4-8 4s-8-1.79-8-4z" />
                  <path d="M4 14v4c0 2.21 3.58 4 8 4s8-1.79 8-4v-4c0 2.21-3.58 4-8 4s-8-1.79-8-4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Export Portfolio</h3>
              <p className="text-sm text-muted-foreground">
                Download your portfolio as an HTML file to use in job applications.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Authentication Form */}
      {!user && (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-md">
          <AuthForm />
        </div>
      )}
      
      {/* User Profile */}
      {user && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <UserProfile />
              {aiEnhancedRepos.length > 0 && <div className="mt-6"><PortfolioExport /></div>}
            </div>
          </div>
          
          <div className="md:col-span-2">
            {repositories.length > 0 && <RepositoryList />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
