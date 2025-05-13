
import React, { useState } from 'react';
import { useGitFolio } from '@/contexts/GitFolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github, Key, Zap } from 'lucide-react';

export function AuthForm() {
  const { 
    username, 
    githubToken, 
    geminiApiKey, 
    setUsername, 
    setGithubToken, 
    setGeminiApiKey,
    fetchUser,
    loadingUser
  } = useGitFolio();
  
  const [localUsername, setLocalUsername] = useState(username);
  const [localGithubToken, setLocalGithubToken] = useState(githubToken);
  const [localGeminiApiKey, setLocalGeminiApiKey] = useState(geminiApiKey);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsername(localUsername);
    setGithubToken(localGithubToken);
    setGeminiApiKey(localGeminiApiKey);
    await fetchUser();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Github className="h-6 w-6" />
          <span>GitHub Authentication</span>
        </CardTitle>
        <CardDescription>
          Enter your GitHub username and a Personal Access Token to get started.
          You'll need a Gemini API key for AI-powered analysis.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">GitHub Username</Label>
            <div className="flex items-center space-x-2">
              <Github className="h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                placeholder="octocat"
                value={localUsername}
                onChange={(e) => setLocalUsername(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="githubToken">GitHub Token (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <Input
                id="githubToken"
                type="password"
                placeholder="ghp_..."
                value={localGithubToken}
                onChange={(e) => setLocalGithubToken(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Create a Personal Access Token with 'public_repo' scope at{" "}
              <a 
                href="https://github.com/settings/tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GitHub Settings
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="geminiApiKey">Gemini API Key</Label>
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-muted-foreground" />
              <Input
                id="geminiApiKey"
                type="password"
                placeholder="AIzaSy..."
                value={localGeminiApiKey}
                onChange={(e) => setLocalGeminiApiKey(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Get a Gemini API Key from{" "}
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loadingUser}>
            {loadingUser ? "Connecting..." : "Connect to GitHub"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
