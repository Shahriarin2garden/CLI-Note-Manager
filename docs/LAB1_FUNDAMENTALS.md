# Lab 1: JavaScript Fundamentals & Node.js Introduction

## Learning Objectives

### Core JavaScript Refresher
- **Functions**: Declarations, expressions, arrow functions, and scope
- **Closures**: Understanding lexical scoping and practical applications
- **Objects & Arrays**: Manipulation, destructuring, and methods
- **Higher-Order Functions**: Functions that take/return other functions

### Node.js Fundamentals
- **Runtime Environment**: What is Node.js and how it works
- **Execution Context**: Call stack, event loop, and hoisting
- **Architecture**: Event-driven, non-blocking I/O model
- **Framework Comparison**: Node.js vs other backend technologies

### Practical Tasks
- ✅ Set up Node.js development environment
- ✅ Write functions demonstrating closures and higher-order functions
- ✅ Create first Node.js script with console.log and basic operations
- ✅ Explore Node.js REPL

## Quick Start

```bash
# Run the complete fundamentals course
npm start lab1

# Or run directly
node labs/lab1.js

# For step-by-step learning
node examples/step1-functions.js
node examples/step2-closures.js
node examples/step3-node-basics.js
```

## What You'll Learn

### 1. JavaScript Functions (3 Ways)
```javascript
// Function Declaration (hoisted)
function greet(name) {
    return `Hello, ${name}!`;
}

// Function Expression (not hoisted)
const greet2 = function(name) {
    return `Hello, ${name}!`;
};

// Arrow Function (modern syntax)
const greet3 = (name) => `Hello, ${name}!`;
```

### 2. Closures in Action
```javascript
// Counter with private state
function createCounter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count
    };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.getValue());  // 1
```

### 3. Higher-Order Functions
```javascript
// Function that takes another function
function withLogging(fn) {
    return function(...args) {
        console.log(`Calling function with args:`, args);
        return fn(...args);
    };
}

const loggedAdd = withLogging((a, b) => a + b);
loggedAdd(5, 3); // Logs: "Calling function with args: [5, 3]" then returns 8
```

### 4. Node.js Environment
```javascript
// Access Node.js globals
console.log('Node.js Version:', process.version);
console.log('Platform:', process.platform);
console.log('Current Directory:', process.cwd());
console.log('Environment Variables:', process.env.NODE_ENV);
```

## Expected Output

When you run `npm start lab1`, you should see:

```
Lab 1: JavaScript Fundamentals & Node.js Basics

=== Node.js Environment Information ===
Node.js Version: v18.17.0
Platform: win32
Architecture: x64
Process ID: 12345
Tip: You can explore the Node.js REPL by running "node" in your terminal

=== Closures & Higher-Order Functions ===
Testing Command Parser (Closure Example):
CLI: ADD Created note: "Meeting Notes"
CLI: LIST Available notes: Meeting Notes
CLI: REMOVE Removed note: "Meeting Notes"

Counter Factory (Another Closure Example):
Counter A: 1, 2, 3
Counter B: 1, 2
Counter A current value: 3
Counter B current value: 2

Higher-Order Function Example:
Original function result: 8
Logged function result: 8
```

## Key Concepts Explained

### What is a Closure?
A closure is created when a function is defined inside another function, giving the inner function access to the outer function's variables even after the outer function has returned.

### Why Use Higher-Order Functions?
They enable powerful patterns like:
- Function composition
- Event handling
- Middleware patterns
- Functional programming concepts

### Node.js vs Other Frameworks
- **Node.js**: Single-threaded, event-driven, non-blocking I/O
- **Python/Django**: Multi-threaded, synchronous by default
- **Java/Spring**: Multi-threaded, heavyweight
- **PHP**: Process-per-request model

## Next Steps

After completing Lab 1, you'll be ready for:
- **Lab 2**: Node.js Core Modules & File System Operations
- Building your first CLI application
- Understanding asynchronous programming patterns

## Troubleshooting

**Common Issues:**
- Module not found: Run `npm install`
- Permission errors: Check Node.js installation
- Syntax errors: Ensure Node.js version 18+

**Get Help:**
```bash
# Check Node.js version
node --version

# Test basic functionality
node -e "console.log('Node.js is working!')"

# Run step-by-step examples
node examples/step1-functions.js
```
