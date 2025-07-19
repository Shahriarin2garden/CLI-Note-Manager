# Lab 2: Professional Node.js CLI Development
*Hands-On Implementation Workshop*

**📍 Navigation**: [← Main Guide](../EDUCATIONAL_GUIDE.md) | [← Lab 1](./LAB1.md) | [Advanced Theory →](../EDUCATIONAL_GUIDE_ADVANCED.md)

**🎯 Duration**: 90 minutes | **Lab File**: `labs/lab2.js` | **Prerequisites**: JavaScript fundamentals

## Workshop Overview

Build a production-ready CLI Note Manager demonstrating all Node.js fundamentals: package.json configuration, built-in modules (fs, path, os, util), file operations, and environment management. Each exercise implements concepts from the Advanced Guide.

**Learning Outcomes**: By completion, you'll have created a fully functional CLI application using professional Node.js patterns.

---

## Phase 1: Project Architecture Setup (15 min)

### Exercise 1.1: Initialize Professional Project Structure

**Objective**: Create package.json with dependency management and ES module configuration.

```bash
# Create lab workspace
mkdir lab2-cli-workshop
cd lab2-cli-workshop

# Initialize with professional settings
npm init -y
```

**Task**: Configure package.json for ES modules and CLI deployment:

```json
{
  "name": "lab2-note-cli",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "bin": { "lab2-notes": "./index.js" },
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "node test.js"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "dotenv": "^16.0.3"
  },
  "engines": { "node": ">=14.0.0" }
}
```

**Install dependencies and verify setup**:
```bash
npm install
echo "console.log('✓ Project initialized');" > index.js
node index.js
```

**Expected Output**: `✓ Project initialized`

---

## Phase 2: Built-in Modules Integration (25 min)

### Exercise 2.1: Basic Path and OS Operations

**Objective**: Learn fs, path, os, and util modules with simple examples.

**Create `step1-modules.js`**:
```javascript
import fs from 'fs';
import path from 'path';
import os from 'os';
import util from 'util';

console.log('=== Step 1: Built-in Modules Demo ===\n');

// OS Module - System Information
console.log('💻 System Info:');
console.log('Platform:', os.platform());
console.log('Home Directory:', os.homedir());
console.log('Free Memory:', Math.round(os.freemem() / 1024 / 1024), 'MB');
console.log('CPU Count:', os.cpus().length);

// Path Module - Cross-platform paths
console.log('\n📁 Path Operations:');
const dataDir = path.join(process.cwd(), 'data');
const configFile = path.join(dataDir, 'config.json');
console.log('Data Directory:', dataDir);
console.log('Config File:', configFile);
console.log('File Extension:', path.extname(configFile));

// FS Module - Check if directory exists
console.log('\n📂 File System:');
if (fs.existsSync(dataDir)) {
  console.log('✅ Data directory exists');
} else {
  console.log('❌ Data directory not found');
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
}

// Util Module - Pretty print objects
console.log('\n🔍 Util Demo:');
const sampleData = { name: 'Lab2', version: '1.0', features: ['fs', 'path', 'os'] };
console.log('Pretty Object:', util.inspect(sampleData, { colors: true }));
```

**Run it**:
```bash
node step1-modules.js
```

**Expected Output**:
```
=== Step 1: Built-in Modules Demo ===

💻 System Info:
Platform: win32
Home Directory: C:\Users\username
Free Memory: 8192 MB
CPU Count: 8

📁 Path Operations:
Data Directory: E:\path\to\project\data
Config File: E:\path\to\project\data\config.json
File Extension: .json

� File System:
❌ Data directory not found
✅ Created data directory

🔍 Util Demo:
Pretty Object: { name: 'Lab2', version: '1.0', features: [ 'fs', 'path', 'os' ] }
```

---

## Phase 3: File System Operations (30 min)

### Exercise 3.1: Basic File Operations

**Objective**: Learn to read, write, and manage files safely.

**Create `step2-files.js`**:
```javascript
import fs from 'fs';
import path from 'path';

console.log('=== Step 2: File Operations Demo ===\n');

// Ensure data directory exists
const dataDir = './data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Created data directory');
}

// Write a simple text file
const textFile = path.join(dataDir, 'sample.txt');
const textContent = 'Hello from Lab 2!\nThis is a sample file.';
fs.writeFileSync(textFile, textContent);
console.log('✅ Created sample.txt');

// Write a JSON config file
const configFile = path.join(dataDir, 'config.json');
const config = {
  appName: 'Lab2 CLI',
  version: '1.0.0',
  created: new Date().toISOString()
};
fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
console.log('✅ Created config.json');

// Read and display files
console.log('\n📖 Reading Files:');
const readText = fs.readFileSync(textFile, 'utf8');
console.log('Text file content:', readText);

const readConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
console.log('Config file:', readConfig);

// List all files in data directory
console.log('\n📂 Files in data directory:');
const files = fs.readdirSync(dataDir);
files.forEach(file => {
  const filePath = path.join(dataDir, file);
  const stats = fs.statSync(filePath);
  console.log(`  ${file} (${stats.size} bytes, ${stats.mtime.toLocaleString()})`);
});
```

