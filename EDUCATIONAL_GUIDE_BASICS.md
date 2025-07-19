# JavaScript & Node.js Fundamentals
*Essential Knowledge for CLI Development*

> **Navigation**: [← Main Guide](./EDUCATIONAL_GUIDE.md) | [Next: Advanced →](./EDUCATIONAL_GUIDE_ADVANCED.md) | [Verify Learning →](./EDUCATIONAL_REQUIREMENTS.md)

> **🎯 Hands-On Practice**: [Lab 1: Fundamentals](./docs/LAB1.md) | Run `npm start lab1`

This comprehensive guide provides the theoretical foundation and practical implementation of JavaScript and Node.js concepts essential for building professional CLI applications. Each concept is explained with theory, architecture insights, and working examples.

**💡 Study Method**: Read the theory sections first to understand the concepts, then work through the practical examples and complete [Lab 1](./docs/LAB1_FUNDAMENTALS.md) for hands-on reinforcement.

## Theoretical Foundation

### JavaScript Runtime Environment & Execution Context

JavaScript operates within a **runtime environment** that provides the context for code execution. Understanding this foundation is crucial for effective development:

**Execution Context Components:**
- **Global Execution Context**: Created when the program starts, contains global variables and functions
- **Function Execution Context**: Created each time a function is invoked, with its own variable environment
- **Call Stack**: LIFO structure that manages execution contexts, tracking function calls and returns
- **Memory Heap**: Where objects and complex data structures are stored

**Execution Process:**
1. **Creation Phase**: Variables are hoisted, functions are stored, `this` binding is established
2. **Execution Phase**: Code runs line by line, variables are assigned values
3. **Cleanup Phase**: Context is removed from call stack when execution completes

### Core JavaScript Language Concepts

**Functions as First-Class Citizens:**
JavaScript treats functions as values that can be assigned to variables, passed as arguments, and returned from other functions. This enables powerful patterns like callbacks, higher-order functions, and functional programming approaches.

**Scope and Lexical Environment:**
Scope determines variable accessibility and lifetime. JavaScript uses lexical scoping, where inner functions have access to variables in their outer scope at the time of definition, not execution.

**Closures:**
A closure occurs when an inner function retains access to variables from its outer function's scope even after the outer function has completed execution. This mechanism enables data privacy, function factories, and callback patterns.

**Object-Oriented vs Functional Paradigms:**
JavaScript supports both paradigms - prototype-based inheritance for objects and functional programming with immutable data transformations, higher-order functions, and composition.

### Node.js Architecture & Runtime Model

**What is Node.js:**
Node.js is a JavaScript runtime built on Chrome's V8 engine that enables server-side JavaScript execution. It extends JavaScript beyond the browser, providing access to file systems, networks, and operating system APIs.

**Core Architecture Components:**

<!-- Node.js Architecture Diagram - Full Width Placeholder -->
<div align="center" style="width: 100%; margin: 30px 0;">
  <img src="./node.drawio (1).svg" alt="Node.js Architecture Diagram" width="100%" style="max-width: 1000px; min-width: 600px;">
  <br>
  <em>Interactive Node.js Architecture: V8 Engine, libuv Event Loop, Thread Pool, and System Integration</em>
</div>

```
┌─────────────────────────────────────┐
│           Node.js Application       │
├─────────────────────────────────────┤
│           Node.js Bindings          │
├─────────────────────────────────────┤
│  V8 Engine  │       libuv           │
│ (JavaScript │   (Event Loop &       │
│  Execution) │   System Operations)  │
├─────────────┴───────────────────────┤
│        Operating System             │
└─────────────────────────────────────┘
```

**V8 JavaScript Engine:**
- Compiles JavaScript to optimized machine code
- Manages memory allocation and garbage collection
- Provides JavaScript runtime environment

**libuv Library:**
- Implements the event loop and asynchronous I/O operations
- Handles file system operations, networking, and threading
- Provides cross-platform system abstraction

### Event-Driven, Non-Blocking I/O Model

**Traditional Threading Model:**
Most server technologies use one thread per request, which can lead to resource exhaustion and blocking operations when handling concurrent requests.

**Node.js Event Loop Model:**
Node.js uses a single-threaded event loop with non-blocking I/O operations:

1. **Event Loop**: Continuously checks for and processes events
2. **Callback Queue**: Stores completed asynchronous operations
3. **Thread Pool**: Handles CPU-intensive operations separately
4. **Non-blocking Operations**: I/O operations don't halt program execution

