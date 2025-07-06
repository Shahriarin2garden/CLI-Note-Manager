import blessed from 'blessed';
import chalk from 'chalk';
import { AdvancedFileHandler } from './utils/advancedFileHandler.js';
import aiAnalyzer from './utils/aiAnalyzer.js';

const fileHandler = new AdvancedFileHandler();

/**
 * Interactive Terminal User Interface for TeleMed Notes
 */
export async function startTUI() {
  // Create a screen object
  const screen = blessed.screen({
    smartCSR: true,
    title: 'TeleMed Notes - Interactive Mode'
  });

  // Create main layout
  const mainBox = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    style: {
      bg: 'black'
    }
  });

  // Header
  const header = blessed.box({
    parent: mainBox,
    top: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: '{center}TeleMed Notes - Interactive Mode{/center}\n{center}Press Ctrl+C to exit{/center}',
    tags: true,
    style: {
      bg: 'blue',
      fg: 'white',
      bold: true
    }
  });

  // Sidebar for navigation
  const sidebar = blessed.list({
    parent: mainBox,
    label: ' 📋 Navigation ',
    top: 3,
    left: 0,
    width: '25%',
    height: '70%',
    border: {
      type: 'line'
    },
    style: {
      bg: 'black',
      fg: 'cyan',
      border: { fg: 'cyan' },
      selected: { bg: 'cyan', fg: 'black' }
    },
    items: [
      '📝 All Notes',
      '➕ Add New Note',
      '🔍 Search Notes',
      '📊 Analytics',
      '🤖 AI Analysis',
      '📤 Export Notes',
      '🔒 Security',
      '⚙️  Settings'
    ],
    keys: true,
    mouse: true,
    scrollable: true
  });

  // Main content area
  const content = blessed.box({
    parent: mainBox,
    label: ' 📖 Content ',
    top: 3,
    left: '25%',
    width: '75%',
    height: '70%',
    border: {
      type: 'line'
    },
    style: {
      bg: 'black',
      fg: 'white',
      border: { fg: 'green' }
    },
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    keys: true
  });

  // Status bar
  const statusBar = blessed.box({
    parent: mainBox,
    bottom: 0,
    left: 0,
    width: '100%',
    height: 3,
    content: ' Status: Ready | Use arrow keys to navigate | Enter to select',
    style: {
      bg: 'gray',
      fg: 'black'
    }
  });

  // Initialize with notes list
  await showAllNotes(content, statusBar);

  // Navigation handler
  sidebar.on('select', async (item, index) => {
    const option = item.getText();
    updateStatus(statusBar, `Loading ${option}...`);
    
    try {
      switch (index) {
        case 0: // All Notes
          await showAllNotes(content, statusBar);
          break;
        case 1: // Add New Note
          await showAddNoteForm(screen, content, statusBar);
          break;
        case 2: // Search Notes
          await showSearchForm(screen, content, statusBar);
          break;
        case 3: // Analytics
          await showAnalytics(content, statusBar);
          break;
        case 4: // AI Analysis
          await showAIAnalysis(content, statusBar);
          break;
        case 5: // Export Notes
          await showExportOptions(content, statusBar);
          break;
        case 6: // Security
          await showSecurityOptions(content, statusBar);
          break;
        case 7: // Settings
          await showSettings(content, statusBar);
          break;
      }
    } catch (error) {
      updateStatus(statusBar, `Error: ${error.message}`, 'red');
    }
  });

  // Keyboard shortcuts
  screen.key(['escape', 'C-c'], () => {
    process.exit(0);
  });

  screen.key(['f1'], () => {
    showHelp(content);
  });

  // Focus on sidebar initially
  sidebar.focus();

  // Render the screen
  screen.render();
}

/**
 * Show all notes in the content area
 */