**Run it**:
```bash
node step2-files.js
```

**Expected Output**:
```
=== Step 2: File Operations Demo ===

✅ Created data directory
✅ Created sample.txt
✅ Created config.json

📖 Reading Files:
Text file content: Hello from Lab 2!
This is a sample file.
Config file: {
  appName: 'Lab2 CLI',
  version: '1.0.0',
  created: '2024-07-18T10:30:00.000Z'
}

📂 Files in data directory:
  config.json (78 bytes, 7/18/2024, 10:30:00 AM)
  sample.txt (35 bytes, 7/18/2024, 10:30:00 AM)
```

### Exercise 3.2: Safe File Operations with Error Handling

**Create `step3-safe-files.js`**:
```javascript
import fs from 'fs';
import path from 'path';

console.log('=== Step 3: Safe File Operations ===\n');

// Safe file write function
function safeWriteFile(filePath, data) {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write file
    fs.writeFileSync(filePath, data);
    console.log(`✅ Wrote: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Write failed: ${error.message}`);
    return false;
  }
}

// Safe file read function
function safeReadFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return null;
    }
    
    const data = fs.readFileSync(filePath, 'utf8');
    console.log(`✅ Read: ${filePath}`);
    return data;
  } catch (error) {
    console.error(`❌ Read failed: ${error.message}`);
    return null;
  }
}

// Test safe operations
safeWriteFile('./data/notes.json', JSON.stringify([], null, 2));
safeWriteFile('./data/backup/notes-backup.json', JSON.stringify([], null, 2));

const notes = safeReadFile('./data/notes.json');
if (notes) {
  console.log('Notes content:', JSON.parse(notes));
}

// Try to read non-existent file
safeReadFile('./data/nonexistent.txt');
```

**Run it**:
```bash
node step3-safe-files.js
```

**Expected Output**:
```
=== Step 3: Safe File Operations ===

✅ Wrote: ./data/notes.json
✅ Wrote: ./data/backup/notes-backup.json
✅ Read: ./data/notes.json
Notes content: []
⚠️ File not found: ./data/nonexistent.txt
```

---

## Phase 4: Environment Configuration (20 min)

### Exercise 4.1: Working with Environment Variables

**Create `.env` file**:
```env
NODE_ENV=development
DEBUG=true
APP_NAME=Lab2CLI
MAX_NOTES=5
```

**Create `step4-environment.js`**:
```javascript
import dotenv from 'dotenv';
import path from 'path';
import os from 'os';

// Load environment variables
dotenv.config();

console.log('=== Step 4: Environment Configuration ===\n');

// Read environment variables
console.log('🌍 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
console.log('DEBUG:', process.env.DEBUG || 'not set');
console.log('APP_NAME:', process.env.APP_NAME || 'not set');
console.log('MAX_NOTES:', process.env.MAX_NOTES || 'not set');

// Simple config object
const config = {
  env: process.env.NODE_ENV || 'production',
  debug: process.env.DEBUG === 'true',
  appName: process.env.APP_NAME || 'Default App',
  maxNotes: parseInt(process.env.MAX_NOTES || '100'),
  dataPath: process.env.DATA_PATH || './data'
};

console.log('\n⚙️ Application Config:');
console.log(config);

// Platform-specific paths
function getDataPath() {
  if (config.env === 'development') {
    return './data';
  }
  
  const platform = os.platform();
  const home = os.homedir();
  
  switch (platform) {
    case 'win32':
      return path.join(home, 'AppData', 'Roaming', config.appName);
    case 'darwin':
      return path.join(home, 'Library', 'Application Support', config.appName);
    default:
      return path.join(home, '.config', config.appName.toLowerCase());
  }
}

console.log('\n📁 Data Paths:');
console.log('Platform:', os.platform());
console.log('Development path:', './data');
console.log('Production path:', getDataPath());
console.log('Selected path:', config.env === 'development' ? './data' : getDataPath());
```

**Run it**:
```bash
node step4-environment.js
```