**Benefits:**
- High concurrency with low memory footprint
- Excellent performance for I/O-intensive applications
- Simplified concurrency model without thread synchronization

**Trade-offs:**
- CPU-intensive operations can block the event loop
- Single point of failure in the main thread
- Callback complexity (mitigated by Promises/async-await)

### Node.js vs Other Backend Frameworks

**Node.js vs Traditional Server Technologies:**

| Aspect | Node.js | Java/Spring | Python/Django | C#/.NET |
|--------|---------|-------------|---------------|---------|
| **Architecture** | Event-driven, single-threaded | Multi-threaded | Multi-threaded | Multi-threaded |
| **Concurrency** | Event loop + callbacks | Thread pooling | Threading/async | Threading/async |
| **Memory Usage** | Low (shared event loop) | High (thread overhead) | Moderate | Moderate |
| **I/O Performance** | Excellent | Good | Good | Good |
| **CPU Performance** | Limited (single thread) | Excellent | Good | Excellent |
| **Development Speed** | Fast (JavaScript everywhere) | Moderate | Fast | Moderate |
| **Ecosystem** | NPM (largest package registry) | Maven/Gradle | PyPI | NuGet |

**When to Choose Node.js:**
- Real-time applications (chat, gaming, collaboration)
- API development and microservices
- I/O-intensive applications
- Rapid prototyping and development
- Teams with JavaScript expertise

**When to Avoid Node.js:**
- CPU-intensive computational tasks
- Applications requiring heavy mathematical processing
- Systems needing maximum security isolation
- Legacy system integration requirements

## Learning Objectives

By the end of this guide, you'll understand:

**Theoretical Foundations:**
- [✓] JavaScript runtime environment and execution context
- [✓] Event-driven programming and the event loop
- [✓] Node.js architecture and core components
- [✓] Non-blocking I/O model vs traditional threading
- [✓] When to choose Node.js vs other backend technologies

**Practical Implementation:**
- [✓] JavaScript functions, scope, and closures
- [✓] Object and array manipulation
- [✓] Higher-order functions and callbacks
- [✓] Node.js development environment setup
- [✓] Building command-line applications

## Topics Covered

**Theoretical Foundations**
- JavaScript runtime environment and execution context
- Event-driven, non-blocking I/O architecture
- Node.js core components and architecture
- Comparison with other backend frameworks

**Core JavaScript Implementation**
- Functions (declarations, expressions, arrow functions)
- Scope, closures, and lexical environment
- Objects and arrays manipulation
- Higher-order functions and functional programming

**Node.js Development Environment**
- Runtime setup and verification
- REPL for experimentation and testing
- Command-line application development
- Asynchronous programming patterns

**Practical CLI Development**
- Project structure and dependency management
- Building interactive command-line interfaces
- File system operations and data persistence
- Error handling and user experience design

## Prerequisites

- Basic programming knowledge
- Command line familiarity
- Text editor (VS Code recommended)

## Development Environment Setup

### System Requirements
- Node.js 18.0.0+ and npm
- Terminal access
- Code editor

### Installation Verification

Check Node.js installation:
```bash
node --version
```
**Expected output:** `v18.17.0` (or higher)  
**Actual output example:** `v22.13.1`

Check NPM installation:
```bash
npm --version
```
**Expected output:** `9.6.7` (or compatible)  
**Actual output example:** `10.9.2`

### Project Setup

Initialize and run the CLI project:
```bash
cd telemed  # Navigate to project directory
npm install  # Install dependencies
npm start    # Run the application
```

**Expected Output:**
```
> telemed-advanced-notes@2.0.0 start
> node index.js

TELEMED NOTES v2.0
AI-Powered Note Manager

BASIC OPERATIONS:
  add <title> <body>     - Add a new note
  list [category]        - List notes
  read <title>           - Read a note
  ...
```

## 1. Core JavaScript Refresher

### 1.1 Functions - Three Ways to Define

JavaScript provides three function syntaxes, each with specific use cases:

**Function Declaration (Hoisted)**
```javascript
function createNote(title, content) {
    return {
        id: Date.now(),
        title: title,
        content: content,
        created: new Date()
    };
}
```

**Function Expression (Not Hoisted)**
```javascript
const processNote = function(note) {
    return {
        ...note,
        wordCount: note.content.split(' ').length,
        summary: note.content.substring(0, 50) + '...'
    };
};
```

