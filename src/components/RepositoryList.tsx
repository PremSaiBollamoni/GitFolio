
import React from 'react';
import { useGitFolio } from '@/contexts/GitFolioContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, RefreshCw, Star, GitFork, Filter, SortAsc, CheckCircle } from 'lucide-react';
import { RepositoryCard } from './RepositoryCard';

export function RepositoryList() {
  const {
    repositories,
    aiEnhancedRepos,
    analyzeRepos,
    analyzingRepos,
    analysisProgress,
    geminiApiKey
  } = useGitFolio();
  
  // Filter repositories - fork property is now properly defined
  const displayedRepos = repositories.filter(repo => 
    !repo.fork && (repo.description || repo.stargazers_count > 0)
  );
  
  const hasAiAnalyzed = aiEnhancedRepos.length > 0;
  const reposToDisplay = hasAiAnalyzed ? aiEnhancedRepos : displayedRepos;
  const progressPercentage = analysisProgress.total > 0
    ? (analysisProgress.current / analysisProgress.total) * 100
    : 0;
  
  if (displayedRepos.length === 0) {
    return null;
  }

  const analyzedCount = aiEnhancedRepos.length;
  const totalCount = displayedRepos.length;
  
  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-hidden shadow-md rounded-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Repositories
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Found {displayedRepos.length} repositories {hasAiAnalyzed && `(${analyzedCount} analyzed)`}
              </CardDescription>
            </div>
            
            <Button
              onClick={analyzeRepos}
              disabled={analyzingRepos || !geminiApiKey}
              className="ml-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transform transition-all hover:scale-105"
              size="default"
            >
              {analyzingRepos ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  {hasAiAnalyzed ? "Re-analyze with AI" : "Analyze with AI"}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        {analyzingRepos && (
          <CardContent className="pt-6 px-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-muted-foreground">Processing repositories</span>
              <span className="font-medium">{analysisProgress.current} of {analysisProgress.total}</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-gray-100 dark:bg-gray-700">
              <div className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full" 
                   style={{ width: `${progressPercentage}%` }} />
            </Progress>
          </CardContent>
        )}
        
        <CardContent className={`${analyzingRepos ? 'pt-4' : 'pt-6'} px-6 pb-6`}>
          {hasAiAnalyzed && (
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 py-1">
                <CheckCircle className="h-3 w-3" />
                AI Enhanced
              </Badge>
              <span className="text-sm text-muted-foreground">
                {aiEnhancedRepos.filter(r => r.included).length} repositories selected for portfolio
              </span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reposToDisplay.map((repo) => (
              <RepositoryCard key={repo.id} repo={repo} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