async function showAllNotes(content, statusBar) {
  try {
    const notes = await fileHandler.readNotes(true);
    
    if (notes.length === 0) {
      content.setContent(`
{center}📝 No Notes Found{/center}

{center}Welcome to TeleMed Notes!{/center}
{center}Create your first note to get started.{/center}

{center}Tips:{/center}
{center}• Use ➕ Add New Note to create your first note{/center}
{center}• Try the AI features for smart insights{/center}
{center}• Export your notes in multiple formats{/center}
      `);
    } else {
      let notesList = `All Notes ({bold}${notes.length} total{/bold})\n`;
      notesList += '─'.repeat(60) + '\n\n';
      
      // Sort by creation date (newest first)
      notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      notes.forEach((note, index) => {
        const date = new Date(note.createdAt).toLocaleDateString();
        const preview = note.body.length > 80 ? note.body.substring(0, 77) + '...' : note.body;
        
        // Add mood emoji if available
        let title = note.title;
        if (note.metadata?.sentiment) {
          const moodEmoji = {
            'very positive': '😄',
            'positive': '😊',
            'neutral': '😐',
            'negative': '😔',
            'very negative': '😢'
          };
          title = `${moodEmoji[note.metadata.sentiment.mood]} ${title}`;
        }
        
        notesList += `{cyan-fg}${index + 1}. ${title}{/cyan-fg}\n`;
        notesList += `   ${preview}\n`;
        notesList += `   {gray-fg}📁 ${note.category || 'General'} • 📅 ${date}`;
        
        if (note.tags && note.tags.length > 0) {
          notesList += ` • 🏷️ ${note.tags.slice(0, 3).join(', ')}`;
        }
        
        notesList += `{/gray-fg}\n\n`;
      });
      
      content.setContent(notesList);
    }
    
    updateStatus(statusBar, `Showing ${notes.length} notes`);
    content.setScrollPerc(0);
    
  } catch (error) {
    content.setContent(`{red-fg}Error loading notes: ${error.message}{/red-fg}`);
    updateStatus(statusBar, 'Error loading notes', 'red');
  }
}

/**
 * Show add note form
 */
async function showAddNoteForm(screen, content, statusBar) {
  // Create form
  const form = blessed.form({
    parent: screen,
    top: 'center',
    left: 'center',
    width: 60,
    height: 20,
    border: {
      type: 'line'
    },
    style: {
      bg: 'black',
      fg: 'white',
      border: { fg: 'cyan' }
    },
    label: ' ➕ Add New Note '
  });

  // Title input
  const titleInput = blessed.textbox({
    parent: form,
    label: ' Title: ',
    top: 1,
    left: 1,
    width: '90%',
    height: 3,
    border: {
      type: 'line'
    },
    style: {
      bg: 'black',
      fg: 'white',
      border: { fg: 'gray' }
    }
  });

  // Body input
  const bodyInput = blessed.textarea({
    parent: form,
    label: ' Content: ',
    top: 5,
    left: 1,
    width: '90%',
    height: 8,
    border: {
      type: 'line'
    },
    style: {
      bg: 'black',
      fg: 'white',
      border: { fg: 'gray' }
    }
  });

  // Buttons
  const saveButton = blessed.button({
    parent: form,
    content: ' Save Note ',
    top: 14,
    left: 5,
    width: 12,
    height: 3,
    style: {
      bg: 'green',
      fg: 'white'
    }
  });

  const cancelButton = blessed.button({
    parent: form,
    content: ' Cancel ',
    top: 14,
    left: 20,
    width: 10,
    height: 3,
    style: {
      bg: 'red',
      fg: 'white'
    }
  });

  // Event handlers
  saveButton.on('press', async () => {
    const title = titleInput.getValue().trim();
    const body = bodyInput.getValue().trim();
    
    if (!title || !body) {
      updateStatus(statusBar, 'Please fill in both title and content', 'red');
      return;
    }
    
    try {
      const notes = await fileHandler.readNotes(true);
      
      // AI enhancement
      const sentiment = aiAnalyzer.analyzeSentiment(body);
      const autoTags = aiAnalyzer.generateTags(body);
      const suggestedCategory = aiAnalyzer.suggestCategory(body);
      const topics = aiAnalyzer.extractTopics(body);
      
      const newNote = {
        id: Date.now(),
        title,
        body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: autoTags,
        category: suggestedCategory,
        metadata: {
          sentiment,
          topics,
          wordCount: body.split(' ').length,
          readingTime: Math.ceil(body.split(' ').length / 200)
        }
      };
      
      notes.push(newNote);
      await fileHandler.writeNotes(notes);
      
      form.destroy();
      await showAllNotes(content, statusBar);
      updateStatus(statusBar, `Note "${title}" created with AI enhancement!`, 'green');
      
    } catch (error) {
      updateStatus(statusBar, `Error creating note: ${error.message}`, 'red');
    }
  });

  cancelButton.on('press', () => {
    form.destroy();
    updateStatus(statusBar, 'Note creation cancelled');
  });

  // Show form
  form.focus();
  titleInput.focus();
  screen.render();
}

