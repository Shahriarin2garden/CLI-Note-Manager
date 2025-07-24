#!/usr/bin/env node

/**
 * Lab 2: Node.js Core Modules & File System Operations
 * 
 * This lab demonstrates:
 * 1. Package.json configuration and NPM basics
 * 2. Built-in modules: fs, path, os, util
 * 3. File system operations (CRUD & JSON configuration)
 * 4. Environment variables and .env files
 * 5. Complete file manager CLI tool
 * 
 * Run with: node labs/lab2.js
 */

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import os from 'os';
import util from 'util';
import { fileURLToPath } from 'url';

// Get current file directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Lab 2: Node.js Core Modules & File System Operations\n');

// =============================================================================
// SECTION 1: Package.json & NPM Concepts Demonstration
// =============================================================================

function demonstratePackageJsonConcepts() {
  console.log('📦 SECTION 1: Package.json & NPM Concepts');
  console.log('=' .repeat(60));
  
  console.log('\n🔍 Understanding Package.json Structure:');
  
  // Read and display current package.json
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  try {
    const packageData = JSON.parse(fsSync.readFileSync(packageJsonPath, 'utf8'));
    
    console.log('📋 Current Project Configuration:');
    console.log(`  Name: ${packageData.name}`);
    console.log(`  Version: ${packageData.version}`);
    console.log(`  Description: ${packageData.description || 'No description'}`);
    console.log(`  Main Entry: ${packageData.main || 'index.js'}`);
    console.log(`  Module Type: ${packageData.type || 'commonjs'}`);
    
    // Display dependencies
    if (packageData.dependencies) {
      console.log('\n📚 Production Dependencies:');
      Object.entries(packageData.dependencies).forEach(([name, version]) => {
        console.log(`  ${name}: ${version}`);
      });
    }
    
    if (packageData.devDependencies) {
      console.log('\n🛠️ Development Dependencies:');
      Object.entries(packageData.devDependencies).forEach(([name, version]) => {
        console.log(`  ${name}: ${version}`);
      });
    }
    
    // Display scripts
    if (packageData.scripts) {
      console.log('\n⚙️ Available Scripts:');
      Object.entries(packageData.scripts).forEach(([name, script]) => {
        console.log(`  npm run ${name}: ${script}`);
      });
    }
    
    console.log('\n✅ Package.json analysis completed');
    
  } catch (error) {
    console.error('❌ Failed to read package.json:', error.message);
  }
  
  console.log('\n💡 Key Concepts:');
  console.log('  • Semantic Versioning: MAJOR.MINOR.PATCH');
  console.log('  • Dependencies: Runtime vs Development packages');
  console.log('  • Scripts: Custom commands for automation');
  console.log('  • Module System: CommonJS vs ES Modules');
  
  return packageData;
}

// =============================================================================
// SECTION 2: Built-in Modules Demonstration
// =============================================================================

