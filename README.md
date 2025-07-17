# NoteCLI - AI-Powered Note Manager

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ES Modules](https://img.shields.io/badge/ES-Modules-blue)](https://nodejs.org/api/esm.html)

A professional note management CLI application featuring AI-powered analysis, interactive terminal UI, and comprehensive data management capabilities. Built with modern Node.js and JavaScript, this application demonstrates enterprise-grade features including encryption, analytics, multi-format export, and RESTful API integration.

## Key Features

### AI-Powered Analysis
- **Sentiment Analysis**: Automatic mood detection and emotional insights
- **Auto-Tagging**: AI-generated tags based on content analysis
- **Topic Extraction**: Intelligent identification of key themes and subjects
- **Content Summarization**: Automatic summaries for long notes
- **Similar Note Discovery**: Find related content using semantic analysis
- **Writing Pattern Analysis**: Personal writing insights and improvement suggestions

### Advanced Analytics & Insights
- **Interactive Dashboard**: Beautiful terminal-based analytics with charts
- **Productivity Metrics**: Track writing volume, patterns, and habits
- **Trend Analysis**: Identify patterns in your note-taking behavior
- **Mood Tracking**: Visualize emotional patterns over time
- **Category Distribution**: Understand how you organize information
- **Export Analytics**: Generate detailed reports in multiple formats

### Professional CLI Experience
- **Interactive Terminal UI**: Beautiful interface with keyboard navigation
- **Colorized Output**: Syntax highlighting and visual feedback
- **Progress Indicators**: Real-time feedback for long operations
- **Fuzzy Search**: Advanced search with highlighting and filters
- **Rich Formatting**: Markdown-like display with tables and lists
- **Quick Commands**: Fast access to common operations

### Enterprise Data Management
- **AES-256 Encryption**: Secure storage for sensitive notes
- **Automatic Backups**: Version history with integrity verification
- **Multi-Format Export**: PDF, HTML, Markdown, JSON, and ZIP formats
- **RESTful API Server**: Integration endpoints for external applications
- **Data Validation**: Comprehensive input sanitization and error handling
- **Cross-Platform**: Works seamlessly on Windows, macOS, and Linux

## Quick Start

### Prerequisites
- Node.js 18.0.0+ and npm
- Terminal (PowerShell on Windows)

### Installation & Setup
```bash
# Clone and install
git clone <repository-url>
cd ai-note-manager
npm install

# Configure environment (optional)
cp .env.example .env

# Start using
npm start                          # Show all commands
npm start add "Title" "Content"    # Create first note
npm start list                     # View all notes
npm start tui                      # Interactive UI
npm start server                   # Start API server
```

## Usage Guide

### Core Commands
```bash
# Educational
npm start learn                    # JavaScript & Node.js course
npm start lab1                     # Original lab exercises

# Note Management
npm start add "Title" "Content"    # Create AI-enhanced note
npm start quick "Thought"          # Quick note creation
npm start list                     # List all notes with filters
npm start read "Title"             # Read specific note
npm start search "keyword"         # Search with highlighting
npm start remove "Title"           # Delete note

# AI Analysis
npm start analyze "Title"          # Deep content analysis
npm start analytics                # Interactive dashboard

# Export & Sharing
npm start export pdf               # Export as PDF
npm start share "Title" --qr       # Generate QR code
npm start export zip               # Complete backup

# Interactive
npm start tui                      # Terminal UI
npm start server                   # Web API server
```

### AI-Enhanced Note Creation
```bash
$ npm start add "Project Review" "Authentication system working well. Team morale high after deployment."

[+] Note "Project Review" created successfully!

AI Analysis Complete:
   Sentiment: Positive (0.75)
   Auto-tags: #project, #authentication, #team
   Category: work
   Summary: Positive project update with successful deployment
   Similar Notes: "Team Meeting Notes", "System Updates"
```

### Interactive Terminal UI
```bash
npm start tui

# Navigation: Arrow keys, Tab, Enter
# Actions: Ctrl+N (New), Ctrl+S (Search), Ctrl+A (Analytics)
# Quick Access: F1-F12 for common commands
```

### Analytics Dashboard
```bash
npm start analytics

# View productivity metrics, sentiment trends
# Category distribution, tag analysis
# Export reports: npm start analytics --export pdf
```

### Web API Server
```bash
npm start server

# Access: http://localhost:3000
# Endpoints: GET/POST /api/notes, /api/search, /api/analytics
# Documentation: http://localhost:3000/docs
```

## Project Structure

```
ai-note-manager/
├── commands/          # CLI command implementations
│   ├── add.js        # AI-enhanced note creation
│   ├── list.js       # Smart listing with filters
│   ├── analyze.js    # AI content analysis
│   └── analytics.js  # Dashboard and metrics
├── utils/            # Core utilities
│   ├── advancedFileHandler.js  # Encrypted operations
│   └── aiAnalyzer.js          # AI analysis engine
├── server/           # Web API
│   └── api.js       # RESTful endpoints
├── labs/            # Educational content
│   └── lab1.js      # JavaScript fundamentals
├── data/            # Storage
│   └── notes.json   # Notes database
├── index.js         # Main CLI interface
├── tui.js          # Terminal UI
└── package.json    # Dependencies & scripts
```

## Learning Path

### Lab 1: JavaScript Fundamentals
```bash
npm run lab1

# Demonstrates:
# - Closures with command parsers
# - Higher-order functions with logging
# - Counter factories maintaining state
# - Function composition pipelines
# - Node.js environment exploration
```

> **📚 Complete Learning Guide**: See [`EDUCATIONAL_GUIDE.md`](./EDUCATIONAL_GUIDE.md) for comprehensive JavaScript & Node.js training curriculum with hands-on exercises, real-world examples, and practical assessments.

## Technical Architecture

### Technologies Used
- **Core**: Node.js 18+, ES Modules
- **AI**: OpenAI API, Sentiment analysis, Natural language processing
- **UI**: Blessed (Terminal UI), Chalk (Colors), CLI-Table3 (Tables)
- **Security**: Crypto-JS (AES-256), Input validation
- **Export**: Puppeteer (PDF), Marked (Markdown), QRCode generation
- **API**: Express.js, CORS, Body-parser

### Design Patterns
- **Command Pattern**: Each CLI command as independent module
- **Factory Pattern**: Dynamic creation of specialized functions
- **Module Pattern**: Clean separation with ES modules
- **Observer Pattern**: Event-driven analytics

### Data Schema
```json
{
  "id": "uuid-v4",
  "title": "Note Title",
  "body": "Content...",
  "metadata": {
    "createdAt": "2025-01-07T10:30:00.000Z",
    "category": "work",
    "tags": ["#meeting", "#project"],
    "wordCount": 156
  },
  "aiAnalysis": {
    "sentiment": { "score": 0.75, "label": "positive" },
    "topics": ["project management"],
    "summary": "AI-generated summary",
    "autoTags": ["#productivity"]
  }
}
```

## Advanced Features

### Security & Privacy
```bash
# Encrypt sensitive notes
npm start add "Confidential" "Sensitive data" --encrypt

# Automatic backups
# AES-256 encryption
# Data validation and integrity checks
```

### Export Options
```bash
npm start export pdf --template professional
npm start export html --include-analytics
npm start export markdown --category work
npm start export zip --include-media
```

### API Integration
```javascript
// REST API usage
const response = await fetch('http://localhost:3000/api/notes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'API Note', body: 'Content' })
});
```

## Troubleshooting

### Common Issues
- **Module errors**: Run `npm install`
- **Permission errors**: Check file permissions on `data/` directory
- **ES module issues**: Ensure Node.js 18+ and `"type": "module"` in package.json

### Debug Mode
```bash
DEBUG=true npm start list
```

### Configuration
Edit `.env` for custom settings:
```env
NOTES_FILE_PATH=./data/notes.json
API_PORT=3000
ENCRYPTION_ENABLED=true
```

## Extension Ideas

Enhance your learning by implementing:
- Note categories and priorities
- Template system for common note types
- Git integration for version control
- Markdown support with live preview
- Plugin system for custom commands
- Database backend (SQLite/PostgreSQL)
- Mobile companion app

## Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [JavaScript Closures - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [Async/Await Guide](https://javascript.info/async-await)
- [Command Line Apps with Node.js](https://nodejs.dev/learn/command-line-apps)

## 📚 Educational Resources & Learning Materials

This project includes comprehensive educational content for mastering JavaScript and Node.js fundamentals through practical implementation.

### **[📖 Complete Learning Guide](./EDUCATIONAL_GUIDE.md)**
*Your comprehensive JavaScript & Node.js training curriculum*
- **Beginner-friendly explanations** with real-world analogies
- **Hands-on exercises** with step-by-step guidance
- **Professional code examples** with actual outputs
- **Deep dive concepts** covering execution context, closures, and async programming
- **Node.js vs other frameworks** comparison and when to use each
- **Progressive learning path** from basics to advanced patterns

### **[✅ Educational Requirements Compliance](./EDUCATIONAL_REQUIREMENTS.md)**
*Complete verification of all educational objectives*
- **Topic coverage validation** for all required JavaScript concepts
- **Learning outcomes verification** with practical demonstrations
- **Access methods documentation** for all educational content
- **Assessment criteria fulfillment** with working examples
- **Project structure overview** showing where each concept is implemented

### Quick Educational Access
```bash
# Complete JavaScript & Node.js fundamentals course
npm start learn

# Original closure and higher-order function exercises  
npm start lab1

# Help and educational command overview
npm start help
```

### Additional Learning Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [JavaScript Closures - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [Async/Await Guide](https://javascript.info/async-await)
- [Command Line Apps with Node.js](https://nodejs.dev/learn/command-line-apps)

## License

MIT License - See full license text in source code.

---

**Professional AI-Powered Note Manager - Built for learning JavaScript and Node.js fundamentals**