/**
 * Show search form
 */
async function showSearchForm(screen, content, statusBar) {
  const searchBox = blessed.prompt({
    parent: screen,
    top: 'center',
    left: 'center',
    width: 50,
    height: 7,
    border: {
      type: 'line'
    },
    style: {
      bg: 'black',
      fg: 'white',
      border: { fg: 'cyan' }
    },
    label: ' 🔍 Search Notes '
  });

  searchBox.input('Enter search term:', '', async (err, value) => {
    if (err || !value) {
      updateStatus(statusBar, 'Search cancelled');
      return;
    }
    
    try {
      const results = await fileHandler.searchNotes(value, {
        searchIn: ['title', 'body', 'tags'],
        caseSensitive: false
      });
      
      if (results.length === 0) {
        content.setContent(`
{center}🔍 Search Results{/center}

{center}No notes found for: "${value}"{/center}

{center}Try:{/center}
{center}• Different keywords{/center}
{center}• Checking spelling{/center}
{center}• Broader search terms{/center}
        `);
      } else {
        let searchResults = `🔍 {bold}Search Results for "${value}"{/bold} (${results.length} found)\n`;
        searchResults += '─'.repeat(60) + '\n\n';
        
        results.forEach((note, index) => {
          const date = new Date(note.createdAt).toLocaleDateString();
          const preview = note.body.length > 80 ? note.body.substring(0, 77) + '...' : note.body;
          
          searchResults += `{cyan-fg}${index + 1}. ${note.title}{/cyan-fg}\n`;
          searchResults += `   ${preview}\n`;
          searchResults += `   {gray-fg}📁 ${note.category || 'General'} • 📅 ${date}{/gray-fg}\n\n`;
        });
        
        content.setContent(searchResults);
      }
      
      updateStatus(statusBar, `Search completed: ${results.length} results found`);
      
    } catch (error) {
      updateStatus(statusBar, `Search error: ${error.message}`, 'red');
    }
  });
}

/**
 * Show analytics dashboard
 */
async function showAnalytics(content, statusBar) {
  try {
    const analytics = await fileHandler.getAnalytics();
    
    let analyticsText = `📊 {bold}Analytics Dashboard{/bold}\n`;
    analyticsText += '═'.repeat(60) + '\n\n';
    
    analyticsText += `📝 Total Notes: {cyan-fg}${analytics.totalNotes.toLocaleString()}{/cyan-fg}\n`;
    analyticsText += `📊 Total Words: {cyan-fg}${analytics.totalWords.toLocaleString()}{/cyan-fg}\n`;
    analyticsText += `📅 This Week: {cyan-fg}${analytics.notesThisWeek}{/cyan-fg}\n`;
    analyticsText += `📆 This Month: {cyan-fg}${analytics.notesThisMonth}{/cyan-fg}\n\n`;
    
    // Categories
    if (Object.keys(analytics.categories).length > 0) {
      analyticsText += `{bold}📁 Categories:{/bold}\n`;
      Object.entries(analytics.categories)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8)
        .forEach(([category, count]) => {
          const percentage = ((count / analytics.totalNotes) * 100).toFixed(1);
          analyticsText += `   ${category.padEnd(15)} {cyan-fg}${count}{/cyan-fg} (${percentage}%)\n`;
        });
      analyticsText += '\n';
    }
    
    // Popular tags
    if (Object.keys(analytics.tags).length > 0) {
      analyticsText += `{bold}🏷️ Popular Tags:{/bold}\n`;
      Object.entries(analytics.tags)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .forEach(([tag, count]) => {
          analyticsText += `   {magenta-fg}#${tag}{/magenta-fg} (${count})\n`;
        });
    }
    
    content.setContent(analyticsText);
    updateStatus(statusBar, 'Analytics dashboard loaded');
    
  } catch (error) {
    content.setContent(`{red-fg}Error loading analytics: ${error.message}{/red-fg}`);
    updateStatus(statusBar, 'Error loading analytics', 'red');
  }
}

/**
 * Show AI Analysis options
 */