function demonstrateBuiltinModules() {
  console.log('\n\n🔧 SECTION 2: Built-in Modules (fs, path, os, util)');
  console.log('=' .repeat(60));
  
  // OS Module - System Information
  console.log('\n💻 OS Module - System Information:');
  console.log(`  Platform: ${os.platform()}`);
  console.log(`  Architecture: ${os.arch()}`);
  console.log(`  Release: ${os.release()}`);
  console.log(`  Hostname: ${os.hostname()}`);
  console.log(`  Home Directory: ${os.homedir()}`);
  console.log(`  Temp Directory: ${os.tmpdir()}`);
  
  // Memory information
  const totalMem = Math.round(os.totalmem() / 1024 / 1024 / 1024);
  const freeMem = Math.round(os.freemem() / 1024 / 1024);
  console.log(`  Memory: ${freeMem}MB free of ${totalMem}GB total`);
  
  // CPU information
  const cpus = os.cpus();
  console.log(`  CPU: ${cpus.length} cores, ${cpus[0].model}`);
  
  // Network interfaces
  const networks = os.networkInterfaces();
  console.log(`  Network Interfaces: ${Object.keys(networks).join(', ')}`);
  
  // Path Module - Cross-platform Operations
  console.log('\n📁 Path Module - Cross-platform Operations:');
  const projectRoot = process.cwd();
  const labsDir = path.join(projectRoot, 'labs');
  const dataDir = path.join(projectRoot, 'data');
  const configFile = path.join(dataDir, 'config.json');
  
  console.log(`  Project Root: ${projectRoot}`);
  console.log(`  Labs Directory: ${labsDir}`);
  console.log(`  Data Directory: ${dataDir}`);
  console.log(`  Config File: ${configFile}`);
  
  // Path analysis
  console.log('\n🔍 Path Analysis:');
  console.log(`  Config Dirname: ${path.dirname(configFile)}`);
  console.log(`  Config Basename: ${path.basename(configFile)}`);
  console.log(`  Config Extension: ${path.extname(configFile)}`);
  console.log(`  Name without extension: ${path.basename(configFile, '.json')}`);
  
  // Path utilities
  console.log('\n🛠️ Path Utilities:');
  console.log(`  Is Absolute: ${path.isAbsolute(configFile)}`);
  console.log(`  Relative to project: ${path.relative(projectRoot, configFile)}`);
  console.log(`  Path Separator: ${path.sep}`);
  console.log(`  Path Delimiter: ${path.delimiter}`);
  
  // Util Module - Object Inspection
  console.log('\n🔧 Util Module - Object Inspection:');
  const complexObject = {
    lab: 'Node.js Core Modules',
    version: '2.0',
    concepts: ['fs', 'path', 'os', 'util'],
    config: {
      difficulty: 'intermediate',
      duration: '2 hours',
      prerequisites: ['JavaScript basics', 'Lab 1 completion']
    },
    timestamp: new Date()
  };
  
  console.log('📋 Object Inspection:');
  console.log(util.inspect(complexObject, {
    colors: false,
    depth: 2,
    compact: true
  }));
  
  // Type checking utilities
  console.log('\n🔍 Type Checking:');
  console.log(`  Is Date: ${util.types.isDate(complexObject.timestamp)}`);
  console.log(`  Is Array: ${util.types.isUint8Array(complexObject.concepts)}`);
  console.log(`  Is Promise: ${util.types.isPromise(Promise.resolve())}`);
  
  console.log('\n✅ Built-in modules demonstration completed');
  
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: cpus.length,
    paths: { projectRoot, labsDir, dataDir, configFile }
  };
}

// =============================================================================
// SECTION 3: File System Operations (CRUD & JSON Configuration)
// =============================================================================

class FileSystemDemo {
  constructor(baseDir) {
    this.baseDir = baseDir;
    this.dataDir = path.join(baseDir, 'lab2-demo-data');
    this.configFile = path.join(this.dataDir, 'demo-config.json');
    this.notesFile = path.join(this.dataDir, 'demo-notes.json');
    this.backupDir = path.join(this.dataDir, 'backups');
  }

  async demonstrateFileOperations() {
    console.log('\n\n📂 SECTION 3: File System Operations (CRUD & JSON)');
    console.log('=' .repeat(60));
    
    try {
      // CREATE: Initialize directory structure
      await this.createDirectories();
      
      // CREATE: Write JSON configuration
      await this.createConfiguration();
      
      // READ: Load and display configuration
      await this.readConfiguration();
      
      // UPDATE: Modify configuration
      await this.updateConfiguration();
      
      // CREATE: Add sample notes
      await this.createNotes();
      
      // READ: List files and their metadata
      await this.listFiles();
      
      // DELETE: Demonstrate safe file deletion
      await this.demonstrateFileDeletion();
      
      // Cross-platform path handling
      this.demonstratePlatformPaths();
      
      console.log('\n✅ File system operations demonstration completed');
      
    } catch (error) {
      console.error('❌ File operations failed:', error.message);
    }
  }

