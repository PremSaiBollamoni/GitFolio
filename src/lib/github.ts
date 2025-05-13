// GitHub API Response Types
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubCommit {
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  sha: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  homepage: string | null;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    url: string;
  } | null;
  topics: string[];
  visibility: string;
}

// Enhanced Repository with Additional Data
export interface EnhancedRepo extends GitHubRepo {
  languages: Record<string, number>;
  included: boolean;
  recent_commits?: GitHubCommit[];
}

// Repository details needed for analysis
export interface RepoDetails {
  name: string;
  description: string | null;
  language: string | null;
  languages: Record<string, number>;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
}

// GitHub API Functions
export const fetchGitHubUser = async (username: string, token?: string): Promise<GitHubUser> => {
  const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  const response = await fetch(`https://api.github.com/users/${username}`, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchGitHubRepos = async (username: string, token?: string): Promise<GitHubRepo[]> => {
  const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch repositories: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const fetchRepoLanguages = async (repoFullName: string, token?: string): Promise<Record<string, number>> => {
  const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  const response = await fetch(`https://api.github.com/repos/${repoFullName}/languages`, { headers });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch languages: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Function to fetch recent commits for a repository
export const fetchRepoCommits = async (repoFullName: string, token?: string): Promise<GitHubCommit[]> => {
  const headers: HeadersInit = { 'Accept': 'application/vnd.github.v3+json' };
  
  if (token) {
    headers['Authorization'] = `token ${token}`;
  }
  
  const response = await fetch(`https://api.github.com/repos/${repoFullName}/commits?per_page=10`, { headers });
  
  if (!response.ok) {
    console.error(`Failed to fetch commits for ${repoFullName}: ${response.status} ${response.statusText}`);
    return [];
  }
  
  return response.json();
};

// Function to fetch detailed info for repositories
export const fetchDetailedRepoInfo = async (repos: GitHubRepo[], token?: string): Promise<EnhancedRepo[]> => {
  const enhancedRepos: EnhancedRepo[] = [];
  
  for (const repo of repos) {
    try {
      const languages = await fetchRepoLanguages(repo.full_name, token);
      const recent_commits = await fetchRepoCommits(repo.full_name, token);
      
      enhancedRepos.push({
        ...repo,
        languages,
        recent_commits,
        included: true // Default to included in portfolio
      });
    } catch (error) {
      console.error(`Error fetching details for ${repo.name}:`, error);
      enhancedRepos.push({
        ...repo,
        languages: {},
        included: false
      });
    }
  }
  
  return enhancedRepos;
};