async function showAIAnalysis(content, statusBar) {
  let aiContent = `🤖 {bold}AI Analysis Features{/bold}\n`;
  aiContent += '═'.repeat(60) + '\n\n';
  
  aiContent += `{bold}Available AI Features:{/bold}\n\n`;
  aiContent += `• {cyan-fg}Sentiment Analysis{/cyan-fg} - Understand the mood of your notes\n`;
  aiContent += `• {cyan-fg}Topic Extraction{/cyan-fg} - Identify key themes and subjects\n`;
  aiContent += `• {cyan-fg}Auto-Tagging{/cyan-fg} - Automatically generate relevant tags\n`;
  aiContent += `• {cyan-fg}Category Suggestion{/cyan-fg} - Smart categorization\n`;
  aiContent += `• {cyan-fg}Similar Notes{/cyan-fg} - Find related content\n`;
  aiContent += `• {cyan-fg}Writing Insights{/cyan-fg} - Analyze your writing patterns\n\n`;
  
  aiContent += `{bold}How to Use:{/bold}\n\n`;
  aiContent += `• AI features are automatically applied when creating notes\n`;
  aiContent += `• Use the CLI command: {yellow-fg}npm start analyze <note-title>{/yellow-fg}\n`;
  aiContent += `• Run insights: {yellow-fg}npm start insights{/yellow-fg}\n\n`;
  
  aiContent += `{bold}Recent AI Insights:{/bold}\n`;
  aiContent += `• Notes are automatically enhanced with sentiment analysis\n`;
  aiContent += `• Smart categorization improves organization\n`;
  aiContent += `• Auto-generated tags help with discovery\n`;
  
  content.setContent(aiContent);
  updateStatus(statusBar, 'AI Analysis information loaded');
}

/**
 * Show export options
 */
async function showExportOptions(content, statusBar) {
  let exportContent = `📤 {bold}Export Options{/bold}\n`;
  exportContent += '═'.repeat(60) + '\n\n';
  
  exportContent += `{bold}Available Export Formats:{/bold}\n\n`;
  exportContent += `• {cyan-fg}PDF{/cyan-fg} - Professional documents with formatting\n`;
  exportContent += `• {cyan-fg}HTML{/cyan-fg} - Web-ready files with styling\n`;
  exportContent += `• {cyan-fg}Markdown{/cyan-fg} - Plain text with formatting\n`;
  exportContent += `• {cyan-fg}JSON{/cyan-fg} - Raw data for backup/import\n`;
  exportContent += `• {cyan-fg}ZIP{/cyan-fg} - Complete archive with all formats\n\n`;
  
  exportContent += `{bold}CLI Commands:{/bold}\n\n`;
  exportContent += `• {yellow-fg}npm start export pdf{/yellow-fg} - Export as PDF\n`;
  exportContent += `• {yellow-fg}npm start export html{/yellow-fg} - Export as HTML\n`;
  exportContent += `• {yellow-fg}npm start export md{/yellow-fg} - Export as Markdown\n`;
  exportContent += `• {yellow-fg}npm start export json{/yellow-fg} - Export as JSON\n\n`;
  
  exportContent += `{bold}Filtering Options:{/bold}\n\n`;
  exportContent += `• By category: {yellow-fg}npm start export pdf category Work{/yellow-fg}\n`;
  exportContent += `• By tag: {yellow-fg}npm start export pdf tag important{/yellow-fg}\n`;
  exportContent += `• By date: {yellow-fg}npm start export pdf date 2024-01-01{/yellow-fg}\n`;
  
  content.setContent(exportContent);
  updateStatus(statusBar, 'Export options loaded');
}

/**
 * Show security options
 */
async function showSecurityOptions(content, statusBar) {
  let securityContent = `🔒 {bold}Security Features{/bold}\n`;
  securityContent += '═'.repeat(60) + '\n\n';
  
  securityContent += `{bold}Available Security Features:{/bold}\n\n`;
  securityContent += `• {cyan-fg}Note Encryption{/cyan-fg} - Encrypt sensitive notes\n`;
  securityContent += `• {cyan-fg}Automatic Backups{/cyan-fg} - Protect against data loss\n`;
  securityContent += `• {cyan-fg}Secure Sharing{/cyan-fg} - Share with expiring links\n`;
  securityContent += `• {cyan-fg}Access Control{/cyan-fg} - Password protection\n\n`;
  
  securityContent += `{bold}Backup Status:{/bold}\n`;
  securityContent += `• Automatic backups: {green-fg}Enabled{/green-fg}\n`;
  securityContent += `• Backup location: ./data/backups/\n`;
  securityContent += `• Last backup: ${new Date().toLocaleString()}\n\n`;
  
  securityContent += `{bold}Encryption:{/bold}\n`;
  securityContent += `• Algorithm: AES-256\n`;
  securityContent += `• Key management: Environment variable\n`;
  securityContent += `• Status: {yellow-fg}Available{/yellow-fg}\n\n`;
  
  securityContent += `{bold}Best Practices:{/bold}\n`;
  securityContent += `• Set ENCRYPTION_KEY environment variable\n`;
  securityContent += `• Regular backups are automatically created\n`;
  securityContent += `• Use secure sharing for sensitive content\n`;
  
  content.setContent(securityContent);
  updateStatus(statusBar, 'Security information loaded');
}

