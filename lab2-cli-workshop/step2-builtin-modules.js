#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import os from 'os';
import util from 'util';

console.log('=== Step 2: Node.js Built-in Modules Demonstration ===\n');

// OS Module - System Information and Platform Detection
function demonstrateOSModule() {
  console.log('💻 Operating System Information:');
  console.log('Platform:', os.platform());
  console.log('Architecture:', os.arch());
  console.log('Release:', os.release());
  console.log('Hostname:', os.hostname());
  console.log('Home Directory:', os.homedir());
  console.log('Temp Directory:', os.tmpdir());
  
  // Memory information
  const totalMem = Math.round(os.totalmem() / 1024 / 1024 / 1024);
  const freeMem = Math.round(os.freemem() / 1024 / 1024);
  console.log(`Memory: ${freeMem}MB free of ${totalMem}GB total`);
  
  // CPU information
  const cpus = os.cpus();
  console.log(`CPU: ${cpus.length} cores, ${cpus[0].model}`);
  
  // Network interfaces
  const networks = os.networkInterfaces();
  console.log('Network Interfaces:', Object.keys(networks).join(', '));
  
  return { platform: os.platform(), arch: os.arch(), cpus: cpus.length };
}

// Path Module - Cross-platform File Path Operations
function demonstratePathModule() {
  console.log('\n📁 Path Module Operations:');
  
  // Cross-platform path construction
  const projectRoot = process.cwd();
  const dataDir = path.join(projectRoot, 'data');
  const configFile = path.join(dataDir, 'config.json');
  const backupDir = path.join(dataDir, 'backups', 'daily');
  
  console.log('Project Root:', projectRoot);
  console.log('Data Directory:', dataDir);
  console.log('Config File:', configFile);
  console.log('Backup Directory:', backupDir);
  
  // Path analysis
  console.log('\n🔍 Path Analysis:');
  console.log('Dirname:', path.dirname(configFile));
  console.log('Basename:', path.basename(configFile));
  console.log('Extension:', path.extname(configFile));
  console.log('Name without extension:', path.basename(configFile, '.json'));
  
  // Path utilities
  console.log('\n🛠️ Path Utilities:');
  console.log('Is Absolute:', path.isAbsolute(configFile));
  console.log('Relative to project:', path.relative(projectRoot, configFile));
  console.log('Normalized path:', path.normalize('./data/../data/./config.json'));
  
  // Platform-specific separators
  console.log('\nPlatform Info:');
  console.log('Path Separator:', path.sep);
  console.log('Delimiter:', path.delimiter);
  
  return { dataDir, configFile, backupDir };
}

// Util Module - Development Utilities and Object Inspection
function demonstrateUtilModule() {
  console.log('\n🔧 Util Module Utilities:');
  
  // Object inspection with custom formatting
  const complexObject = {
    project: 'File Manager CLI',
    version: '1.0.0',
    config: {
      maxFiles: 1000,
      allowedTypes: ['.txt', '.json', '.md'],
      features: {
        backup: true,
        encryption: false,
        compression: true
      }
    },
    metadata: {
      created: new Date(),
      lastModified: new Date(),
      size: 2048
    }
  };
  
  // Default inspection
  console.log('Default Object Inspection:');
  console.log(util.inspect(complexObject));
  
  // Custom inspection with colors and depth
  console.log('\nColored Inspection with Custom Depth:');
  console.log(util.inspect(complexObject, {
    colors: true,
    depth: 3,
    compact: false,
    sorted: true
  }));
  
  // Type checking utilities
  console.log('\n🔍 Type Checking:');
  console.log('Is Date:', util.types.isDate(complexObject.metadata.created));
  console.log('Is Array:', util.types.isArrayBuffer(complexObject.config.allowedTypes));
  console.log('Is Promise:', util.types.isPromise(Promise.resolve()));
  
  return complexObject;
}

// File System Module - Basic Operations
function demonstrateFSModule(paths) {
  console.log('\n📂 File System Operations:');
  
  // Check if directories exist
  console.log('Directory Status:');
  console.log('Data directory exists:', fs.existsSync(paths.dataDir));
  console.log('Backup directory exists:', fs.existsSync(paths.backupDir));
  
  // Create directories if they don't exist
  if (!fs.existsSync(paths.dataDir)) {
    fs.mkdirSync(paths.dataDir, { recursive: true });
    console.log('✅ Created data directory');
  }
  
  if (!fs.existsSync(paths.backupDir)) {
    fs.mkdirSync(paths.backupDir, { recursive: true });
    console.log('✅ Created backup directory');
  }
  
  // Write a sample configuration file
  const sampleConfig = {
    appName: 'File Manager CLI',
    version: '1.0.0',
    settings: {
      maxFileSize: '10MB',
      autoBackup: true,
      logLevel: 'info'
    },
    created: new Date().toISOString()
  };
  
  try {
    fs.writeFileSync(paths.configFile, JSON.stringify(sampleConfig, null, 2));
    console.log('✅ Created configuration file');
    
    // Read and verify the file
    const fileStats = fs.statSync(paths.configFile);
    console.log(`📊 Config file: ${fileStats.size} bytes, modified ${fileStats.mtime.toLocaleString()}`);
    
  } catch (error) {
    console.error('❌ Failed to create config file:', error.message);
  }
}

// Execute all demonstrations
const systemInfo = demonstrateOSModule();
const pathInfo = demonstratePathModule();
const utilDemo = demonstrateUtilModule();
demonstrateFSModule(pathInfo);

console.log('\n✅ Built-in modules demonstration completed!');
console.log(`Running on ${systemInfo.platform} with ${systemInfo.cpus} CPU cores`);
