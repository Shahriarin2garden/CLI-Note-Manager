#!/usr/bin/env node

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

console.log('=== Step 3: File System Operations & JSON Configuration ===\n');

// Configuration for our file manager
const config = {
  dataDir: './data',
  configFile: './data/config.json',
  notesFile: './data/notes.json',
  backupDir: './data/backups',
  maxFileSize: 1024 * 1024, // 1MB
  allowedExtensions: ['.txt', '.json', '.md', '.log']
};

// File Manager Class demonstrating all CRUD operations
class FileManager {
  constructor(config) {
    this.config = config;
    this.initializeDirectories();
  }

  // CREATE: Initialize directory structure
  initializeDirectories() {
    console.log('📁 Creating Directory Structure:');
    
    const directories = [
      this.config.dataDir,
      this.config.backupDir,
      path.join(this.config.backupDir, 'daily'),
      path.join(this.config.backupDir, 'weekly')
    ];

    directories.forEach(dir => {
      try {
        if (!fsSync.existsSync(dir)) {
          fsSync.mkdirSync(dir, { recursive: true });
          console.log(`  ✅ Created: ${dir}`);
        } else {
          console.log(`  📂 Exists: ${dir}`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to create ${dir}:`, error.message);
      }
    });
  }

  // CREATE: Write JSON configuration file
  async createConfig() {
    console.log('\n⚙️ Creating Configuration File:');
    
    const defaultConfig = {
      appName: 'File Manager CLI',
      version: '1.0.0',
      settings: {
        maxFiles: 1000,
        autoBackup: true,
        backupInterval: '24h',
        logLevel: 'info',
        allowedTypes: this.config.allowedExtensions
      },
      paths: {
        data: this.config.dataDir,
        backups: this.config.backupDir,
        logs: './logs'
      },
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    try {
      await fs.writeFile(
        this.config.configFile, 
        JSON.stringify(defaultConfig, null, 2),
        'utf8'
      );
      console.log(`  ✅ Configuration written to: ${this.config.configFile}`);
      
      // Verify file was created
      const stats = await fs.stat(this.config.configFile);
      console.log(`  📊 File size: ${stats.size} bytes`);
      console.log(`  🕐 Created: ${stats.birthtime.toLocaleString()}`);
      
      return defaultConfig;
    } catch (error) {
      console.error('  ❌ Failed to create config:', error.message);
      throw error;
    }
  }

  // READ: Load and parse JSON configuration
  async readConfig() {
    console.log('\n📖 Reading Configuration File:');
    
    try {
      // Check if file exists first
      if (!fsSync.existsSync(this.config.configFile)) {
        console.log('  ⚠️ Config file not found, creating default...');
        return await this.createConfig();
      }

      const data = await fs.readFile(this.config.configFile, 'utf8');
      const parsedConfig = JSON.parse(data);
      
      console.log('  ✅ Configuration loaded successfully');
      console.log('  📋 App Name:', parsedConfig.appName);
      console.log('  🔢 Version:', parsedConfig.version);
      console.log('  ⚙️ Max Files:', parsedConfig.settings.maxFiles);
      console.log('  🔄 Auto Backup:', parsedConfig.settings.autoBackup);
      
      return parsedConfig;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('  ⚠️ Config file not found');
      } else if (error instanceof SyntaxError) {
        console.error('  ❌ Invalid JSON in config file:', error.message);
      } else {
        console.error('  ❌ Failed to read config:', error.message);
      }
      throw error;
    }
  }

  // UPDATE: Modify existing configuration
  async updateConfig(updates) {
    console.log('\n🔄 Updating Configuration:');
    
    try {
      // Read current config
      const currentConfig = await this.readConfig();
      
      // Merge updates with current config
      const updatedConfig = {
        ...currentConfig,
        ...updates,
        settings: {
          ...currentConfig.settings,
          ...(updates.settings || {})
        },
        lastModified: new Date().toISOString()
      };
      
      // Write updated config back to file
      await fs.writeFile(
        this.config.configFile,
        JSON.stringify(updatedConfig, null, 2),
        'utf8'
      );
      
      console.log('  ✅ Configuration updated successfully');
      console.log('  📝 Changes applied:', Object.keys(updates).join(', '));
      
      return updatedConfig;
    } catch (error) {
      console.error('  ❌ Failed to update config:', error.message);
      throw error;
    }
  }

  // CREATE: Add notes to JSON file
  async createNote(title, content, tags = []) {
    console.log('\n📝 Creating Note:');
    
    const note = {
      id: Date.now(),
      title,
      content,
      tags,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    };

    try {
      // Load existing notes or create empty array
      let notes = [];
      if (fsSync.existsSync(this.config.notesFile)) {
        const data = await fs.readFile(this.config.notesFile, 'utf8');
        notes = JSON.parse(data);
      }

      // Add new note
      notes.push(note);

      // Save updated notes
      await fs.writeFile(
        this.config.notesFile,
        JSON.stringify(notes, null, 2),
        'utf8'
      );

      console.log(`  ✅ Note created with ID: ${note.id}`);
      console.log(`  📋 Title: ${note.title}`);
      console.log(`  📊 Total notes: ${notes.length}`);
      
      return note;
    } catch (error) {
      console.error('  ❌ Failed to create note:', error.message);
      throw error;
    }
  }

  // READ: List all files in directory with metadata
  async listFiles(directory = this.config.dataDir) {
    console.log(`\n📂 Listing Files in: ${directory}`);
    
    try {
      const items = await fs.readdir(directory);
      console.log(`  📊 Found ${items.length} items:`);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const stats = await fs.stat(itemPath);
        
        const type = stats.isDirectory() ? '📁' : '📄';
        const size = stats.isFile() ? `${stats.size} bytes` : 'N/A';
        const modified = stats.mtime.toLocaleString();
        
        console.log(`  ${type} ${item} (${size}, modified: ${modified})`);
      }
      
      return items;
    } catch (error) {
      console.error('  ❌ Failed to list files:', error.message);
      throw error;
    }
  }

  // DELETE: Remove files with safety checks
  async deleteFile(filePath) {
    console.log(`\n🗑️ Deleting File: ${filePath}`);
    
    try {
      // Safety check - ensure file exists
      const stats = await fs.stat(filePath);
      
      // Create backup before deletion
      const backupPath = path.join(
        this.config.backupDir,
        `deleted_${Date.now()}_${path.basename(filePath)}`
      );
      
      await fs.copyFile(filePath, backupPath);
      console.log(`  📦 Backup created: ${backupPath}`);
      
      // Delete original file
      await fs.unlink(filePath);
      console.log(`  ✅ File deleted: ${filePath}`);
      
      return { deleted: filePath, backup: backupPath };
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.error('  ❌ File not found:', filePath);
      } else {
        console.error('  ❌ Failed to delete file:', error.message);
      }
      throw error;
    }
  }

  // Cross-platform path handling demonstration
  demonstratePlatformPaths() {
    console.log('\n🌍 Cross-Platform Path Handling:');
    
    const examplePaths = [
      'data/config.json',
      'data\\backups\\daily',
      './data/../data/notes.json',
      '/home/user/documents',
      'C:\\Users\\User\\Documents'
    ];

    examplePaths.forEach(originalPath => {
      const normalized = path.normalize(originalPath);
      const resolved = path.resolve(originalPath);
      const isAbsolute = path.isAbsolute(originalPath);
      
      console.log(`  Original: ${originalPath}`);
      console.log(`    Normalized: ${normalized}`);
      console.log(`    Absolute: ${isAbsolute}`);
      console.log(`    Resolved: ${resolved}`);
      console.log('');
    });
  }
}

// Demonstrate all file operations
async function demonstrateFileOperations() {
  try {
    const fileManager = new FileManager(config);
    
    // Test all CRUD operations
    await fileManager.createConfig();
    await fileManager.readConfig();
    
    await fileManager.updateConfig({
      settings: { maxFiles: 2000, logLevel: 'debug' }
    });
    
    await fileManager.createNote(
      'File System Lab',
      'Learning Node.js file operations with practical examples',
      ['node.js', 'filesystem', 'tutorial']
    );
    
    await fileManager.createNote(
      'JSON Configuration',
      'Understanding how to read and write JSON configuration files',
      ['json', 'config', 'best-practices']
    );
    
    await fileManager.listFiles();
    
    // Demonstrate cross-platform path handling
    fileManager.demonstratePlatformPaths();
    
    console.log('\n✅ All file operations completed successfully!');
    
  } catch (error) {
    console.error('❌ Demonstration failed:', error.message);
  }
}

// Run the demonstration
await demonstrateFileOperations();
