
# GitFolio: AI-Powered GitHub Portfolio Generator

GitFolio is a full-stack web application that generates professional portfolios from your GitHub repositories using AI. It analyzes your repositories and automatically creates project summaries, resume bullet points in STAR format, and technical skill tags.

## Features

- 🔐 **GitHub Authentication**: Connect with your GitHub username and optional personal access token
- 📦 **Repository Analysis**: Fetch and analyze your GitHub repositories, including stars, forks, languages, and commits
- 🧠 **AI Enhancement**: Use Google's Gemini API to generate professional content for each repository
- 📤 **Portfolio Export**: Download your portfolio as a styled HTML file

## Tech Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Data Fetching**: GitHub REST API v3
- **AI Integration**: Google Gemini API
- **State Management**: React Context API

## Getting Started

### Prerequisites

To use GitFolio, you'll need:

1. A GitHub account
2. (Optional but recommended) A GitHub Personal Access Token with `public_repo` scope
   - Create one at https://github.com/settings/tokens
3. A Google Gemini API Key
   - Get one at https://aistudio.google.com/app/apikey

### Usage

1. Enter your GitHub username
2. (Optional) Add your GitHub Personal Access Token for higher API rate limits
3. Add your Gemini API key for AI functionality
4. Connect to GitHub and fetch your repositories
5. Use AI to analyze and enhance your repositories
6. Select which repositories to include in your portfolio
7. Export your portfolio as an HTML file

## Environmental Variables

GitFolio doesn't require any environment variables to be set locally. All API keys are entered by the user in the application interface.

## Security Notes

- GitFolio does not store your GitHub token or Gemini API key on any server
- All API calls are made directly from your browser
- Your credentials are only stored in your browser's memory during the session

## Deployment

This project can be deployed to:

- **Vercel**: Connect your repository and deploy
- **Netlify**: Connect your repository or upload the build folder
- **GitHub Pages**: Run the build command and upload the output

## Development

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd gitfolio

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Project Structure

```
src/
├── components/         # UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions for GitHub and AI
├── pages/              # Application pages
└── App.tsx             # Main application component
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [GitHub API](https://docs.github.com/en/rest)
- [Google Gemini API](https://ai.google.dev/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