**Expected Output**:
```
=== Step 4: Environment Configuration ===

🌍 Environment Variables:
NODE_ENV: development
DEBUG: true
APP_NAME: Lab2CLI
MAX_NOTES: 5

⚙️ Application Config:
{
  env: 'development',
  debug: true,
  appName: 'Lab2CLI',
  maxNotes: 5,
  dataPath: './data'
}

📁 Data Paths:
Platform: win32
Development path: ./data
Production path: C:\Users\username\AppData\Roaming\Lab2CLI
Selected path: ./data
```

---

## Phase 5: Simple CLI Implementation

### Exercise 5.1: Basic CLI Structure

**Update `index.js`**:
```javascript
#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment
dotenv.config();

console.log(chalk.blue('🚀 Lab 2: Simple Node.js CLI\n'));

// Simple configuration
const config = {
  dataDir: './data',
  notesFile: './data/notes.json',
  maxNotes: parseInt(process.env.MAX_NOTES || '10')
};

// Ensure data directory exists
if (!fs.existsSync(config.dataDir)) {
  fs.mkdirSync(config.dataDir, { recursive: true });
}

// Helper functions
function loadNotes() {
  try {
    if (!fs.existsSync(config.notesFile)) {
      return [];
    }
    const data = fs.readFileSync(config.notesFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(chalk.red('Error loading notes:', error.message));
    return [];
  }
}

function saveNotes(notes) {
  try {
    fs.writeFileSync(config.notesFile, JSON.stringify(notes, null, 2));
    return true;
  } catch (error) {
    console.error(chalk.red('Error saving notes:', error.message));
    return false;
  }
}

// CLI Commands
function addNote(title) {
  if (!title || title.trim() === '') {
    console.error(chalk.red('❌ Please provide a note title'));
    return;
  }

  const notes = loadNotes();
  
  if (notes.length >= config.maxNotes) {
    console.error(chalk.red(`❌ Maximum ${config.maxNotes} notes allowed`));
    return;
  }

  const newNote = {
    id: Date.now(),
    title: title.trim(),
    created: new Date().toISOString()
  };

  notes.push(newNote);
  
  if (saveNotes(notes)) {
    console.log(chalk.green('✅ Note added successfully!'));
    console.log(chalk.blue(`   ID: ${newNote.id}`));
    console.log(chalk.blue(`   Title: ${newNote.title}`));
  }
}

function listNotes() {
  const notes = loadNotes();
  
  if (notes.length === 0) {
    console.log(chalk.yellow('📝 No notes found'));
    return;
  }

  console.log(chalk.blue(`📚 Found ${notes.length} notes:\n`));
  notes.forEach(note => {
    console.log(chalk.green(`[${note.id}]`) + ` ${note.title}`);
    console.log(chalk.gray(`   Created: ${new Date(note.created).toLocaleString()}\n`));
  });
}

function removeNote(id) {
  const noteId = parseInt(id);
  if (!noteId) {
    console.error(chalk.red('❌ Please provide a valid note ID'));
    return;
  }

  const notes = loadNotes();
  const initialLength = notes.length;
  const filteredNotes = notes.filter(note => note.id !== noteId);

  if (filteredNotes.length === initialLength) {
    console.error(chalk.red(`❌ Note with ID ${noteId} not found`));
    return;
  }

  if (saveNotes(filteredNotes)) {
    console.log(chalk.green(`✅ Note ${noteId} removed successfully`));
  }
}

function showHelp() {
  console.log(chalk.blue('📖 Available Commands:\n'));
  console.log(chalk.green('  add <title>     ') + '- Add a new note');
  console.log(chalk.green('  list            ') + '- List all notes');
  console.log(chalk.green('  remove <id>     ') + '- Remove a note by ID');
  console.log(chalk.green('  help            ') + '- Show this help');
  
  console.log(chalk.yellow('\n� Examples:'));
  console.log('  node index.js add "My first note"');
  console.log('  node index.js list');
  console.log('  node index.js remove 1642591234567');
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const params = args.slice(1);

// Handle commands
switch (command) {
  case 'add':
    addNote(params.join(' '));
    break;
  case 'list':
    listNotes();
    break;
  case 'remove':
    removeNote(params[0]);
    break;
  case 'help':
  default:
    showHelp();
}
```

### Exercise 5.2: Test the Complete CLI

**Run these commands to test your CLI**:

```bash
# Show help
node index.js

# Add some notes
node index.js add "Learn Node.js modules"
node index.js add "Build a CLI application"
node index.js add "Master file operations"

# List all notes
node index.js list

# Remove a note (use ID from list command)
node index.js remove 1234567890

# List again to see the change
node index.js list
```