**Arrow Function (Modern, Concise)**
```javascript
const displayNote = (note) => `[${note.id}] ${note.title}`;
```

**Practice Exercise - Create `examples/functions-demo.js`:**
```javascript
console.log('=== Function Types Demo ===');

// Function declaration (available before definition)
console.log('1. Function Declaration:', createNote('Test', 'Content'));

function createNote(title, content) {
    return { id: Date.now(), title, content };
}

// Function expression (only available after definition)
const formatNote = function(note) {
    return `${note.title}: ${note.content}`;
};

// Arrow function (modern syntax)
const shortFormat = (note) => `[${note.id}] ${note.title}`;

// Test all functions
const note = createNote('Demo Note', 'This is a demo');
console.log('2. Function Expression:', formatNote(note));
console.log('3. Arrow Function:', shortFormat(note));
```

**Run:** `node examples/functions-demo.js`

**Expected Output:**
```
=== Function Types Demo ===
1. Function Declaration: { id: 1752436533152, title: 'Test', content: 'Content' }
2. Function Expression: Demo Note: This is a demo
3. Arrow Function: [1752436533152] Demo Note
```

### 1.2 Scope and Closures

**Scope Types:**
- **Global Scope:** Variables accessible everywhere
- **Function Scope:** Variables accessible within function
- **Block Scope:** Variables accessible within `{}` blocks

**Closure Example:**
```javascript
function createCounter() {
    let count = 0;  // Private variable
    
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count
    };
}
```

**Practice Exercise - Create `examples/scope-closures.js`:**
```javascript
console.log('=== Scope and Closures Demo ===');

// Global scope
const APP_NAME = 'Note Manager';

// Closure example: Private counter
function createNoteCounter() {
    let noteCount = 0;
    let operations = [];
    
    return {
        add() {
            noteCount++;
            operations.push(`Added note #${noteCount}`);
            return noteCount;
        },
        
        remove() {
            if (noteCount > 0) {
                noteCount--;
                operations.push(`Removed note, now ${noteCount}`);
            }
            return noteCount;
        },
        
        getCount() {
            return noteCount;
        },
        
        getHistory() {
            return [...operations];  // Return copy
        }
    };
}

// Test the closure
const counter = createNoteCounter();
console.log('Initial count:', counter.getCount());
console.log('After adding 3 notes:', counter.add(), counter.add(), counter.add());
console.log('After removing 1 note:', counter.remove());
console.log('Final count:', counter.getCount());
console.log('History:', counter.getHistory());
```

**Run:** `node examples/scope-closures.js`

**Expected Output:**
```
=== Scope and Closures Demo ===
Initial count: 0
After adding 3 notes: 1 2 3
After removing 1 note: 2
Final count: 2
History: [
  'Added note #1',
  'Added note #2',
  'Added note #3',
  'Removed note, now 2'
]
```

### 1.3 Objects and Arrays

**Object Operations:**
```javascript
// Object creation and manipulation
const note = {
    id: 1,
    title: 'My Note',
    content: 'Note content',
    tags: ['work', 'important']
};

// Destructuring
const { title, content } = note;

// Spread operator
const updatedNote = { ...note, lastModified: new Date() };
```

**Array Operations:**
```javascript
// Array methods for data processing
const notes = [
    { id: 1, title: 'Note 1', category: 'work' },
    { id: 2, title: 'Note 2', category: 'personal' },
    { id: 3, title: 'Note 3', category: 'work' }
];

// Filter, map, reduce
const workNotes = notes.filter(note => note.category === 'work');
const titles = notes.map(note => note.title);
const totalNotes = notes.reduce((count, note) => count + 1, 0);
```

**Practice Exercise - Create `examples/objects-arrays.js`:**
```javascript
console.log('=== Objects and Arrays Demo ===');

// Sample notes data
const notes = [
    { id: 1, title: 'Meeting Notes', content: 'Discussed project timeline', category: 'work', words: 4 },
    { id: 2, title: 'Shopping List', content: 'Milk, bread, eggs', category: 'personal', words: 3 },
    { id: 3, title: 'Code Review', content: 'Review pull request #123', category: 'work', words: 4 }
];

// Object destructuring
const { title, content } = notes[0];
console.log('1. Destructured first note:', { title, content });

