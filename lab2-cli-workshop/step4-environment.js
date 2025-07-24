#!/usr/bin/env node

import dotenv from 'dotenv';
import path from 'path';
import os from 'os';
import fs from 'fs';

// Load environment variables from .env file
dotenv.config();

console.log('=== Step 4: Environment Variables & Configuration Management ===\n');

// Environment Configuration Manager
class EnvironmentConfig {
  constructor() {
    this.loadEnvironmentVariables();
    this.validateConfiguration();
    this.setPlatformSpecificPaths();
  }

  // Load and process environment variables
  loadEnvironmentVariables() {
    console.log('🌍 Loading Environment Variables:');
    
    // Core application settings
    this.nodeEnv = process.env.NODE_ENV || 'production';
    this.debug = process.env.DEBUG === 'true';
    this.appName = process.env.APP_NAME || 'DefaultApp';
    this.appVersion = process.env.APP_VERSION || '1.0.0';
    
    // File system settings
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '1048576'); // 1MB default
    this.maxNotes = parseInt(process.env.MAX_NOTES || '100');
    this.autoBackup = process.env.AUTO_BACKUP === 'true';
    this.backupInterval = parseInt(process.env.BACKUP_INTERVAL || '24');
    
    // Path settings
    this.dataPath = process.env.DATA_PATH || './data';
    this.backupPath = process.env.BACKUP_PATH || './data/backups';
    this.logPath = process.env.LOG_PATH || './logs';
    
    // Security settings
    this.encryptionEnabled = process.env.ENCRYPTION_ENABLED === 'true';
    this.logLevel = process.env.LOG_LEVEL || 'info';
    