**Expected Output**:
```
🚀 Lab 2: Simple Node.js CLI

📖 Available Commands:

  add <title>     - Add a new note
  list            - List all notes
  remove <id>     - Remove a note by ID
  help            - Show this help

� Examples:
  node index.js add "My first note"
  node index.js list
  node index.js remove 1642591234567

> node index.js add "Learn Node.js modules"
✅ Note added successfully!
   ID: 1642591234567
   Title: Learn Node.js modules

> node index.js list
📚 Found 3 notes:

[1642591234567] Learn Node.js modules
   Created: 1/19/2024, 10:30:00 AM

[1642591234568] Build a CLI application
   Created: 1/19/2024, 10:30:15 AM

[1642591234569] Master file operations
   Created: 1/19/2024, 10:30:30 AM

> node index.js remove 1642591234567
✅ Note 1642591234567 removed successfully
```

---

## Workshop Completion & Testing

### Final Integration Test

**Run all the step files to see the complete progression**:

```bash
# Step 1: Built-in modules
node step1-modules.js

# Step 2: File operations
node step2-files.js

# Step 3: Safe file operations
node step3-safe-files.js

# Step 4: Environment configuration
node step4-environment.js

# Final CLI test
node index.js add "Workshop Complete!"
node index.js add "Node.js Mastery!"
node index.js list
```

### Complete Workshop Output

**When you run all steps, you'll see**:

```
=== Step 1: Built-in Modules Demo ===

💻 System Info:
Platform: win32
Home Directory: C:\Users\username
Free Memory: 8192 MB
CPU Count: 8

📁 Path Operations:
Data Directory: E:\path\to\project\data
Config File: E:\path\to\project\data\config.json
File Extension: .json

📂 File System:
✅ Created data directory

🔍 Util Demo:
Pretty Object: { name: 'Lab2', version: '1.0', features: [ 'fs', 'path', 'os' ] }

=== Step 2: File Operations Demo ===

✅ Created sample.txt
✅ Created config.json

📖 Reading Files:
Text file content: Hello from Lab 2!
This is a sample file.
Config file: {
  appName: 'Lab2 CLI',
  version: '1.0.0',
  created: '2024-07-18T10:30:00.000Z'
}

📂 Files in data directory:
  config.json (78 bytes, 7/18/2024, 10:30:00 AM)
  sample.txt (35 bytes, 7/18/2024, 10:30:00 AM)

=== Step 3: Safe File Operations ===

✅ Wrote: ./data/notes.json
✅ Wrote: ./data/backup/notes-backup.json
✅ Read: ./data/notes.json
Notes content: []
⚠️ File not found: ./data/nonexistent.txt

=== Step 4: Environment Configuration ===

🌍 Environment Variables:
NODE_ENV: development
DEBUG: true
APP_NAME: Lab2CLI
MAX_NOTES: 5

⚙️ Application Config:
{
  env: 'development',
  debug: true,
  appName: 'Lab2CLI',
  maxNotes: 5,
  dataPath: './data'
}

� Data Paths:
Platform: win32
Development path: ./data
Production path: C:\Users\username\AppData\Roaming\Lab2CLI
Selected path: ./data

🚀 Lab 2: Simple Node.js CLI

✅ Note added successfully!
   ID: 1642591234567
   Title: Workshop Complete!

📚 Found 2 notes:

[1642591234567] Workshop Complete!
   Created: 1/19/2024, 10:30:00 AM

[1642591234568] Node.js Mastery!
   Created: 1/19/2024, 10:30:15 AM
```

---

## Mastery Assessment

**✅ Skills You've Learned**:
- **Package.json Setup**: Created professional Node.js project configuration
- **Built-in Modules**: Used fs, path, os, util for system operations
- **File Operations**: Safe reading, writing, and JSON handling
- **Environment Config**: Loaded settings from .env files and environment variables
- **CLI Development**: Built a working command-line application with error handling

**🎯 Files You Created**:
1. `package.json` - Project configuration
2. `.env` - Environment variables
3. `step1-modules.js` - Built-in modules demo
4. `step2-files.js` - File operations demo
5. `step3-safe-files.js` - Error handling demo
6. `step4-environment.js` - Environment config demo
7. `index.js` - Complete CLI application

**� Real-World Skills**: You now understand how to build Node.js applications that work across different platforms and environments.

## Next Steps
- **[Advanced Theory](../EDUCATIONAL_GUIDE_ADVANCED.md)** - Understand the concepts behind your code
- **Lab 3**: Asynchronous Programming & Promises
- **Lab 4**: Testing & Deployment

**� Congratulations!** You've successfully completed Lab 2 and built a functional CLI application using core Node.js concepts.