// Array filtering
const workNotes = notes.filter(note => note.category === 'work');
console.log('2. Work notes:', workNotes.length);

// Array mapping
const summaries = notes.map(note => ({
    id: note.id,
    title: note.title,
    preview: note.content.substring(0, 20) + '...'
}));
console.log('3. Note summaries:', summaries);

// Array reducing
const totalWords = notes.reduce((sum, note) => sum + note.words, 0);
console.log('4. Total words across all notes:', totalWords);

// Spread operator
const newNote = { ...notes[0], id: 4, title: 'Updated Meeting Notes' };
console.log('5. Note with spread operator:', newNote);
```

**Run:** `node examples/objects-arrays.js`

**Expected Output:**
```
=== Objects and Arrays Demo ===
1. Destructured first note: { title: 'Meeting Notes', content: 'Discussed project timeline' }
2. Work notes: 2
3. Note summaries: [
  { id: 1, title: 'Meeting Notes', preview: 'Discussed project t...' },
  { id: 2, title: 'Shopping List', preview: 'Milk, bread, eggs...' },
  { id: 3, title: 'Code Review', preview: 'Review pull request...' }
]
4. Total words across all notes: 11
5. Note with spread operator: {
  id: 4,
  title: 'Updated Meeting Notes',
  content: 'Discussed project timeline',
  category: 'work',
  words: 4
}
```

### 1.4 Higher-Order Functions

Functions that take other functions as arguments or return functions:

**Practice Exercise - Create `examples/higher-order.js`:**
```javascript
console.log('=== Higher-Order Functions Demo ===');

// Sample data
const notes = [
    { id: 1, title: 'Work Task', priority: 'high', completed: false },
    { id: 2, title: 'Personal Note', priority: 'low', completed: true },
    { id: 3, title: 'Meeting', priority: 'high', completed: false }
];

// Higher-order function: filter with custom condition
function filterNotes(notes, conditionFn) {
    return notes.filter(conditionFn);
}

// Higher-order function: transform notes
function transformNotes(notes, transformFn) {
    return notes.map(transformFn);
}

// Callback functions
const isHighPriority = (note) => note.priority === 'high';
const isIncomplete = (note) => !note.completed;
const addStatus = (note) => ({
    ...note,
    status: note.completed ? '✓ Complete' : '⏳ Pending'
});

// Using higher-order functions
const highPriorityNotes = filterNotes(notes, isHighPriority);
const incompleteNotes = filterNotes(notes, isIncomplete);
const notesWithStatus = transformNotes(notes, addStatus);

console.log('1. High priority notes:', highPriorityNotes.length);
console.log('2. Incomplete notes:', incompleteNotes.length);
console.log('3. Notes with status:');
notesWithStatus.forEach(note => {
    console.log(`   ${note.title}: ${note.status}`);
});

// Function composition
const processNotes = (notes) => 
    transformNotes(
        filterNotes(notes, isIncomplete),
        addStatus
    );

console.log('4. Processed notes (incomplete with status):');
processNotes(notes).forEach(note => {
    console.log(`   ${note.title}: ${note.status}`);
});
```

**Run:** `node examples/higher-order.js`

**Expected Output:**
```
=== Higher-Order Functions Demo ===
1. High priority notes: 2
2. Incomplete notes: 2
3. Notes with status:
   Work Task: ⏳ Pending
   Personal Note: ✓ Complete
   Meeting: ⏳ Pending
4. Processed notes (incomplete with status):
   Work Task: ⏳ Pending
   Meeting: ⏳ Pending
```

## 2. Node.js Runtime Environment

### 2.1 What is Node.js?

**Node.js Architecture:**
- **V8 Engine:** Google's JavaScript engine
- **Event Loop:** Handles asynchronous operations
- **Non-blocking I/O:** Concurrent operations without threads
- **Built-in Modules:** File system, HTTP, crypto, etc.

**Key Characteristics:**
- Single-threaded with event-driven architecture
- Asynchronous, non-blocking operations
- NPM ecosystem for packages
- Cross-platform development

### 2.2 Event-Driven, Non-Blocking I/O Model

**Traditional (Blocking) vs Node.js (Non-blocking):**

```javascript
// Blocking (traditional)
const data1 = readFileSync('file1.txt');
const data2 = readFileSync('file2.txt');
console.log('Both files read');

