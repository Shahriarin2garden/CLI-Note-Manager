# CLI Note Manager + Lab 1 Exercises

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ES Modules](https://img.shields.io/badge/ES-Modules-blue)](https://nodejs.org/api/esm.html)

A comprehensive Node.js command-line application for managing notes with integrated JavaScript fundamentals exercises. This project demonstrates modern JavaScript concepts, Node.js best practices, and CLI application development.

## Features

### Core CLI Commands
- **Add Notes**: Create new notes with title and body content, automatic timestamping
- **List Notes**: Display all saved notes with creation/modification dates
- **Read Notes**: View full content of a specific note with formatted output
- **Remove Notes**: Delete notes by title with confirmation feedback
- **Search Notes**: Find notes by keyword in title or body with highlighted results

### Lab 1 Integration
- **Closures & Higher-order Functions**: Interactive demonstrations with practical examples
- **Node.js Basics**: Environment information, process details, and REPL exploration
- **Function Composition**: Practical examples with note processing pipelines
- **Factory Patterns**: Specialized function creation using closures and lexical scope
- **Input Validation**: Dynamic validator creation with configurable rules

## Installation

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Comes bundled with Node.js
- **Terminal/Command Prompt**: PowerShell (Windows), Terminal (macOS/Linux)

### Quick Start

1. **Clone or Download**
   ```bash
   # If you have the project files
   cd cli-note-manager
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   
   This will install:
   - `chalk@^5.3.0` - Terminal colors and styling
   - `dotenv@^16.3.1` - Environment variable management

3. **Environment Setup**
   - The `.env` file is pre-configured with sensible defaults
   - Default notes storage: `./data/notes.json`
   - **Optional**: Modify `NOTES_FILE_PATH` in `.env` to customize storage location

4. **Verify Installation**
   ```bash
   npm start
   ```

### Development Setup

If you want to contribute or modify the project:

```bash
# Install dependencies
npm install

# Run the application
npm start

# Run Lab 1 exercises
npm run lab1

# View project structure
tree /f  # Windows
# or
find . -type f -name "*.js" -o -name "*.json" -o -name "*.md"  # Unix/Linux
```

## Usage

### Available Commands

```bash
# Display help and available commands
npm start

# Add a new note
npm start add "Meeting Notes" "Discussed project timeline and budget allocation"

# List all notes
npm start list

# Read a specific note
npm start read "Meeting Notes"

# Remove a note
npm start remove "Meeting Notes"

# Search for notes containing a keyword
npm start search "budget"

# Run Lab 1 JavaScript fundamentals demonstrations
npm run lab1
```

### Command Examples

### Command Examples

#### Adding Notes
```bash
$ npm start add "Shopping List" "Buy milk, eggs, bread, and coffee for the week"
✓ Note "Shopping List" added successfully!

$ npm start add "Code Review" "Review the authentication module and API endpoints"
✓ Note "Code Review" added successfully!

# Error handling - duplicate title
$ npm start add "Shopping List" "Another shopping list"
Note with title "Shopping List" already exists!

# Missing arguments
$ npm start add "Just Title"
Error: Please provide both title and body
Usage: npm start add <title> <body>
```

#### Listing and Reading Notes
```bash
$ npm start list
Found 2 note(s):

1. Shopping List
   Created: 7/3/2025

2. Code Review
   Created: 7/3/2025

$ npm start read "Code Review"
==================================================
Title: Code Review
==================================================
Review the authentication module and API endpoints
==================================================
Created: 7/3/2025, 1:14:29 AM
Updated: 7/3/2025, 1:14:29 AM
==================================================

# Error handling - note not found
$ npm start read "Non-existent Note"
Note "Non-existent Note" not found!
Use "npm start list" to see available notes.
```

#### Searching and Filtering
```bash
$ npm start search "JavaScript"
Found 1 note(s) containing "JavaScript":

1. Book Ideas
   Write about JavaScript closures and their practical applications
   Created: 7/3/2025

Use "npm start read <title>" to view the full note.

# Search with no results
$ npm start search "Python"
No notes found containing "Python"
Try a different search term or use "npm start list" to see all notes.

# Case-insensitive search example
$ npm start search "javascript"
Found 2 note(s) containing "javascript":

1. Book Ideas
   Write about JavaScript closures and their practical applications
   Created: 7/3/2025

2. Learning Notes
   Today I learned about JavaScript async/await patterns
   Created: 7/2/2025
```

#### Removing Notes
```bash
$ npm start remove "Shopping List"
✓ Note "Shopping List" removed successfully!

# Error handling - note not found
$ npm start remove "Non-existent Note"
Note "Non-existent Note" not found!
Use "npm start list" to see available notes.
```

#### Lab Exercises
```bash
$ npm run lab1
> cli-note-manager@1.0.0 lab1
> node labs/lab1.js

Lab 1: JavaScript Fundamentals & Node.js Basics

=== Node.js Environment Information ===
Node.js Version: v22.13.1
Platform: win32
Architecture: x64
Process ID: 21436
💡 Tip: You can explore the Node.js REPL by running "node" in your terminal

=== Closures & Higher-Order Functions ===

🔄 Testing command parsers with closures:
📝 NOTE: add
   Args: Shopping List, Buy groceries for dinner
   Timestamp: 2025-07-02T19:14:21.701Z
📝 TASK: create
   Args: Lab Assignment, Complete JavaScript exercises
   Timestamp: 2025-07-02T19:14:21.703Z

📊 Testing higher-order function with logging:
🔍 Calling function: calculateSum
   Arguments: [15, 27]
✅ Function completed successfully in 1ms
Sum result: 42

=== Advanced Closure Example: Counter Factory ===
🔢 Testing counter factories:
Note counter: 1 → 2 → 2
Priority counter: 110 → 120 → 120
After reset - Note counter: 0

🎉 Lab 1 exercises completed successfully!
```

#### Help System
```bash
$ npm start
CLI Note Manager

Usage:
  npm start add <title> <body>     - Add a new note
  npm start list                   - List all notes
  npm start read <title>           - Read a specific note
  npm start remove <title>         - Remove a note
  npm start search <term>          - Search notes by keyword

Lab Exercises:
  npm run lab1                     - Run Lab 1 exercises

# Invalid command
$ npm start invalid-command
Unknown command: invalid-command
Run without arguments to see available commands
```

### Search Features

The search function supports:
- **Case-insensitive** matching
- **Partial word** matching
- **Title and body** content search
- **Highlighted results** in terminal output
- **Preview snippets** with context

Example search results:
```bash
$ npm start search "javascript"

Found 2 note(s) containing "javascript":

1. Book Ideas
   Write about JavaScript closures and their practical applications
   Created: 7/3/2025

2. Learning Notes
   Today I learned about JavaScript async/await patterns
   Created: 7/2/2025
```

## Project Structure

```
cli-note-manager/
├── commands/                       # Command implementations
│   ├── add.js                     # Add note functionality
│   ├── list.js                    # List notes functionality
│   ├── read.js                    # Read note functionality
│   ├── remove.js                  # Remove note functionality
│   └── search.js                  # Search notes functionality
├── utils/                         # Utility functions
│   └── fileHandler.js             # File I/O operations with fs/promises
├── labs/                          # Lab exercises
│   └── lab1.js                    # JavaScript fundamentals demo
├── data/                          # Data storage (auto-created)
│   └── notes.json                 # Notes data file (JSON format)
├── .vscode/                       # VS Code configuration
│   └── tasks.json                 # VS Code tasks
├── .env                           # Environment configuration
├── .gitignore                     # Git ignore patterns
├── package.json                   # Project configuration and dependencies
├── index.js                       # Main CLI entry point
└── README.md                      # This documentation file
```

### File Descriptions

| File | Purpose | Key Features |
|------|---------|--------------|
| `index.js` | Main entry point | CLI argument parsing, command routing, help system |
| `commands/*.js` | Command modules | Individual command implementations with async/await |
| `utils/fileHandler.js` | File operations | JSON read/write, note searching, data validation |
| `labs/lab1.js` | Lab exercises | Closures, higher-order functions, Node.js demos |
| `package.json` | Project config | Dependencies, scripts, ES module configuration |
| `.env` | Environment | Configurable file paths and settings |

## Technical Architecture

### Core Technologies
- **Node.js**: Runtime environment (v18+)
- **ES Modules**: Modern `import`/`export` syntax
- **Async/Await**: Promise-based asynchronous programming
- **JSON**: Simple, human-readable data persistence
- **dotenv**: Environment configuration management
- **chalk**: Terminal styling and colors

### Design Patterns
- **Command Pattern**: Each CLI command is a separate module
- **Factory Pattern**: Dynamic function creation with closures
- **Module Pattern**: Clean separation of concerns
- **Error-First Callbacks**: Proper Node.js error handling
- **Dependency Injection**: Configurable file paths via environment

### Data Structure

Notes are stored as JSON objects with the following schema:

```json
{
  "id": 1751483669714,
  "title": "My Note Title",
  "body": "The content of my note...",
  "createdAt": "2025-07-02T19:14:29.714Z",
  "updatedAt": "2025-07-02T19:14:29.715Z"
}
```

### Error Handling
- **Try-catch blocks** around all async operations
- **Input validation** for all user commands
- **Graceful degradation** for missing files
- **User-friendly error messages** with colored output
- **Exit codes** for proper CLI behavior

### User Experience Features
- **Colorized output** using chalk for better readability
- **Progress indicators** for long-running operations
- **Helpful error messages** with usage hints
- **Consistent formatting** across all commands
- **Auto-completion friendly** command structure

## Lab 1: JavaScript Fundamentals

### Learning Objectives

The Lab 1 exercises (`npm run lab1`) demonstrate key JavaScript and Node.js concepts:

#### Closures
```javascript
function createCommandParser(prefix) {
  const commandPrefix = prefix.toUpperCase();
  
  // Returns a function that "closes over" commandPrefix
  return function(command, ...args) {
    return `${commandPrefix}: ${command}`;
  };
}

const noteParser = createCommandParser('NOTE');
noteParser('add', 'My Title'); // "NOTE: add"
```

#### Higher-Order Functions  
```javascript
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name}`);
    const result = fn.apply(this, args);
    console.log('Function completed');
    return result;
  };
}

const loggedFunction = withLogging(myFunction);
```

#### Function Composition
```javascript
const compose = (...fns) => (value) => 
  fns.reduceRight((acc, fn) => fn(acc), value);

const processTitle = compose(
  addExclamation,
  makeUpperCase, 
  addPrefix
);

processTitle('hello'); // "PREFIX: HELLO!"
```

#### Factory Patterns
```javascript
function createNoteValidator(minLength, maxLength) {
  return function validateNote(title, body) {
    // Validation logic using captured parameters
    return { isValid: true/false, errors: [...] };
  };
}

const strictValidator = createNoteValidator(5, 100);
const lenientValidator = createNoteValidator(1, 500);
```

### Node.js Environment Exploration

The lab demonstrates Node.js runtime features:

```javascript
// Process information
console.log(`Node.js Version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}`);

// Command line arguments
console.log('Arguments:', process.argv);

// Environment variables
console.log('PATH:', process.env.PATH);
```

### Interactive Examples

Run `npm run lab1` to see:
- **Live closure demonstrations** with command parsers
- **Function logging wrappers** with timing information  
- **Counter factories** maintaining private state
- **Note validators** with configurable rules
- **Function composition pipelines** for text processing
- **Node.js environment info** and REPL guidance

## Node.js Deep Dive

### Environment Exploration

Understanding the Node.js runtime environment:

```javascript
// Core process information
process.version      // Node.js version (e.g., "v18.17.0")
process.platform     // Operating system ("win32", "darwin", "linux")
process.arch         // CPU architecture ("x64", "arm64")
process.pid          // Process ID
process.cwd()        // Current working directory
process.uptime()     // Process uptime in seconds
```

### REPL Exploration

Interactive Node.js session examples:

```bash
# Start Node.js REPL
node

# Try these commands:
> process.version
> process.platform
> global
> require('os').cpus().length
> console.log('Hello from REPL!')
> .exit
```

### Practical Experiments

```javascript
// Explore closures in REPL
function createCounter(start = 0) {
  let count = start;
  return () => ++count;
}

const counter = createCounter(10);
counter(); // 11
counter(); // 12

// Test higher-order functions
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);
const evens = numbers.filter(x => x % 2 === 0);
```

### File System Operations

The project demonstrates modern async file handling:

```javascript
import fs from 'fs/promises';

// Reading files
const data = await fs.readFile('notes.json', 'utf8');
const notes = JSON.parse(data);

// Writing files
await fs.writeFile('notes.json', JSON.stringify(notes, null, 2));

// Directory operations
await fs.mkdir('data', { recursive: true });
```

## Example Usage Session

Here's a complete workflow demonstrating all features:

```bash
# Start with help
$ npm start
CLI Note Manager

Usage:
  npm start add <title> <body>     - Add a new note
  npm start list                   - List all notes
  npm start read <title>           - Read a specific note
  npm start remove <title>         - Remove a note
  npm start search <term>          - Search notes by keyword

Lab Exercises:
  npm run lab1                     - Run Lab 1 exercises

# Add some notes
$ npm start add "Shopping List" "Buy milk, eggs, and bread for breakfast"
✓ Note "Shopping List" added successfully!

$ npm start add "Meeting Notes" "Quarterly review scheduled for next Friday at 2 PM"
✓ Note "Meeting Notes" added successfully!

$ npm start add "JavaScript Learning" "Study closures, higher-order functions, and async programming"
✓ Note "JavaScript Learning" added successfully!

# List all notes
$ npm start list

Found 3 note(s):

1. Shopping List
   Created: 7/3/2025

2. Meeting Notes
   Created: 7/3/2025

3. JavaScript Learning
   Created: 7/3/2025

# Search for specific content
$ npm start search "JavaScript"

Found 1 note(s) containing "JavaScript":

1. JavaScript Learning
   Study closures, higher-order functions, and async programming
   Created: 7/3/2025

Use "npm start read <title>" to view the full note.

# Read a full note
$ npm start read "JavaScript Learning"

==================================================
Title: JavaScript Learning
==================================================
Study closures, higher-order functions, and async programming
==================================================
Created: 7/3/2025, 1:14:29 AM
Updated: 7/3/2025, 1:14:29 AM
==================================================

# Remove a completed note
$ npm start remove "Shopping List"
✓ Note "Shopping List" removed successfully!

# Run lab exercises
$ npm run lab1
Lab 1: JavaScript Fundamentals & Node.js Basics

=== Node.js Environment Information ===
Node.js Version: v18.17.0
Platform: win32
Architecture: x64
Process ID: 12345
💡 Tip: You can explore the Node.js REPL by running "node" in your terminal

=== Closures & Higher-Order Functions ===
[... detailed demonstrations ...]

Lab 1 exercises completed successfully!
```

## Learning Objectives & Outcomes

After working with this project, you will have mastered:

### Node.js Fundamentals
- **Command-line argument processing** with `process.argv`
- **Async file system operations** using `fs/promises`
- **Environment configuration** with `.env` files
- **ES module system** with `import`/`export`
- **Process information access** and runtime environment
- **Error handling patterns** in Node.js applications
- **JSON data manipulation** for persistence
- **NPM script configuration** and project setup

### Advanced JavaScript Concepts
- **Closures and lexical scope** with practical examples
- **Higher-order functions** and function composition
- **Factory patterns** for dynamic function creation
- **Async/await patterns** and Promise handling
- **Destructuring and spread operators** in modern JS
- **Array methods** (map, filter, reduce) for data processing
- **Template literals** and string interpolation
- **Error handling** with try/catch blocks

### Software Design Principles
- **Modular architecture** with single responsibility
- **Separation of concerns** between commands and utilities
- **Command pattern** for CLI application structure
- **Input validation** and user feedback
- **Code organization** and project structure
- **Documentation** and README best practices
- **Version control** with appropriate .gitignore
- **User experience design** for CLI applications

### Practical Skills
- **CLI application development** from scratch
- **Data persistence** with JSON files
- **Search algorithms** and text processing
- **Terminal output formatting** and colors
- **Project dependency management** with npm
- **Environment-based configuration** patterns
- **Testing and debugging** Node.js applications
- **Code reusability** and function composition

## Troubleshooting & FAQ

### Common Issues

#### "Module not found" errors
```bash
# Solution: Install dependencies
npm install

# Verify installation
npm list
```

#### Permission errors on file operations
```bash
# Windows: Run as administrator if needed
# Unix/Linux: Check file permissions
ls -la data/
chmod 755 data/
```

#### Notes not saving or loading
1. Check that the `data/` directory exists and is writable
2. Verify `.env` configuration:
   ```env
   NOTES_FILE_PATH=./data/notes.json
   ```
3. Ensure Node.js has permission to create files

#### "Cannot find module" with ES modules
- Ensure `package.json` has `"type": "module"`
- Use `.js` extensions in import statements
- Check Node.js version (requires 14+)

### Configuration Options

#### Custom Data Location
Edit `.env` file:
```env
# Store notes in a different location
NOTES_FILE_PATH=./my-custom-notes/notes.json

# Or use an absolute path
NOTES_FILE_PATH=/home/user/documents/notes.json
```

#### VS Code Integration
The project includes VS Code tasks:
- `Ctrl+Shift+P` → "Tasks: Run Task" → "Start Note Manager"

### Performance Tips

1. **Large Note Collections**: The JSON file approach works well for hundreds of notes
2. **Search Performance**: Consider indexing for thousands of notes
3. **Backup Strategy**: Regular backups of `data/notes.json` recommended

### Debug Mode

Add debug logging by modifying commands:
```javascript
// In any command file
const DEBUG = process.env.DEBUG === 'true';
if (DEBUG) console.log('Debug info:', data);
```

Run with debug:
```bash
DEBUG=true npm start list
```

## Advanced Features & Extensions

### Potential Enhancements

This project provides a solid foundation for additional features:

#### Data Features
- **Categories/Tags**: Organize notes with labels
- **Priorities**: High/Medium/Low priority system
- **Due Dates**: Task management with deadlines
- **Attachments**: Link files to notes
- **Export Options**: PDF, Markdown, HTML export

#### Search Enhancements
- **Fuzzy Search**: Find notes with typos
- **Regex Support**: Advanced pattern matching
- **Full-text Indexing**: Faster search for large collections
- **Search History**: Remember recent searches
- **Saved Searches**: Bookmark frequent queries

#### CLI Improvements
- **Interactive Mode**: Menu-driven interface
- **Auto-completion**: Tab completion for commands
- **Aliases**: Short commands (`a` for `add`)
- **Batch Operations**: Process multiple notes
- **Undo/Redo**: Reversible operations

#### Data Management
- **Sync**: Cloud synchronization
- **Backup**: Automated backups
- **Import**: From other note apps
- **Templates**: Pre-formatted note types
- **Encryption**: Secure sensitive notes

### Extension Exercises

Try implementing these features to deepen your learning:

1. **Add Note Categories**
   ```javascript
   // Add category field to notes
   npm start add "Work Meeting" "Team standup notes" --category="work"
   npm start list --category="work"
   ```

2. **Implement Note Templates**
   ```javascript
   // Create reusable note templates
   npm start template create "meeting" "Date: {date}\nAttendees: {attendees}"
   npm start add-from-template "meeting" "Team Standup"
   ```

3. **Add Priority System**
   ```javascript
   // Priority-based note management
   npm start add "Fix Bug" "Critical database issue" --priority="high"
   npm start list --sort="priority"
   ```

### Integration Possibilities

- **Git Integration**: Version control for notes
- **Markdown Support**: Rich text formatting
- **Web Interface**: Browser-based note access
- **Mobile App**: React Native companion
- **API Server**: REST API for note management
- **Database Backend**: PostgreSQL/MongoDB storage

## Additional Resources

### Learning Materials
- [Node.js Official Documentation](https://nodejs.org/docs/)
- [JavaScript Closures - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
- [Async/Await - JavaScript.info](https://javascript.info/async-await)
- [Command Line Apps with Node.js](https://nodejs.dev/learn/command-line-apps)

### Tools & Libraries
- [Commander.js](https://github.com/tj/commander.js/) - Advanced CLI framework
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js/) - Interactive prompts
- [Ora](https://github.com/sindresorhus/ora) - Loading spinners
- [Boxen](https://github.com/sindresorhus/boxen) - Terminal boxes

### Next Steps
1. **Extend the Project**: Add new features from the suggestions above
2. **Learn Testing**: Add unit tests with Jest or Mocha
3. **Database Integration**: Replace JSON with SQLite or PostgreSQL
4. **Web Development**: Create a web interface with Express.js
5. **Deploy**: Package as a global npm module

## License

```
MIT License

Copyright (c) 2025 CLI Note Manager

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Acknowledgments

- **Node.js Community** - For the excellent runtime and ecosystem
- **Chalk Contributors** - For beautiful terminal colors
- **Open Source Community** - For inspiration and best practices

---

<div align="center">

### Star this project if it helped you learn!

**Made with care for learning JavaScript and Node.js**

</div>