    console.log('  ✅ Environment variables loaded');
    this.displayConfiguration();
  }

  // Display current configuration
  displayConfiguration() {
    console.log('\n⚙️ Current Configuration:');
    console.log(`  Environment: ${this.nodeEnv}`);
    console.log(`  Debug Mode: ${this.debug}`);
    console.log(`  App Name: ${this.appName}`);
    console.log(`  App Version: ${this.appVersion}`);
    console.log(`  Max File Size: ${this.formatBytes(this.maxFileSize)}`);
    console.log(`  Max Notes: ${this.maxNotes}`);
    console.log(`  Auto Backup: ${this.autoBackup}`);
    console.log(`  Backup Interval: ${this.backupInterval} hours`);
    console.log(`  Log Level: ${this.logLevel}`);
    console.log(`  Encryption: ${this.encryptionEnabled ? 'Enabled' : 'Disabled'}`);
  }

  // Validate configuration values
  validateConfiguration() {
    console.log('\n🔍 Validating Configuration:');
    
    const validations = [
      {
        check: this.maxFileSize > 0 && this.maxFileSize <= 100 * 1024 * 1024, // Max 100MB
        message: 'File size limit must be between 1 byte and 100MB'
      },
      {
        check: this.maxNotes > 0 && this.maxNotes <= 10000,
        message: 'Max notes must be between 1 and 10,000'
      },
      {
        check: this.backupInterval >= 1 && this.backupInterval <= 168, // Max 1 week
        message: 'Backup interval must be between 1 and 168 hours'
      },
      {
        check: ['development', 'staging', 'production'].includes(this.nodeEnv),
        message: 'NODE_ENV must be development, staging, or production'
      },
      {
        check: ['debug', 'info', 'warn', 'error'].includes(this.logLevel),
        message: 'LOG_LEVEL must be debug, info, warn, or error'
      }
    ];

    let allValid = true;
    validations.forEach((validation, index) => {
      if (validation.check) {
        console.log(`  ✅ Validation ${index + 1}: Passed`);
      } else {
        console.error(`  ❌ Validation ${index + 1}: ${validation.message}`);
        allValid = false;
      }
    });

    if (allValid) {
      console.log('  🎉 All validations passed!');
    } else {
      throw new Error('Configuration validation failed');
    }
  }

  // Set platform-specific paths
  setPlatformSpecificPaths() {
    console.log('\n🖥️ Platform-Specific Configuration:');
    
    const platform = os.platform();
    const home = os.homedir();
    
    console.log(`  Platform: ${platform}`);
    console.log(`  Architecture: ${os.arch()}`);
    console.log(`  Home Directory: ${home}`);
    
    // Platform-specific application data paths
    let appDataPath, configPath, cachePath;
    
    switch (platform) {
      case 'win32':
        appDataPath = path.join(home, 'AppData', 'Roaming', this.appName);
        configPath = path.join(home, 'AppData', 'Local', this.appName);
        cachePath = path.join(home, 'AppData', 'Local', this.appName, 'Cache');
        break;
        
      case 'darwin':
        appDataPath = path.join(home, 'Library', 'Application Support', this.appName);
        configPath = path.join(home, 'Library', 'Preferences', this.appName);
        cachePath = path.join(home, 'Library', 'Caches', this.appName);
        break;
        
      default: // Linux and other Unix-like systems
        appDataPath = path.join(home, '.local', 'share', this.appName.toLowerCase());
        configPath = path.join(home, '.config', this.appName.toLowerCase());
        cachePath = path.join(home, '.cache', this.appName.toLowerCase());
        break;
    }
    
    // Use development paths or production paths based on environment
    if (this.nodeEnv === 'development') {
      this.productionDataPath = this.dataPath;
      this.productionBackupPath = this.backupPath;
      this.productionLogPath = this.logPath;
    } else {
      this.productionDataPath = appDataPath;
      this.productionBackupPath = path.join(appDataPath, 'backups');
      this.productionLogPath = path.join(appDataPath, 'logs');
    }
    
    console.log('\n📁 Calculated Paths:');
    console.log(`  Data Path: ${this.getDataPath()}`);
    console.log(`  Backup Path: ${this.getBackupPath()}`);
    console.log(`  Log Path: ${this.getLogPath()}`);
    console.log(`  Config Path: ${configPath}`);
    console.log(`  Cache Path: ${cachePath}`);
    
    // Store platform-specific paths
    this.platformPaths = {
      appData: appDataPath,
      config: configPath,
      cache: cachePath
    };
  }

  // Get appropriate data path based on environment
  getDataPath() {
    return this.nodeEnv === 'development' ? this.dataPath : this.productionDataPath;
  }

  getBackupPath() {
    return this.nodeEnv === 'development' ? this.backupPath : this.productionBackupPath;
  }

  getLogPath() {
    return this.nodeEnv === 'development' ? this.logPath : this.productionLogPath;
  }

  // Create necessary directories
  async initializeDirectories() {
    console.log('\n📂 Initializing Application Directories:');
    
    const directories = [
      this.getDataPath(),
      this.getBackupPath(),
      this.getLogPath(),
      path.join(this.getBackupPath(), 'daily'),
      path.join(this.getBackupPath(), 'weekly'),
      path.join(this.getLogPath(), 'archive')
    ];

    for (const dir of directories) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
          console.log(`  ✅ Created: ${dir}`);
        } else {
          console.log(`  📁 Exists: ${dir}`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to create ${dir}:`, error.message);
      }
    }
  }

  // Generate configuration file based on environment
  async generateConfigFile() {
    console.log('\n📝 Generating Configuration File:');
    
    const configData = {
      application: {
        name: this.appName,
        version: this.appVersion,
        environment: this.nodeEnv,
        debug: this.debug
      },
      limits: {
        maxFileSize: this.maxFileSize,
        maxNotes: this.maxNotes
      },
      backup: {
        enabled: this.autoBackup,
        intervalHours: this.backupInterval
      },
      paths: {
        data: this.getDataPath(),
        backup: this.getBackupPath(),
        logs: this.getLogPath()
      },
      security: {
        encryption: this.encryptionEnabled,
        logLevel: this.logLevel
      },
      platform: {
        os: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        appDataPath: this.platformPaths.appData
      },
      generated: new Date().toISOString()
    };

    const configPath = path.join(this.getDataPath(), 'app-config.json');
    
    try {
      await fs.promises.writeFile(
        configPath, 
        JSON.stringify(configData, null, 2),
        'utf8'
      );
      console.log(`  ✅ Configuration file created: ${configPath}`);
      
      // Display configuration summary
      console.log('\n📋 Configuration Summary:');
      console.log(`  Environment: ${configData.application.environment}`);
      console.log(`  Data Location: ${configData.paths.data}`);
      console.log(`  Backup Enabled: ${configData.backup.enabled}`);
      console.log(`  Platform: ${configData.platform.os} (${configData.platform.arch})`);
      
      return configData;
    } catch (error) {
      console.error('  ❌ Failed to create config file:', error.message);
      throw error;
    }
  }

  // Utility function to format bytes
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Export configuration for other modules
  exportConfig() {
    return {
      nodeEnv: this.nodeEnv,
      debug: this.debug,
      appName: this.appName,
      paths: {
        data: this.getDataPath(),
        backup: this.getBackupPath(),
        logs: this.getLogPath()
      },
      limits: {
        maxFileSize: this.maxFileSize,
        maxNotes: this.maxNotes
      },
      backup: {
        enabled: this.autoBackup,
        interval: this.backupInterval
      }
    };
  }
}

// Demonstrate environment configuration
async function demonstrateEnvironmentConfig() {
  try {
    console.log('🚀 Initializing Environment Configuration System...\n');
    
    const envConfig = new EnvironmentConfig();
    
    await envConfig.initializeDirectories();
    await envConfig.generateConfigFile();
    
    const exportedConfig = envConfig.exportConfig();
    console.log('\n📤 Exported Configuration for Application Use:');
    console.log(JSON.stringify(exportedConfig, null, 2));
    
    console.log('\n✅ Environment configuration demonstration completed!');
    
  } catch (error) {
    console.error('❌ Environment configuration failed:', error.message);
  }
}

// Run the demonstration
await demonstrateEnvironmentConfig();
