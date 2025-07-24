#!/usr/bin/env node

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment configuration
dotenv.config();

// CLI Application Class
class FileManagerCLI {
  constructor() {
    this.config = this.loadConfiguration();
    this.initializeApplication();
  }

  // Load and validate configuration
  loadConfiguration() {
    return {
      // Application settings
      appName: process.env.APP_NAME || 'FileManagerCLI',
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      debug: process.env.DEBUG === 'true',
      
      // File system limits
      maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '1048576'), // 1MB
      maxNotes: parseInt(process.env.MAX_NOTES || '100'),
      autoBackup: process.env.AUTO_BACKUP !== 'false',
      
      // Paths (platform-aware)
      dataDir: this.getDataDirectory(),
      backupDir: this.getBackupDirectory(),
      
      // Supported file types
      allowedExtensions: ['.txt', '.md', '.json', '.log'],
      
      // CLI settings
      colors: process.env.NO_COLOR !== 'true',
      verbose: process.env.VERBOSE === 'true'
    };
  }

  // Get platform-appropriate data directory
  getDataDirectory() {
    if (process.env.NODE_ENV === 'development') {
      return './data';
    }
    
    const platform = os.platform();
    const home = os.homedir();
    const appName = process.env.APP_NAME || 'FileManagerCLI';
    
    switch (platform) {
      case 'win32':
        return path.join(home, 'AppData', 'Roaming', appName);
      case 'darwin':
        return path.join(home, 'Library', 'Application Support', appName);
      default:
        return path.join(home, '.local', 'share', appName.toLowerCase());
    }
  }

  // Get platform-appropriate backup directory
  getBackupDirectory() {
    return path.join(this.getDataDirectory(), 'backups');
  }

  // Initialize application directories and files
  async initializeApplication() {
    try {
      // Create necessary directories
      await this.createDirectories();
      
      // Initialize data files if they don't exist
      await this.initializeDataFiles();
      
      if (this.config.debug) {
        console.log(chalk.gray('Application initialized successfully'));
      }
    } catch (error) {
      console.error(chalk.red('Failed to initialize application:', error.message));
      process.exit(1);
    }
  }

  // Create required directories
  async createDirectories() {
    const directories = [
      this.config.dataDir,
      this.config.backupDir,
      path.join(this.config.backupDir, 'daily'),
      path.join(this.config.backupDir, 'weekly')
    ];

    for (const dir of directories) {
      try {
        if (!fsSync.existsSync(dir)) {
          await fs.mkdir(dir, { recursive: true });
          if (this.config.verbose) {
            console.log(chalk.gray(`Created directory: ${dir}`));
          }
        }
      } catch (error) {
        throw new Error(`Failed to create directory ${dir}: ${error.message}`);
      }
    }
  }

  // Initialize data files with defaults
  async initializeDataFiles() {
    const notesFile = path.join(this.config.dataDir, 'notes.json');
    const configFile = path.join(this.config.dataDir, 'config.json');
    
    // Initialize notes file
    if (!fsSync.existsSync(notesFile)) {
      await fs.writeFile(notesFile, JSON.stringify([], null, 2));
    }
    
    // Initialize config file
    if (!fsSync.existsSync(configFile)) {
      const defaultConfig = {
        appName: this.config.appName,
        version: this.config.version,
        maxNotes: this.config.maxNotes,
        autoBackup: this.config.autoBackup,
        created: new Date().toISOString()
      };
      await fs.writeFile(configFile, JSON.stringify(defaultConfig, null, 2));
    }
  }

  // Load notes from storage
  async loadNotes() {
    const notesFile = path.join(this.config.dataDir, 'notes.json');
    
    try {
      const data = await fs.readFile(notesFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw new Error(`Failed to load notes: ${error.message}`);
    }
  }

  // Save notes to storage with backup
  async saveNotes(notes) {
    const notesFile = path.join(this.config.dataDir, 'notes.json');
    
    try {
      // Create backup if enabled
      if (this.config.autoBackup) {
        await this.createBackup();
      }
      
      await fs.writeFile(notesFile, JSON.stringify(notes, null, 2));
    } catch (error) {
      throw new Error(`Failed to save notes: ${error.message}`);
    }
  }

  // Create backup of current notes
  async createBackup() {
    const notesFile = path.join(this.config.dataDir, 'notes.json');
    
    if (!fsSync.existsSync(notesFile)) {
      return; // No file to backup
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(
      this.config.backupDir, 
      `notes-backup-${timestamp}.json`
    );
    
    try {
      await fs.copyFile(notesFile, backupFile);
      if (this.config.verbose) {
        console.log(chalk.gray(`Backup created: ${backupFile}`));
      }
    } catch (error) {
      console.warn(chalk.yellow(`Failed to create backup: ${error.message}`));
    }
  }

  // Add a new note
  async addNote(title, content = '') {
    try {
      const notes = await this.loadNotes();
      
      if (notes.length >= this.config.maxNotes) {
        throw new Error(`Maximum notes limit reached (${this.config.maxNotes})`);
      }
      
      const note = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        tags: []
      };
      
      notes.push(note);
      await this.saveNotes(notes);
      
      console.log(chalk.green(`✅ Note added successfully!`));
      console.log(chalk.blue(`📝 Title: ${note.title}`));
      console.log(chalk.gray(`🆔 ID: ${note.id}`));
      
      return note;
    } catch (error) {
      console.error(chalk.red(`❌ Failed to add note: ${error.message}`));
      throw error;
    }
  }

  // List all notes
  async listNotes(filter = null) {
    try {
      const notes = await this.loadNotes();
      
      if (notes.length === 0) {
        console.log(chalk.yellow('📭 No notes found.'));
        return;
      }
      
      let filteredNotes = notes;
      if (filter) {
        filteredNotes = notes.filter(note => 
          note.title.toLowerCase().includes(filter.toLowerCase()) ||
          note.content.toLowerCase().includes(filter.toLowerCase())
        );
      }
      
      console.log(chalk.blue(`📋 Found ${filteredNotes.length} note(s):`));
      console.log('');
      
      filteredNotes.forEach((note, index) => {
        console.log(chalk.cyan(`${index + 1}. ${note.title}`));
        console.log(chalk.gray(`   ID: ${note.id}`));
        console.log(chalk.gray(`   Created: ${new Date(note.created).toLocaleString()}`));
        if (note.content) {
          const preview = note.content.length > 100 
            ? note.content.substring(0, 100) + '...' 
            : note.content;
          console.log(chalk.white(`   ${preview}`));
        }
        console.log('');
      });
      
      return filteredNotes;
    } catch (error) {
      console.error(chalk.red(`❌ Failed to list notes: ${error.message}`));
      throw error;
    }
  }

  // Read a specific note
  async readNote(noteId) {
    try {
      const notes = await this.loadNotes();
      const note = notes.find(n => n.id.toString() === noteId.toString());
      
      if (!note) {
        console.log(chalk.yellow(`📭 Note with ID ${noteId} not found.`));
        return null;
      }
      
      console.log(chalk.blue(`📖 Reading Note: ${note.title}`));
      console.log(chalk.gray(`🆔 ID: ${note.id}`));
      console.log(chalk.gray(`📅 Created: ${new Date(note.created).toLocaleString()}`));
      console.log(chalk.gray(`✏️ Modified: ${new Date(note.modified).toLocaleString()}`));
      console.log('');
      console.log(chalk.white(note.content || 'No content available.'));
      
      return note;
    } catch (error) {
      console.error(chalk.red(`❌ Failed to read note: ${error.message}`));
      throw error;
    }
  }

  // Remove a note
  async removeNote(noteId) {
    try {
      const notes = await this.loadNotes();
      const noteIndex = notes.findIndex(n => n.id.toString() === noteId.toString());
      
      if (noteIndex === -1) {
        console.log(chalk.yellow(`📭 Note with ID ${noteId} not found.`));
        return false;
      }
      
      const removedNote = notes.splice(noteIndex, 1)[0];
      await this.saveNotes(notes);
      
      console.log(chalk.green(`✅ Note removed successfully!`));
      console.log(chalk.blue(`📝 Title: ${removedNote.title}`));
      
      return true;
    } catch (error) {
      console.error(chalk.red(`❌ Failed to remove note: ${error.message}`));
      throw error;
    }
  }

  // Search notes
  async searchNotes(query) {
    try {
      const notes = await this.loadNotes();
      const results = notes.filter(note => 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      
      if (results.length === 0) {
        console.log(chalk.yellow(`🔍 No notes found matching "${query}".`));
        return [];
      }
      
      console.log(chalk.blue(`🔍 Found ${results.length} note(s) matching "${query}":`));
      console.log('');
      
      results.forEach((note, index) => {
        console.log(chalk.cyan(`${index + 1}. ${note.title}`));
        console.log(chalk.gray(`   ID: ${note.id}`));
        
        // Highlight matching content
        const content = note.content || '';
        const queryIndex = content.toLowerCase().indexOf(query.toLowerCase());
        if (queryIndex !== -1) {
          const start = Math.max(0, queryIndex - 50);
          const end = Math.min(content.length, queryIndex + query.length + 50);
          const excerpt = content.substring(start, end);
          console.log(chalk.white(`   ...${excerpt}...`));
        }
        console.log('');
      });
      
      return results;
    } catch (error) {
      console.error(chalk.red(`❌ Failed to search notes: ${error.message}`));
      throw error;
    }
  }

  // Display help information
  showHelp() {
    console.log(chalk.blue.bold(`\n${this.config.appName} v${this.config.version}`));
    console.log(chalk.gray('A professional CLI file manager built with Node.js core modules\n'));
    
    console.log(chalk.yellow('Usage:'));
    console.log('  node index.js <command> [options]\n');
    
    console.log(chalk.yellow('Commands:'));
    console.log('  add <title> [content]     Add a new note');
    console.log('  list [filter]             List all notes (optionally filtered)');
    console.log('  read <id>                 Read a specific note');
    console.log('  remove <id>               Remove a note');
    console.log('  search <query>            Search notes by title, content, or tags');
    console.log('  help                      Show this help message\n');
    
    console.log(chalk.yellow('Examples:'));
    console.log('  node index.js add "My First Note" "This is the content"');
    console.log('  node index.js list');
    console.log('  node index.js search "javascript"');
    console.log('  node index.js read 1234567890');
    console.log('  node index.js remove 1234567890\n');
    
    console.log(chalk.yellow('Configuration:'));
    console.log(`  Data Directory: ${this.config.dataDir}`);
    console.log(`  Environment: ${this.config.environment}`);
    console.log(`  Max Notes: ${this.config.maxNotes}`);
    console.log(`  Auto Backup: ${this.config.autoBackup ? 'Enabled' : 'Disabled'}`);
  }

  // Main CLI handler
  async handleCommand(args) {
    const command = args[0];
    
    try {
      switch (command) {
        case 'add':
          if (!args[1]) {
            console.error(chalk.red('❌ Error: Note title is required'));
            console.log('Usage: node index.js add <title> [content]');
            process.exit(1);
          }
          await this.addNote(args[1], args[2] || '');
          break;
          
        case 'list':
          await this.listNotes(args[1]);
          break;
          
        case 'read':
          if (!args[1]) {
            console.error(chalk.red('❌ Error: Note ID is required'));
            console.log('Usage: node index.js read <id>');
            process.exit(1);
          }
          await this.readNote(args[1]);
          break;
          
        case 'remove':
          if (!args[1]) {
            console.error(chalk.red('❌ Error: Note ID is required'));
            console.log('Usage: node index.js remove <id>');
            process.exit(1);
          }
          await this.removeNote(args[1]);
          break;
          
        case 'search':
          if (!args[1]) {
            console.error(chalk.red('❌ Error: Search query is required'));
            console.log('Usage: node index.js search <query>');
            process.exit(1);
          }
          await this.searchNotes(args[1]);
          break;
          
        case 'help':
        case '--help':
        case '-h':
          this.showHelp();
          break;
          
        default:
          if (command) {
            console.error(chalk.red(`❌ Unknown command: ${command}`));
          }
          this.showHelp();
          process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red(`❌ Command failed: ${error.message}`));
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(chalk.blue('🚀 Welcome to File Manager CLI!'));
    console.log(chalk.gray('Run "node index.js help" for usage information.\n'));
  }
  
  const cli = new FileManagerCLI();
  await cli.handleCommand(args);
}

// Run the CLI
main().catch(error => {
  console.error(chalk.red('❌ Application failed:', error.message));
  process.exit(1);
});
