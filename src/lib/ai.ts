
import { toast } from "@/hooks/use-toast";
import { EnhancedRepo } from "./github";

export interface AiEnhancedRepo extends EnhancedRepo {
  aiSummary: string;
  resumeBulletPoints: string[];
  techKeywords: string[];
}

// Function to analyze a repository using Gemini AI
export async function analyzeRepository(repo: EnhancedRepo, geminiApiKey: string): Promise<AiEnhancedRepo | null> {
  try {
    // Build a detailed prompt with repository information
    const prompt = generateRepositoryPrompt(repo);
    
    // Call the Gemini API
    const result = await callGeminiApi(prompt, geminiApiKey);
    
    if (!result) {
      throw new Error("Failed to get response from Gemini API");
    }
    
    // Parse the Gemini response into our structured format
    const parsedResponse = parseGeminiResponse(result);
    
    return {
      ...repo,
      aiSummary: parsedResponse.summary,
      resumeBulletPoints: parsedResponse.bulletPoints,
      techKeywords: parsedResponse.keywords
    };
  } catch (error) {
    console.error(`Error analyzing repository ${repo.name}:`, error);
    toast({
      title: `Error analyzing ${repo.name}`,
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive"
    });
    return null;
  }
}

// Generate a detailed prompt for the Gemini API
function generateRepositoryPrompt(repo: EnhancedRepo): string {
  const languages = repo.languages ? Object.keys(repo.languages).join(", ") : "Unknown";
  const topics = repo.topics && repo.topics.length > 0 ? repo.topics.join(", ") : "None";
  
  // Extract commit messages for context
  let commitMessages = "No recent commits available";
  if (repo.recent_commits && repo.recent_commits.length > 0) {
    commitMessages = repo.recent_commits.map(commit => `- ${commit.commit.message}`).join("\n");
  }

  return `
You are an expert developer and technical writer helping to create a professional portfolio.

Please analyze this GitHub repository and generate:
1. A concise project summary (2-3 lines)
2. 2-3 resume bullet points in STAR format (Situation, Task, Action, Result)
3. 5 relevant technical keywords

Repository Information:
- Name: ${repo.name}
- Description: ${repo.description || "No description provided"}
- Primary Language: ${languages}
- Topics/Tags: ${topics}
- Stars: ${repo.stargazers_count}
- Forks: ${repo.forks_count}

Recent Commit Messages:
${commitMessages}

Please format your response exactly as follows:
SUMMARY:
[Your 2-3 line summary here]

BULLET_POINTS:
- [First STAR format bullet point]
- [Second STAR format bullet point]
- [Optional third bullet point]

KEYWORDS:
keyword1, keyword2, keyword3, keyword4, keyword5
`;
}

// Call the Gemini API with the prompt
async function callGeminiApi(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Extract the text from the response
    if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected Gemini API response structure");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}

// Parse the Gemini API response into structured data
interface ParsedGeminiResponse {
  summary: string;
  bulletPoints: string[];
  keywords: string[];
}

function parseGeminiResponse(response: string): ParsedGeminiResponse {
  try {
    // Default values
    let summary = "No summary generated";
    let bulletPoints: string[] = [];
    let keywords: string[] = [];
    
    // Extract summary
    const summaryMatch = response.match(/SUMMARY:([\s\S]*?)(?=BULLET_POINTS:|$)/);
    if (summaryMatch && summaryMatch[1]) {
      summary = summaryMatch[1].trim();
    }
    
    // Extract bullet points
    const bulletPointsMatch = response.match(/BULLET_POINTS:([\s\S]*?)(?=KEYWORDS:|$)/);
    if (bulletPointsMatch && bulletPointsMatch[1]) {
      bulletPoints = bulletPointsMatch[1]
        .split('-')
        .map(point => point.trim())
        .filter(point => point.length > 0)
        .map(point => point.replace(/\n+/g, '\n').replace(/\s+/g, ' ').trim());
    }
    
    // Extract keywords
    const keywordsMatch = response.match(/KEYWORDS:([\s\S]*?)$/);
    if (keywordsMatch && keywordsMatch[1]) {
      keywords = keywordsMatch[1]
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
    }
    
    return {
      summary,
      bulletPoints,
      keywords
    };
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return {
      summary: "Error parsing AI response",
      bulletPoints: ["Failed to generate bullet points"],
      keywords: ["parsing", "error"]
    };
  }
}

// Analyze multiple repositories using Gemini API
export async function analyzeRepositories(
  repos: EnhancedRepo[], 
  geminiApiKey: string,
  onProgress?: (index: number, total: number) => void
): Promise<AiEnhancedRepo[]> {
  const results: AiEnhancedRepo[] = [];
  const total = repos.length;
  
  for (let i = 0; i < repos.length; i++) {
    try {
      // Update progress
      if (onProgress) {
        onProgress(i, total);
      }
      
      // Analyze the repo
      const analysisResult = await analyzeRepository(repos[i], geminiApiKey);
      
      if (analysisResult) {
        results.push(analysisResult);
      } else {
        // Add the original repo with default values if analysis failed
        results.push({
          ...repos[i],
          aiSummary: "Analysis unavailable",
          resumeBulletPoints: ["Analysis unavailable"],
          techKeywords: ["analysis", "unavailable"]
        });
      }
      
      // Add a small delay to avoid hitting API rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error analyzing repo ${repos[i].name}:`, error);
      
      // Add the original repo with default values if analysis failed
      results.push({
        ...repos[i],
        aiSummary: "Analysis failed",
        resumeBulletPoints: ["Analysis failed"],
        techKeywords: ["analysis", "failed"]
      });
    }
  }
  
  return results;
}
