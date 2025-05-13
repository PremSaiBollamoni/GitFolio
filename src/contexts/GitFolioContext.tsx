
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  GitHubUser, 
  GitHubRepo, 
  EnhancedRepo, 
  fetchGitHubUser, 
  fetchGitHubRepos, 
  fetchDetailedRepoInfo 
} from '@/lib/github';
import { AiEnhancedRepo, analyzeRepositories } from '@/lib/ai';
import { toast } from '@/hooks/use-toast';

interface GitFolioContextType {
  // Authentication state
  username: string;
  githubToken: string;
  geminiApiKey: string;
  setUsername: (username: string) => void;
  setGithubToken: (token: string) => void;
  setGeminiApiKey: (key: string) => void;
  
  // Data state
  user: GitHubUser | null;
  repositories: EnhancedRepo[];
  aiEnhancedRepos: AiEnhancedRepo[];
  
  // UI state
  loadingUser: boolean;
  loadingRepos: boolean;
  analyzingRepos: boolean;
  analysisProgress: { current: number; total: number };
  
  // Actions
  fetchUser: () => Promise<void>;
  fetchRepos: () => Promise<void>;
  analyzeRepos: () => Promise<void>;
  toggleRepoInclusion: (repoId: number) => void;
  
  // Portfolio state
  selectedRepos: AiEnhancedRepo[];
}

const GitFolioContext = createContext<GitFolioContextType | undefined>(undefined);

export function GitFolioProvider({ children }: { children: ReactNode }) {
  // Authentication state
  const [username, setUsername] = useState<string>('');
  const [githubToken, setGithubToken] = useState<string>('');
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  
  // Data state
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = useState<EnhancedRepo[]>([]);
  const [aiEnhancedRepos, setAiEnhancedRepos] = useState<AiEnhancedRepo[]>([]);
  
  // UI state
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(false);
  const [analyzingRepos, setAnalyzingRepos] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  
  // Actions
  const fetchUser = async () => {
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter a GitHub username",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoadingUser(true);
      const userData = await fetchGitHubUser(username, githubToken);
      setUser(userData);
    } catch (error) {
      console.error("Error in fetchUser:", error);
    } finally {
      setLoadingUser(false);
    }
  };
  
  const fetchRepos = async () => {
    if (!username) {
      toast({
        title: "Username required",
        description: "Please enter a GitHub username",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoadingRepos(true);
      const reposData = await fetchGitHubRepos(username, githubToken);
      
      // Filter out forks and empty repos - fork property is now properly defined
      const filteredRepos = reposData.filter(repo => 
        !repo.fork && (repo.description || repo.stargazers_count > 0)
      );
      
      // Fetch detailed info for each repo
      const enhancedRepos = await fetchDetailedRepoInfo(filteredRepos, githubToken);
      setRepositories(enhancedRepos);
    } catch (error) {
      console.error("Error in fetchRepos:", error);
    } finally {
      setLoadingRepos(false);
    }
  };
  
  const analyzeRepos = async () => {
    if (repositories.length === 0) {
      toast({
        title: "No repositories",
        description: "Please fetch repositories first",
      });
      return;
    }
    
    if (!geminiApiKey) {
      toast({
        title: "Gemini API Key required",
        description: "Please enter your Gemini API key",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setAnalyzingRepos(true);
      setAnalysisProgress({ current: 0, total: repositories.length });
      
      const enhancedRepos = await analyzeRepositories(
        repositories, 
        geminiApiKey,
        (current, total) => {
          setAnalysisProgress({ current, total });
        }
      );
      
      setAiEnhancedRepos(enhancedRepos);
      
      toast({
        title: "Analysis complete",
        description: `Successfully analyzed ${enhancedRepos.length} repositories`,
      });
    } catch (error) {
      console.error("Error analyzing repos:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setAnalyzingRepos(false);
    }
  };
  
  const toggleRepoInclusion = (repoId: number) => {
    setAiEnhancedRepos(prevRepos => 
      prevRepos.map(repo => 
        repo.id === repoId 
          ? { ...repo, included: !repo.included } 
          : repo
      )
    );
  };
  
  // Selected repos for portfolio generation
  const selectedRepos = aiEnhancedRepos.filter(repo => repo.included);
  
  const value = {
    // Authentication state
    username,
    githubToken,
    geminiApiKey,
    setUsername,
    setGithubToken,
    setGeminiApiKey,
    
    // Data state
    user,
    repositories,
    aiEnhancedRepos,
    
    // UI state
    loadingUser,
    loadingRepos,
    analyzingRepos,
    analysisProgress,
    
    // Actions
    fetchUser,
    fetchRepos,
    analyzeRepos,
    toggleRepoInclusion,
    
    // Portfolio state
    selectedRepos,
  };
  
  return (
    <GitFolioContext.Provider value={value}>
      {children}
    </GitFolioContext.Provider>
  );
}

export const useGitFolio = () => {
  const context = useContext(GitFolioContext);
  if (context === undefined) {
    throw new Error('useGitFolio must be used within a GitFolioProvider');
  }
  return context;
};
