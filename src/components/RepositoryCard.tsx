
import React from 'react';
import { EnhancedRepo } from '@/lib/github';
import { AiEnhancedRepo } from '@/lib/ai';
import { useGitFolio } from '@/contexts/GitFolioContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Star, GitFork, Code, GitBranch, ExternalLink, Clock, Calendar } from 'lucide-react';

interface RepositoryCardProps {
  repo: EnhancedRepo;
}

export function RepositoryCard({ repo }: RepositoryCardProps) {
  const { toggleRepoInclusion } = useGitFolio();
  
  // Check if this repo has AI enhancements
  const isAiEnhanced = 'aiSummary' in repo;
  const aiRepo = isAiEnhanced ? repo as AiEnhancedRepo : null;
  
  // Calculate the date difference
  const updatedAt = new Date(repo.pushed_at);
  const now = new Date();
  const diffTime = now.getTime() - updatedAt.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const timeAgo = diffDays === 0 
    ? 'Today'
    : diffDays === 1 
      ? 'Yesterday' 
      : diffDays < 30 
        ? `${diffDays} days ago`
        : diffDays < 365 
          ? `${Math.floor(diffDays / 30)} months ago` 
          : `${Math.floor(diffDays / 365)} years ago`;
  
  // Primary language
  const primaryLanguage = repo.language || 'Unknown';
  
  // Get languages as array
  const languages = repo.languages 
    ? Object.keys(repo.languages) 
    : [primaryLanguage];
  
  return (
    <Card className="h-full flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 rounded-lg">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-850">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline hover:text-blue-600 flex items-center gap-2 transition-colors"
              >
                {repo.name}
                <ExternalLink className="h-4 w-4 opacity-70" />
              </a>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3 opacity-70" /> 
              Updated {timeAgo}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {repo.stargazers_count > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 stroke-amber-500" />
                {repo.stargazers_count}
              </Badge>
            )}
            
            {repo.forks_count > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {repo.forks_count}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pb-2 pt-4">
        {/* Original Description */}
        <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
          {repo.description || "No description provided"}
        </p>
        
        {/* AI Summary if available */}
        {aiRepo?.aiSummary && (
          <div className="mb-4 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
            <h4 className="text-xs font-medium text-purple-800 dark:text-purple-300 mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3L20.5 17H3.5L12 3Z" fill="currentColor" />
              </svg>
              AI Summary:
            </h4>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{aiRepo.aiSummary}</p>
          </div>
        )}
        
        {/* Languages */}
        <div className="flex flex-wrap gap-1 mb-3">
          {languages.slice(0, 3).map((lang) => (
            <Badge key={lang} variant="secondary" className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
              <Code className="h-3 w-3" />
              {lang}
            </Badge>
          ))}
        </div>
        
        {/* Tech Keywords - only if AI enhanced */}
        {aiRepo?.techKeywords && aiRepo.techKeywords.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Tech Stack:
            </h4>
            <div className="flex flex-wrap gap-1">
              {aiRepo.techKeywords.map((keyword, i) => (
                <Badge key={i} variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs border-green-200 dark:border-green-800">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Resume Bullet Points */}
        {aiRepo?.resumeBulletPoints && aiRepo.resumeBulletPoints.length > 0 && (
          <div className="mb-2">
            <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Resume Points:
            </h4>
            <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300 pl-4">
              {aiRepo.resumeBulletPoints.map((point, i) => (
                <li key={i} className="leading-normal list-disc">
                  <p className="whitespace-pre-line">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 border-t mt-auto bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center w-full">
          <div className="flex items-center">
            <Checkbox 
              id={`include-${repo.id}`}
              checked={repo.included}
              onCheckedChange={() => toggleRepoInclusion(repo.id)}
              className="border-purple-400 data-[state=checked]:bg-purple-600"
            />
            <Label 
              htmlFor={`include-${repo.id}`}
              className="ml-2 text-sm cursor-pointer"
            >
              Include in portfolio
            </Label>
          </div>
          
          {repo.topics && repo.topics.length > 0 && (
            <div className="ml-auto flex flex-wrap gap-1 justify-end">
              {repo.topics.slice(0, 2).map(topic => (
                <Badge key={topic} variant="outline" className="text-xs bg-gray-100 dark:bg-gray-700">
                  {topic}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