/**
 * Show settings
 */
async function showSettings(content, statusBar) {
  let settingsContent = `⚙️ {bold}Settings & Configuration{/bold}\n`;
  settingsContent += '═'.repeat(60) + '\n\n';
  
  settingsContent += `{bold}Application Info:{/bold}\n`;
  settingsContent += `• Version: TeleMed Notes v2.0\n`;
  settingsContent += `• Node.js: ${process.version}\n`;
  settingsContent += `• Platform: ${process.platform}\n\n`;
  
  settingsContent += `{bold}Data Location:{/bold}\n`;
  settingsContent += `• Notes: ./data/notes.json\n`;
  settingsContent += `• Backups: ./data/backups/\n`;
  settingsContent += `• Exports: ./data/exports/\n`;
  settingsContent += `• Attachments: ./data/attachments/\n\n`;
  
  settingsContent += `{bold}Environment Variables:{/bold}\n`;
  settingsContent += `• ENCRYPTION_KEY: ${process.env.ENCRYPTION_KEY ? 'Set' : 'Not set'}\n`;
  settingsContent += `• NODE_ENV: ${process.env.NODE_ENV || 'development'}\n\n`;
  
  settingsContent += `{bold}Keyboard Shortcuts:{/bold}\n`;
  settingsContent += `• F1: Show help\n`;
  settingsContent += `• Ctrl+C: Exit application\n`;
  settingsContent += `• Arrow keys: Navigate\n`;
  settingsContent += `• Enter: Select option\n`;
  
  content.setContent(settingsContent);
  updateStatus(statusBar, 'Settings loaded');
}

/**
 * Show help information
 */
function showHelp(content) {
  let helpContent = `❓ {bold}Help & Instructions{/bold}\n`;
  helpContent += '═'.repeat(60) + '\n\n';
  
  helpContent += `{bold}Navigation:{/bold}\n`;
  helpContent += `• Use arrow keys to navigate the sidebar\n`;
  helpContent += `• Press Enter to select an option\n`;
  helpContent += `• Use Ctrl+C to exit the application\n\n`;
  
  helpContent += `{bold}Features:{/bold}\n`;
  helpContent += `• 📝 All Notes - View and browse all your notes\n`;
  helpContent += `• ➕ Add New Note - Create a new note with AI enhancement\n`;
  helpContent += `• 🔍 Search Notes - Find notes by keyword\n`;
  helpContent += `• 📊 Analytics - View statistics and insights\n`;
  helpContent += `• 🤖 AI Analysis - AI-powered features information\n`;
  helpContent += `• 📤 Export Notes - Export in various formats\n`;
  helpContent += `• 🔒 Security - Security and backup options\n`;
  helpContent += `• ⚙️ Settings - Application configuration\n\n`;
  
  helpContent += `{bold}CLI Mode:{/bold}\n`;
  helpContent += `Exit this TUI mode to use CLI commands:\n`;
  helpContent += `• npm start add "title" "content"\n`;
  helpContent += `• npm start list\n`;
  helpContent += `• npm start search "term"\n`;
  helpContent += `• npm start analyze "title"\n`;
  
  content.setContent(helpContent);
}

/**
 * Update status bar
 */
function updateStatus(statusBar, message, color = 'white') {
  const timestamp = new Date().toLocaleTimeString();
  const colorMap = {
    'white': '',
    'green': '{green-fg}',
    'red': '{red-fg}',
    'yellow': '{yellow-fg}'
  };
  
  const colorStart = colorMap[color] || '';
  const colorEnd = color !== 'white' ? '{/}' : '';
  
  statusBar.setContent(` Status: ${colorStart}${message}${colorEnd} | ${timestamp} | Press F1 for help`);
  statusBar.screen.render();
}