  async createDirectories() {
    console.log('\n📁 Creating Directory Structure:');
    
    const directories = [
      this.dataDir,
      this.backupDir,
      path.join(this.backupDir, 'daily'),
      path.join(this.backupDir, 'weekly')
    ];

    for (const dir of directories) {
      try {
        if (!fsSync.existsSync(dir)) {
          await fs.mkdir(dir, { recursive: true });
          console.log(`  ✅ Created: ${path.relative(this.baseDir, dir)}`);
        } else {
          console.log(`  📂 Exists: ${path.relative(this.baseDir, dir)}`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to create ${dir}:`, error.message);
      }
    }
  }

  async createConfiguration() {
    console.log('\n⚙️ Creating JSON Configuration:');
    
    const defaultConfig = {
      application: {
        name: 'Lab 2 Demo',
        version: '1.0.0',
        environment: 'development'
      },
      settings: {
        maxFiles: 100,
        autoBackup: true,
        backupInterval: '1h',
        logLevel: 'debug',
        allowedTypes: ['.txt', '.json', '.md', '.log']
      },
      paths: {
        data: this.dataDir,
        backups: this.backupDir,
        logs: './logs'
      },
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    try {
      await fs.writeFile(
        this.configFile, 
        JSON.stringify(defaultConfig, null, 2),
        'utf8'
      );
      console.log(`  ✅ Configuration written to: ${path.relative(this.baseDir, this.configFile)}`);
      
      // Verify file was created
      const stats = await fs.stat(this.configFile);
      console.log(`  📊 File size: ${stats.size} bytes`);
      console.log(`  🕐 Created: ${stats.birthtime.toLocaleString()}`);
      
      return defaultConfig;
    } catch (error) {
      console.error('  ❌ Failed to create config:', error.message);
      throw error;
    }
  }

  async readConfiguration() {
    console.log('\n📖 Reading JSON Configuration:');
    
    try {
      const data = await fs.readFile(this.configFile, 'utf8');
      const config = JSON.parse(data);
      
      console.log('  ✅ Configuration loaded successfully');
      console.log(`  📋 App Name: ${config.application.name}`);
      console.log(`  🔢 Version: ${config.application.version}`);
      console.log(`  🌍 Environment: ${config.application.environment}`);
      console.log(`  ⚙️ Max Files: ${config.settings.maxFiles}`);
      console.log(`  🔄 Auto Backup: ${config.settings.autoBackup}`);
      
      return config;
    } catch (error) {
      console.error('  ❌ Failed to read config:', error.message);
      throw error;
    }
  }

  async updateConfiguration() {
    console.log('\n🔄 Updating Configuration:');
    
    try {
      // Read current config
      const data = await fs.readFile(this.configFile, 'utf8');
      const currentConfig = JSON.parse(data);
      
      // Apply updates
      const updates = {
        settings: {
          ...currentConfig.settings,
          maxFiles: 200,
          logLevel: 'info'
        },
        lastModified: new Date().toISOString()
      };
      
      const updatedConfig = { ...currentConfig, ...updates };
      
      // Write updated config
      await fs.writeFile(
        this.configFile,
        JSON.stringify(updatedConfig, null, 2),
        'utf8'
      );
      
      console.log('  ✅ Configuration updated successfully');
      console.log('  📝 Changes: maxFiles: 100 → 200, logLevel: debug → info');
      
      return updatedConfig;
    } catch (error) {
      console.error('  ❌ Failed to update config:', error.message);
      throw error;
    }
  }

  async createNotes() {
    console.log('\n📝 Creating Sample Notes:');
    
    const sampleNotes = [
      {
        id: Date.now(),
        title: 'Node.js File Operations',
        content: 'Learning CRUD operations with the fs module',
        tags: ['nodejs', 'filesystem', 'crud'],
        created: new Date().toISOString()
      },
      {
        id: Date.now() + 1,
        title: 'JSON Configuration',
        content: 'Best practices for configuration management',
        tags: ['json', 'config', 'best-practices'],
        created: new Date().toISOString()
      }
    ];

    try {
      await fs.writeFile(
        this.notesFile,
        JSON.stringify(sampleNotes, null, 2),
        'utf8'
      );
      
      console.log(`  ✅ Created ${sampleNotes.length} sample notes`);
      console.log(`  📄 Notes file: ${path.relative(this.baseDir, this.notesFile)}`);
      
      sampleNotes.forEach((note, index) => {
        console.log(`    ${index + 1}. ${note.title} (${note.tags.join(', ')})`);
      });
      
      return sampleNotes;
    } catch (error) {
      console.error('  ❌ Failed to create notes:', error.message);
      throw error;
    }
  }

  async listFiles() {
    console.log(`\n📂 Listing Files in: ${path.relative(this.baseDir, this.dataDir)}`);
    
    try {
      const items = await fs.readdir(this.dataDir);
      console.log(`  📊 Found ${items.length} items:`);
      
      for (const item of items) {
        const itemPath = path.join(this.dataDir, item);
        const stats = await fs.stat(itemPath);
        
        const type = stats.isDirectory() ? '📁' : '📄';
        const size = stats.isFile() ? `${stats.size} bytes` : 'N/A';
        const modified = stats.mtime.toLocaleString();
        
        console.log(`    ${type} ${item} (${size}, modified: ${modified})`);
      }
      
      return items;
    } catch (error) {
      console.error('  ❌ Failed to list files:', error.message);
      throw error;
    }
  }

  async demonstrateFileDeletion() {
    console.log('\n🗑️ Demonstrating Safe File Deletion:');
    
    // Create a temporary file for deletion demo
    const tempFile = path.join(this.dataDir, 'temp-delete-demo.txt');
    
    try {
      // Create temporary file
      await fs.writeFile(tempFile, 'This is a temporary file for deletion demo');
      console.log(`  📄 Created temporary file: ${path.basename(tempFile)}`);
      
      // Create backup before deletion
      const backupFile = path.join(
        this.backupDir,
        `deleted_${Date.now()}_${path.basename(tempFile)}`
      );
      
      await fs.copyFile(tempFile, backupFile);
      console.log(`  📦 Backup created: ${path.relative(this.baseDir, backupFile)}`);
      
      // Delete original file
      await fs.unlink(tempFile);
      console.log(`  ✅ Original file deleted: ${path.basename(tempFile)}`);
      console.log('  💡 Safe deletion: Backup created before deletion');
      
    } catch (error) {
      console.error('  ❌ Failed file deletion demo:', error.message);
    }
  }

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
      const isAbsolute = path.isAbsolute(originalPath);
      
      console.log(`  Original: ${originalPath}`);
      console.log(`    Normalized: ${normalized}`);
      console.log(`    Is Absolute: ${isAbsolute}`);
      console.log('');
    });
  }
}

// =============================================================================
// SECTION 4: Environment Variables and Configuration
// =============================================================================

function demonstrateEnvironmentConfig() {
  console.log('\n\n🌍 SECTION 4: Environment Variables & Configuration');
  console.log('=' .repeat(60));
  
  console.log('\n🔧 Environment Variables:');
  console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`  DEBUG: ${process.env.DEBUG || 'not set'}`);
  console.log(`  PATH: ${process.env.PATH ? 'set' : 'not set'} (${process.env.PATH ? process.env.PATH.split(path.delimiter).length + ' entries' : ''})`);
  
  console.log('\n🖥️ Platform-Specific Configuration:');
  const platform = os.platform();
  const home = os.homedir();
  
  console.log(`  Platform: ${platform}`);
  console.log(`  Architecture: ${os.arch()}`);
  console.log(`  Home Directory: ${home}`);
  
  // Platform-specific paths
  let appDataPath, configPath;
  
  switch (platform) {
    case 'win32':
      appDataPath = path.join(home, 'AppData', 'Roaming', 'Lab2Demo');
      configPath = path.join(home, 'AppData', 'Local', 'Lab2Demo');
      break;
      
    case 'darwin':
      appDataPath = path.join(home, 'Library', 'Application Support', 'Lab2Demo');
      configPath = path.join(home, 'Library', 'Preferences', 'Lab2Demo');
      break;
      
    default: // Linux and other Unix-like systems
      appDataPath = path.join(home, '.local', 'share', 'lab2demo');
      configPath = path.join(home, '.config', 'lab2demo');
      break;
  }
  
  console.log('\n📁 Platform-Appropriate Paths:');
  console.log(`  App Data: ${appDataPath}`);
  console.log(`  Config: ${configPath}`);
  
  console.log('\n💡 Configuration Best Practices:');
  console.log('  • Use environment variables for sensitive data');
  console.log('  • Separate development from production settings');
  console.log('  • Follow platform conventions for file storage');
  console.log('  • Validate configuration on startup');
  
  return { platform, appDataPath, configPath };
}

// =============================================================================
// SECTION 5: CLI Application Concepts
// =============================================================================

function demonstrateCLIConcepts() {
  console.log('\n\n🖥️ SECTION 5: CLI Application Concepts');
  console.log('=' .repeat(60));
  
  console.log('\n📋 Command Line Arguments:');
  console.log(`  Process: ${process.argv[0]}`);
  console.log(`  Script: ${process.argv[1]}`);
  
  if (process.argv.length > 2) {
    console.log('  Arguments:');
    process.argv.slice(2).forEach((arg, index) => {
      console.log(`    ${index + 1}. ${arg}`);
    });
  } else {
    console.log('  Arguments: none provided');
  }
  
  console.log('\n🎯 CLI Design Principles:');
  console.log('  • Clear command structure: program command [options] [arguments]');
  console.log('  • Helpful error messages and usage information');
  console.log('  • Consistent interface across different platforms');
  console.log('  • Proper exit codes for success/failure');
  
  console.log('\n🛠️ File Manager CLI Features:');
  console.log('  • Add, list, search, and remove notes');
  console.log('  • Automatic backup before destructive operations');
  console.log('  • Cross-platform file storage');
  console.log('  • Environment-based configuration');
  
  console.log('\n📚 Available Commands (in lab2-cli-workshop):');
  console.log('  node lab2-cli-workshop/index.js help');
  console.log('  node lab2-cli-workshop/index.js add "Your note title"');
  console.log('  node lab2-cli-workshop/index.js list');
  console.log('  node lab2-cli-workshop/index.js search "keyword"');
  console.log('  node lab2-cli-workshop/index.js remove <id>');
  
  return process.argv;
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function runLab2() {
  try {
    console.log('🎓 Welcome to Lab 2: Node.js Core Modules & File System Operations');
    console.log('📚 This lab covers package.json, built-in modules, file operations, and CLI development\n');
    
    // Section 1: Package.json concepts
    const packageInfo = demonstratePackageJsonConcepts();
    
    // Section 2: Built-in modules
    const systemInfo = demonstrateBuiltinModules();
    
    // Section 3: File system operations
    const fileDemo = new FileSystemDemo(process.cwd());
    await fileDemo.demonstrateFileOperations();
    
    // Section 4: Environment configuration
    const envInfo = demonstrateEnvironmentConfig();
    
    // Section 5: CLI concepts
    const cliInfo = demonstrateCLIConcepts();
    
    // Summary
    console.log('\n\n🎉 LAB 2 COMPLETED SUCCESSFULLY!');
    console.log('=' .repeat(60));
    console.log('📊 Lab Summary:');
    console.log(`  Platform: ${systemInfo.platform} (${systemInfo.arch})`);
    console.log(`  CPU Cores: ${systemInfo.cpus}`);
    console.log(`  Project: ${packageInfo?.name || 'Unknown'}`);
    console.log(`  Environment: ${envInfo.platform}`);
    console.log(`  Arguments: ${cliInfo.length - 2} provided`);
    
    console.log('\n🚀 Next Steps:');
    console.log('  1. Explore the lab2-cli-workshop directory');
    console.log('  2. Try running the CLI commands shown above');
    console.log('  3. Examine the generated demo files');
    console.log('  4. Proceed to Lab 3 for advanced async programming');
    
    console.log('\n📖 Key Concepts Mastered:');
    console.log('  ✅ Package.json configuration and NPM basics');
    console.log('  ✅ Built-in modules: fs, path, os, util');
    console.log('  ✅ File system CRUD operations');
    console.log('  ✅ JSON configuration management');
    console.log('  ✅ Environment variables and platform detection');
    console.log('  ✅ CLI application design principles');
    
    console.log('\n💡 Remember: Practice these concepts in your own projects!');
    
  } catch (error) {
    console.error('❌ Lab 2 failed:', error.message);
    console.error('🔍 Check the error details above for troubleshooting');
    process.exit(1);
  }
}

// Run the lab if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runLab2();
}

export default runLab2;