// Non-blocking (Node.js)
readFile('file1.txt', (err, data1) => {
    console.log('File 1 read');
});
readFile('file2.txt', (err, data2) => {
    console.log('File 2 read');
});
console.log('Files being read...');
```

**Practice Exercise - Create `examples/nodejs-basics.js`:**
```javascript
import fs from 'fs/promises';

console.log('=== Node.js Runtime Demo ===');

// Runtime information
console.log('1. Node.js Environment:');
console.log(`   Version: ${process.version}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Architecture: ${process.arch}`);
console.log(`   Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);

// Command line arguments
console.log('2. Command Line Arguments:');
console.log(`   Script: ${process.argv[1]}`);
console.log(`   Args: ${process.argv.slice(2).join(', ') || 'none'}`);

// Demonstrate non-blocking I/O
async function demonstrateAsyncIO() {
    console.log('3. Non-blocking I/O Demo:');
    
    const startTime = Date.now();
    console.log('   Starting file operations...');
    
    // Create test files
    await fs.writeFile('test1.txt', 'File 1 content');
    await fs.writeFile('test2.txt', 'File 2 content');
    
    // Read files concurrently (non-blocking)
    const [data1, data2] = await Promise.all([
        fs.readFile('test1.txt', 'utf8'),
        fs.readFile('test2.txt', 'utf8')
    ]);
    
    console.log(`   Read "${data1}" and "${data2}"`);
    console.log(`   Completed in ${Date.now() - startTime}ms`);
    
    // Cleanup
    await fs.unlink('test1.txt');
    await fs.unlink('test2.txt');
}

await demonstrateAsyncIO();
```

**Run:** `node examples/nodejs-basics.js arg1 arg2`

**Expected Output:**
```
=== Node.js Runtime Demo ===
1. Node.js Environment:
   Version: v22.13.1
   Platform: win32
   Architecture: x64
   Memory usage: 5MB
2. Command Line Arguments:
   Script: E:\New Folder(1)\Downloads\telemed\examples\nodejs-basics.js
   Args: arg1, arg2
3. Non-blocking I/O Demo:
   Starting file operations...
   Read "File 1 content" and "File 2 content"
   Completed in 15ms
```

### 2.3 Node.js vs Other Backend Frameworks

**Comparison Table:**

| Feature | Node.js | Python/Django | Java/Spring | PHP |
|---------|---------|---------------|-------------|-----|
| **Language** | JavaScript | Python | Java | PHP |
| **Architecture** | Event-driven, single-threaded | Multi-threaded | Multi-threaded | Multi-process |
| **Performance** | High for I/O operations | Moderate | High | Moderate |
| **Concurrency** | Event loop | Threading | Threading | Process-based |
| **Learning Curve** | Moderate | Easy | Steep | Easy |
| **Use Cases** | Real-time apps, APIs | Web apps, AI/ML | Enterprise apps | Web development |

**Node.js Advantages:**
- Same language for frontend and backend
- Excellent for I/O intensive applications
- Large NPM ecosystem
- Great for real-time applications (chat, gaming)
- Fast development cycle

**Node.js Disadvantages:**
- Single-threaded (CPU-intensive tasks can block)
- Callback complexity (solved with async/await)
- Rapid ecosystem changes

## 3. Practical Development

### 3.1 Node.js REPL (Read-Eval-Print Loop)

The REPL is perfect for experimenting with Node.js:

**Start REPL:**
```bash
node
```

**REPL Commands:**
```javascript
// Basic operations
> 2 + 3
5
> const name = 'Node.js'
undefined
> name.toUpperCase()
'NODE.JS'

// Multi-line functions
> function greet(name) {
... return `Hello, ${name}!`;
... }
undefined
> greet('Developer')
'Hello, Developer!'

// Node.js modules
> const fs = require('fs')
undefined
> fs.existsSync('.')
true

// Exit REPL
> .exit
```

**REPL Special Commands:**
- `.help` - Show help
- `.break` - Exit multi-line mode
- `.clear` - Clear context
- `.save filename` - Save session
- `.load filename` - Load session
- `.exit` - Exit REPL

### 3.2 Your First Node.js CLI Script

**Create `examples/first-cli.js`:**
```javascript
#!/usr/bin/env node

console.log('=== My First Node.js CLI ===');

// Get command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Simple CLI commands
switch (command) {
    case 'hello':
        const name = args[1] || 'World';
        console.log(`Hello, ${name}!`);
        break;
        
    case 'math':
        const num1 = parseFloat(args[1]);
        const operation = args[2];
        const num2 = parseFloat(args[3]);
        
        if (isNaN(num1) || isNaN(num2)) {
            console.log('Please provide valid numbers');
            break;
        }
        
        let result;
        switch (operation) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/': result = num1 / num2; break;
            default: 
                console.log('Supported operations: +, -, *, /');
                process.exit(1);
        }
        
        console.log(`${num1} ${operation} ${num2} = ${result}`);
        break;
        
    case 'env':
        console.log(`Node.js: ${process.version}`);
        console.log(`Platform: ${process.platform}`);
        console.log(`Directory: ${process.cwd()}`);
        break;
        
    default:
        console.log('Available commands:');
        console.log('  hello [name]           - Greet someone');
        console.log('  math <num1> <op> <num2> - Calculate');
        console.log('  env                    - Show environment');
        console.log('');
        console.log('Examples:');
        console.log('  node first-cli.js hello Alice');
        console.log('  node first-cli.js math 10 + 5');
        console.log('  node first-cli.js env');
}
```

**Test the CLI:**
```bash
node examples/first-cli.js
node examples/first-cli.js hello Alice
node examples/first-cli.js math 10 + 5
node examples/first-cli.js env
```

**Expected Output:**

*No arguments:*
```
=== My First Node.js CLI ===
Available commands:
  hello [name]           - Greet someone
  math <num1> <op> <num2> - Calculate
  env                    - Show environment

Examples:
  node first-cli.js hello Alice
  node first-cli.js math 10 + 5
  node first-cli.js env
```

*Hello command:*
```
=== My First Node.js CLI ===
Hello, Alice!
```

*Math command:*
```
=== My First Node.js CLI ===
10 + 5 = 15
```

*Environment command:*
```
=== My First Node.js CLI ===
Node.js: v22.13.1
Platform: win32
Directory: E:\New Folder(1)\Downloads\telemed
```

## Summary

You've learned the essential JavaScript and Node.js concepts:

**[✓] Core JavaScript:**
- Functions (declaration, expression, arrow)
- Scope and closures for private data
- Objects and arrays manipulation
- Higher-order functions for code reuse

**[✓] Node.js Runtime:**
- Event-driven, non-blocking I/O architecture
- Runtime environment vs other frameworks
- Command-line argument processing
- REPL for experimentation

**[✓] Practical Skills:**
- Set up Node.js development environment
- Created working examples with real output
- Built your first CLI application
- Understand async programming basics

### Next Steps

## You've Completed the Basics!

**[✓] What You've Learned:**
- JavaScript functions, scope, and closures with working examples
- Object and array manipulation in real applications  
- Higher-order functions and practical callbacks
- Node.js runtime environment and architecture
- Event-driven programming fundamentals
- Command-line argument processing and REPL usage

## Next Steps

### **Hands-On Practice** (Recommended)
- **[Lab 1: Fundamentals](./docs/LAB1.md)** - Practice JavaScript concepts you just learned
- Run `npm start lab1` or `node labs/lab1.js` for interactive exercises
- Run `node labs/fundamentals.js` for comprehensive fundamentals course

### **Continue Learning**
- **[Lab 2: Core Modules](./docs/LAB2.md)** - File system and Node.js modules
- **[Advanced Guide](./EDUCATIONAL_GUIDE_ADVANCED.md)** - Professional patterns and AI integration
- [✓] **[Verify Learning](./EDUCATIONAL_REQUIREMENTS.md)** - Check your progress
- **[Back to Main Guide](./EDUCATIONAL_GUIDE.md)** - Overview and navigation

### **Practice Commands**
```bash
# Complete the labs first
npm start lab1     # JavaScript fundamentals practice
npm start lab2     # Core modules and file system

# Then test the full CLI application
npm start add "First Note" "Learning Node.js fundamentals"
npm start list
npm start analytics

# Continue with advanced topics
npm start learn
npm start tui      # Interactive terminal UI
npm start server   # REST API development
```

### **Challenge Yourself**
Try building your own CLI features using the patterns you've learned!

---

**Navigation**: [← Main Guide](./EDUCATIONAL_GUIDE.md) | **[Next: Advanced →](./EDUCATIONAL_GUIDE_ADVANCED.md)** | [Verify Learning →](./EDUCATIONAL_REQUIREMENTS.md)

**Your foundation is solid! Ready for advanced concepts?**
