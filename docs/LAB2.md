# Lab 2: Node.js Core Modules & File System Operations

**📍 Navigation**: [← Main Guide](../EDUCATIONAL_GUIDE.md) | [← Lab 1](./LAB1_FUNDAMENTALS.md) | [Advanced Guide →](../EDUCATIONAL_GUIDE_ADVANCED.md)

**🎯 Lab Files**: `labs/lab2.js` (if available) | Related: `utils/fileHandler.js` | `utils/advancedFileHandler.js`

## Learning Objectives

### Node.js Project Structure
- **package.json**: Project configuration and dependencies
- **npm basics**: Installing packages and managing dependencies
- **ES Modules**: Modern module system (import/export)
- **Environment Setup**: Configuration and best practices

### Core Modules
- **fs (File System)**: Reading, writing, and managing files
- **path**: Working with file paths across operating systems
- **os**: Operating system information and utilities
- **util**: Utility functions for development

### File System Operations
- **Reading Files**: Synchronous and asynchronous file reading
- **Writing Files**: Creating and updating files
- **Directory Operations**: Creating, listing, and managing directories
- **JSON Handling**: Working with configuration files

### Environment & Configuration
- **Environment Variables**: Using process.env and .env files
- **Cross-Platform Paths**: Handling Windows/Mac/Linux differences
- **Configuration Management**: Structured app configuration

## Practical Tasks

### [✓] Task 1: Create a Node.js Project
```bash
# Initialize new project
npm init -y

# Install dependencies
npm install chalk dotenv

# Set up ES modules
# Add "type": "module" to package.json
```

### [✓] Task 2: Build a File Manager CLI Tool
```javascript
// Basic file operations
import fs from 'fs';
import path from 'path';

const fileManager = {
    createFile: (filename, content) => {
        fs.writeFileSync(filename, content);
        console.log(`Created: ${filename}`);
    },
    
    readFile: (filename) => {
        const content = fs.readFileSync(filename, 'utf8');
        console.log(`Content: ${content}`);
        return content;
    },
    
    listFiles: (directory = '.') => {
        const files = fs.readdirSync(directory);
        console.log('Files:', files);
        return files;
    }
};
```

### [✓] Task 3: JSON Configuration Management
```javascript
// config.json
{
    "appName": "File Manager",
    "version": "1.0.0",
    "dataDirectory": "./data",
    "logLevel": "info"
}

// config-manager.js
import fs from 'fs';
import path from 'path';

export class ConfigManager {
    constructor(configPath = './config.json') {
        this.configPath = configPath;
        this.config = this.loadConfig();
    }
    
    loadConfig() {
        try {
            const data = fs.readFileSync(this.configPath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.log('Config file not found, creating default...');
            return this.createDefaultConfig();
        }
    }
    
    saveConfig() {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    }
}
```

### [✓] Task 4: Cross-Platform Path Handling
```javascript
import path from 'path';
import os from 'os';

// Safe path operations
const dataDir = path.join(process.cwd(), 'data');
const configFile = path.join(dataDir, 'config.json');
const logFile = path.join(os.homedir(), 'app.log');

// Platform-specific operations
console.log('Platform:', os.platform());
console.log('Home Directory:', os.homedir());
console.log('Data Directory:', dataDir);
```

## Quick Start

```bash
# Run the complete Lab 2 course
npm start lab2

# Or run directly
node labs/lab2.js
```

## Core Concepts

### 1. File System Module (fs)
```javascript
import fs from 'fs';

// Synchronous operations (blocking)
const content = fs.readFileSync('file.txt', 'utf8');
fs.writeFileSync('output.txt', 'Hello World');

// Asynchronous operations (non-blocking)
fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
});

// Promise-based (modern approach)
import { readFile, writeFile } from 'fs/promises';
const data = await readFile('file.txt', 'utf8');
await writeFile('output.txt', 'Hello World');
```

### 2. Path Module
```javascript
import path from 'path';

// Cross-platform path operations
const fullPath = path.join('/users', 'john', 'documents', 'file.txt');
const fileName = path.basename(fullPath); // 'file.txt'
const dirName = path.dirname(fullPath);   // '/users/john/documents'
const extension = path.extname(fullPath); // '.txt'
```

### 3. Environment Variables
```javascript
// .env file
NODE_ENV=development
DATA_PATH=./data
LOG_LEVEL=debug

// Using in code
import dotenv from 'dotenv';
dotenv.config();

const environment = process.env.NODE_ENV || 'production';
const dataPath = process.env.DATA_PATH || './default-data';
```

## Expected Output

When you run `npm start lab2`, you should see:

```
Lab 2: Node.js Core Modules & File System Operations

=== Project Setup ===
[✓] package.json configured
[✓] ES modules enabled
[✓] Dependencies installed

=== File System Operations ===
Creating test files...
[✓] Created: data/sample.txt
[✓] Created: data/config.json
Reading files...
[INFO] sample.txt content: "This is a sample file for Lab 2"
[INFO] config.json content: {"name": "File Manager", "version": "1.0.0"}

=== Directory Operations ===
[DIR] Current directory: /path/to/project
[DIR] Files in data/: ["sample.txt", "config.json"]
[DIR] Creating subdirectory: data/backups
[✓] Directory created successfully

=== Cross-Platform Path Handling ===
[SYSTEM] Platform: win32
[SYSTEM] Home directory: C:\Users\username
[PATH] Data path: C:\path\to\project\data
[PATH] Config path: C:\path\to\project\data\config.json
```

## Practical Examples

### File Manager CLI
```javascript
// file-manager.js
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

class FileManager {
    constructor(baseDir = './data') {
        this.baseDir = baseDir;
        this.ensureDirectory();
    }
    
    async ensureDirectory() {
        try {
            await fs.mkdir(this.baseDir, { recursive: true });
        } catch (error) {
            // Directory already exists
        }
    }
    
    async createFile(filename, content) {
        const filePath = path.join(this.baseDir, filename);
        await fs.writeFile(filePath, content);
        console.log(chalk.green(`[✓] Created: ${filename}`));
    }
    
    async readFile(filename) {
        const filePath = path.join(this.baseDir, filename);
        const content = await fs.readFile(filePath, 'utf8');
        console.log(chalk.blue(`[INFO] ${filename}:`), content);
        return content;
    }
    
    async listFiles() {
        const files = await fs.readdir(this.baseDir);
        console.log(chalk.yellow('[FILES]'), files);
        return files;
    }
    
    async deleteFile(filename) {
        const filePath = path.join(this.baseDir, filename);
        await fs.unlink(filePath);
        console.log(chalk.red(`[DELETED] ${filename}`));
    }
}

// Usage
const manager = new FileManager();
await manager.createFile('notes.txt', 'My first note');
await manager.listFiles();
await manager.readFile('notes.txt');
```

### Environment Configuration
```javascript
// config.js
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
    app: {
        name: process.env.APP_NAME || 'File Manager',
        version: process.env.APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
    },
    
    paths: {
        data: process.env.DATA_PATH || './data',
        logs: process.env.LOG_PATH || './logs',
        config: process.env.CONFIG_PATH || './config'
    },
    
    features: {
        enableLogging: process.env.ENABLE_LOGGING === 'true',
        enableBackups: process.env.ENABLE_BACKUPS === 'true'
    }
};
```

## Key Concepts Explained

### Synchronous vs Asynchronous
- **Synchronous**: Blocks execution until complete (not recommended for I/O)
- **Asynchronous**: Non-blocking, allows other operations to continue
- **Promises**: Modern way to handle async operations

### Path Handling
- Always use `path.join()` for cross-platform compatibility
- Avoid hardcoded path separators (`/` or `\`)
- Use `__dirname` and `__filename` equivalents in ES modules

### Environment Variables
- Never hardcode sensitive information
- Use `.env` files for development configuration
- Environment variables override default values

## Next Steps

After completing Lab 2, you'll be ready for:
- **[Advanced Guide](../EDUCATIONAL_GUIDE_ADVANCED.md)**: Async patterns, CLI development, AI integration
- **Lab 3**: Asynchronous Programming & Promises
- **Lab 4**: Building CLI Applications
- **Lab 5**: Error Handling & Debugging

**Continue Your Journey**:
1. Review [Advanced Concepts](../EDUCATIONAL_GUIDE_ADVANCED.md)
2. Explore real implementations in `utils/fileHandler.js`
3. Check your progress with [Educational Requirements](../EDUCATIONAL_REQUIREMENTS.md)

## Practice Exercises

1. **Create a Note Manager**: Build a simple CLI that creates, reads, and lists text files
2. **Configuration System**: Implement a config manager with environment overrides
3. **File Backup Tool**: Create a utility that backs up important files
4. **Cross-Platform Installer**: Build a script that works on Windows, Mac, and Linux

## Troubleshooting

**Common Issues:**
- Permission errors: Check file/directory permissions
- Path not found: Verify file paths are correct
- Module errors: Ensure ES modules are properly configured

**Debug Tips:**
```javascript
// Check if file exists
import fs from 'fs';
if (fs.existsSync('myfile.txt')) {
    console.log('File exists');
}

// Handle errors gracefully
try {
    const content = await fs.readFile('nonexistent.txt', 'utf8');
} catch (error) {
    console.error('Error reading file:', error.message);
}
```
