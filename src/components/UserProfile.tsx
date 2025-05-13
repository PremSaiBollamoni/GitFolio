
import React from 'react';
import { useGitFolio } from '@/contexts/GitFolioContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Github, Users, MapPin, Link, Mail, RefreshCw } from 'lucide-react';

export function UserProfile() {
  const { 
    user, 
    fetchRepos, 
    loadingRepos 
  } = useGitFolio();
  
  if (!user) return null;
  
  const { 
    avatar_url, 
    name, 
    login, 
    bio, 
    followers, 
    following, 
    public_repos,
    location,
    blog,
    email,
    html_url
  } = user;
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16 border">
          <AvatarImage src={avatar_url} alt={name || login} />
          <AvatarFallback>{login.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{name || login}</h2>
          <CardDescription className="flex items-center gap-1">
            <Github className="h-4 w-4" />
            <a 
              href={html_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:underline"
            >
              @{login}
            </a>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {bio && <p className="text-sm">{bio}</p>}
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Github className="h-4 w-4" />
            {public_repos} repos
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {followers} followers
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {following} following
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          {location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{location}</span>
            </div>
          )}
          
          {blog && (
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-muted-foreground" />
              <a 
                href={blog.startsWith('http') ? blog : `https://${blog}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {blog}
              </a>
            </div>
          )}
          
          {email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a 
                href={`mailto:${email}`}
                className="text-primary hover:underline"
              >
                {email}
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={fetchRepos} 
          disabled={loadingRepos}
          className="w-full"
        >
          {loadingRepos ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Loading Repositories...
            </>
          ) : (
            "Fetch Repositories"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
