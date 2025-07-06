#!/usr/bin/env node

import chalk from 'chalk';
import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';

/**
 * COMPREHENSIVE JAVASCRIPT & NODE.JS FUNDAMENTALS DEMONSTRATION
 * 
 * This module demonstrates all the core concepts required:
 * - Core JavaScript refresher (functions, scope, objects, arrays, closures)
 * - JS Runtime Environment & Execution Context
 * - Node.js architecture and event-driven model
 * - Practical examples and REPL exploration
 */

console.log(chalk.cyan.bold('JavaScript & Node.js Fundamentals Lab'));
console.log(chalk.gray('Comprehensive demonstration of core concepts\n'));

// =============================================================================
// 1. CORE JAVASCRIPT REFRESHER
// =============================================================================

console.log(chalk.yellow.bold('1. CORE JAVASCRIPT CONCEPTS'));
console.log(chalk.gray('─'.repeat(50)));

// Functions and Scope Demonstration
function demonstrateFunctions() {
  console.log(chalk.blue('\nFunctions and Scope:'));
  
  // Function declaration
  function greet(name) {
    return `Hello, ${name}!`;
  }
  
  // Function expression
  const multiply = function(a, b) {
    return a * b;
  };
  
  // Arrow function
  const square = x => x * x;
  
  console.log(chalk.green('Function Declaration:'), greet('Developer'));
  console.log(chalk.green('Function Expression:'), multiply(5, 3));
  console.log(chalk.green('Arrow Function:'), square(4));
  
  // Scope demonstration
  let globalVar = 'I am global';
  
  function scopeDemo() {
    let functionVar = 'I am function-scoped';
    
    if (true) {
      let blockVar = 'I am block-scoped';
      console.log(chalk.cyan('Inside block:'), blockVar);
    }
    
    console.log(chalk.cyan('Function scope:'), functionVar);
    console.log(chalk.cyan('Global access:'), globalVar);
  }
  
  scopeDemo();
}

// Objects and Arrays Demonstration
function demonstrateDataStructures() {
  console.log(chalk.blue('\nObjects and Arrays:'));
  
  // Object creation and manipulation
  const note = {
    id: 1,
    title: 'Learning JavaScript',
    content: 'Understanding objects and arrays',
    tags: ['javascript', 'learning'],
    metadata: {
      created: new Date(),
      author: 'Student'
    },
    
    // Method
    display() {
      return `${this.title}: ${this.content}`;
    }
  };
  
  console.log(chalk.green('Object:'), note.display());
  console.log(chalk.green('Nested property:'), note.metadata.author);
  
  // Array methods
  const numbers = [1, 2, 3, 4, 5];
  const doubled = numbers.map(n => n * 2);
  const evens = numbers.filter(n => n % 2 === 0);
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  
  console.log(chalk.green('Original array:'), numbers);
  console.log(chalk.green('Mapped (doubled):'), doubled);
  console.log(chalk.green('Filtered (evens):'), evens);
  console.log(chalk.green('Reduced (sum):'), sum);
  
  // Destructuring
  const [first, second, ...rest] = numbers;
  const { title, tags } = note;
  
  console.log(chalk.green('Array destructuring:'), { first, second, rest });
  console.log(chalk.green('Object destructuring:'), { title, tags });
}

// Closures Demonstration
function demonstrateClosures() {
  console.log(chalk.blue('\nClosures:'));
  
  // Basic closure
  function outerFunction(x) {
    // This is the outer function's scope
    
    function innerFunction(y) {
      // This inner function has access to x
      return x + y;
    }
    
    return innerFunction;
  }
  
  const addTen = outerFunction(10);
  console.log(chalk.green('Closure result:'), addTen(5)); // 15
  
  // Practical closure: Counter factory
  function createCounter(initialValue = 0) {
    let count = initialValue;
    
    return {
      increment() {
        count++;
        return count;
      },
      decrement() {
        count--;
        return count;
      },
      getValue() {
        return count;
      },
      reset() {
        count = initialValue;
        return count;
      }
    };
  }
  
  const counter = createCounter(5);
  console.log(chalk.green('Counter start:'), counter.getValue());
  console.log(chalk.green('After increment:'), counter.increment());
  console.log(chalk.green('After increment:'), counter.increment());
  console.log(chalk.green('After decrement:'), counter.decrement());
  console.log(chalk.green('After reset:'), counter.reset());
  
  // Module pattern with closure
  const noteManager = (function() {
    let notes = [];
    let nextId = 1;
    
    return {
      add(title, content) {
        const note = { id: nextId++, title, content, created: new Date() };
        notes.push(note);
        return note;
      },
      
      getAll() {
        return [...notes]; // Return copy
      },
      
      getCount() {
        return notes.length;
      },
      
      clear() {
        notes = [];
        nextId = 1;
      }
    };
  })();
  
  noteManager.add('First Note', 'Content 1');
  noteManager.add('Second Note', 'Content 2');
  console.log(chalk.green('Note manager count:'), noteManager.getCount());
  console.log(chalk.green('Notes:'), noteManager.getAll().map(n => n.title));
}

// Higher-Order Functions
function demonstrateHigherOrderFunctions() {
  console.log(chalk.blue('\nHigher-Order Functions:'));
  
  // Function that takes another function as argument
  function withLogging(fn, name) {
    return function(...args) {
      console.log(chalk.yellow(`Calling ${name} with:`, args));
      const result = fn.apply(this, args);
      console.log(chalk.yellow(`${name} returned:`, result));
      return result;
    };
  }
  
  // Function that returns another function
  function createMultiplier(factor) {
    return function(number) {
      return number * factor;
    };
  }
  
  const add = (a, b) => a + b;
  const loggedAdd = withLogging(add, 'add');
  loggedAdd(3, 7);
  
  const double = createMultiplier(2);
  const triple = createMultiplier(3);
  
  console.log(chalk.green('Double 5:'), double(5));
  console.log(chalk.green('Triple 4:'), triple(4));
  
  // Function composition
  const compose = (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value);
  
  const addOne = x => x + 1;
  const multiplyByTwo = x => x * 2;
  const toString = x => `Result: ${x}`;
  
  const pipeline = compose(toString, multiplyByTwo, addOne);
  console.log(chalk.green('Composed function:'), pipeline(5)); // "Result: 12"
}

// =============================================================================
// 2. JAVASCRIPT RUNTIME ENVIRONMENT & EXECUTION CONTEXT
// =============================================================================

function demonstrateExecutionContext() {
  console.log(chalk.yellow.bold('\n2. JAVASCRIPT RUNTIME & EXECUTION CONTEXT'));
  console.log(chalk.gray('─'.repeat(50)));
  
  console.log(chalk.blue('\nExecution Context Demo:'));
  
  // Global execution context
  var globalVar = 'Global scope';
  
  function demonstrateContext() {
    console.log(chalk.cyan('1. Function execution context created'));
    
    // Hoisting demonstration
    console.log(chalk.green('Hoisted var (undefined):'), hoistedVar);
    var hoistedVar = 'Now defined';
    console.log(chalk.green('After assignment:'), hoistedVar);
    
    // Let and const (temporal dead zone)
    try {
      console.log(letVar); // ReferenceError
    } catch (e) {
      console.log(chalk.red('Temporal Dead Zone error:'), e.message);
    }
    
    let letVar = 'Let variable';
    const constVar = 'Const variable';
    
    console.log(chalk.green('Let variable:'), letVar);
    console.log(chalk.green('Const variable:'), constVar);
    
    // Call stack demonstration
    function first() {
      console.log(chalk.yellow('First function'));
      second();
    }
    
    function second() {
      console.log(chalk.yellow('Second function'));
      third();
    }
    
    function third() {
      console.log(chalk.yellow('Third function'));
      console.log(chalk.cyan('Call stack: third -> second -> first -> demonstrateContext'));
    }
    
    first();
  }
  
  demonstrateContext();
  
  // Event loop demonstration (simplified)
  console.log(chalk.blue('\nEvent Loop Demo:'));
  console.log(chalk.cyan('Synchronous 1'));
  
  setTimeout(() => {
    console.log(chalk.magenta('Async timeout (macro task)'));
  }, 0);
  
  Promise.resolve().then(() => {
    console.log(chalk.green('Promise (micro task)'));
  });
  
  console.log(chalk.cyan('Synchronous 2'));
}

// =============================================================================
// 3. NODE.JS ARCHITECTURE AND EVENT-DRIVEN MODEL
// =============================================================================

function demonstrateNodeJS() {
  console.log(chalk.yellow.bold('\n3. NODE.JS ARCHITECTURE'));
  console.log(chalk.gray('─'.repeat(50)));
  
  console.log(chalk.blue('\nNode.js Environment:'));
  
  // Process information
  console.log(chalk.green('Node.js Version:'), process.version);
  console.log(chalk.green('Platform:'), process.platform);
  console.log(chalk.green('Architecture:'), process.arch);
  console.log(chalk.green('Process ID:'), process.pid);
  console.log(chalk.green('Memory Usage:'), JSON.stringify(process.memoryUsage(), null, 2));
  console.log(chalk.green('Uptime:'), `${process.uptime().toFixed(2)} seconds`);
  
  // Environment variables
  console.log(chalk.green('NODE_ENV:'), process.env.NODE_ENV || 'not set');
  console.log(chalk.green('PATH length:'), process.env.PATH?.length || 0);
  
  // Command line arguments
  console.log(chalk.green('Command line args:'), process.argv.slice(2));
  
  console.log(chalk.blue('\nEvent-Driven Model:'));
  
  // Event emitter demonstration
  const noteEvents = new EventEmitter();
  
  // Register event listeners
  noteEvents.on('noteCreated', (note) => {
    console.log(chalk.green('Event: Note created -'), note.title);
  });
  
  noteEvents.on('noteUpdated', (note) => {
    console.log(chalk.yellow('Event: Note updated -'), note.title);
  });
  
  noteEvents.on('error', (error) => {
    console.log(chalk.red('Event: Error -'), error.message);
  });
  
  // Emit events
  noteEvents.emit('noteCreated', { title: 'First Note', content: 'Content' });
  noteEvents.emit('noteUpdated', { title: 'First Note', content: 'Updated content' });
  
  console.log(chalk.blue('\nNon-blocking I/O Demo:'));
  
  async function demonstrateAsyncIO() {
    console.log(chalk.cyan('Starting async operations...'));
    
    const startTime = Date.now();
    
    // Multiple async operations
    const operations = [
      fs.readdir('.').catch(() => []),
      new Promise(resolve => setTimeout(() => resolve('Timer 1'), 100)),
      new Promise(resolve => setTimeout(() => resolve('Timer 2'), 50)),
      Promise.resolve('Immediate promise')
    ];
    
    const results = await Promise.all(operations);
    const duration = Date.now() - startTime;
    
    console.log(chalk.green('All async operations completed in'), `${duration}ms`);
    console.log(chalk.green('Directory files count:'), results[0].length);
    console.log(chalk.green('Timer results:'), results[1], results[2]);
    console.log(chalk.green('Immediate result:'), results[3]);
  }
  
  return demonstrateAsyncIO();
}

// =============================================================================
// 4. NODE.JS vs OTHER BACKEND FRAMEWORKS
// =============================================================================

function compareBackendFrameworks() {
  console.log(chalk.yellow.bold('\n4. NODE.JS vs OTHER FRAMEWORKS'));
  console.log(chalk.gray('─'.repeat(50)));
  
  const comparison = {
    'Node.js': {
      language: 'JavaScript',
      architecture: 'Event-driven, single-threaded',
      strengths: ['Fast I/O', 'JSON handling', 'Real-time apps', 'Same language as frontend'],
      weaknesses: ['CPU-intensive tasks', 'Callback complexity'],
      useCase: 'Real-time apps, APIs, microservices'
    },
    'Python/Django': {
      language: 'Python',
      architecture: 'Multi-threaded, synchronous',
      strengths: ['Rapid development', 'Rich libraries', 'Machine learning'],
      weaknesses: ['Slower I/O', 'GIL limitations'],
      useCase: 'Web apps, data science, AI'
    },
    'Java/Spring': {
      language: 'Java',
      architecture: 'Multi-threaded, JVM',
      strengths: ['Enterprise features', 'Performance', 'Scalability'],
      weaknesses: ['Complexity', 'Memory usage'],
      useCase: 'Enterprise applications, large systems'
    },
    'PHP/Laravel': {
      language: 'PHP',
      architecture: 'Process-based, synchronous',
      strengths: ['Web-focused', 'Easy deployment', 'Large community'],
      weaknesses: ['Language inconsistencies', 'Performance'],
      useCase: 'Traditional web applications, CMS'
    }
  };
  
  Object.entries(comparison).forEach(([framework, details]) => {
    console.log(chalk.blue(`\n${framework}:`));
    console.log(chalk.green('  Language:'), details.language);
    console.log(chalk.green('  Architecture:'), details.architecture);
    console.log(chalk.green('  Strengths:'), details.strengths.join(', '));
    console.log(chalk.red('  Weaknesses:'), details.weaknesses.join(', '));
    console.log(chalk.cyan('  Best for:'), details.useCase);
  });
  
  console.log(chalk.blue('\n🏆 Node.js Advantages:'));
  console.log(chalk.green('• JavaScript everywhere (frontend + backend)'));
  console.log(chalk.green('• Excellent for I/O intensive applications'));
  console.log(chalk.green('• Large npm ecosystem'));
  console.log(chalk.green('• Fast development cycle'));
  console.log(chalk.green('• JSON-first approach'));
  console.log(chalk.green('• Perfect for APIs and microservices'));
}

// =============================================================================
// 5. PRACTICAL TASKS COMPLETION
// =============================================================================

function demonstratePracticalTasks() {
  console.log(chalk.yellow.bold('\n5. PRACTICAL TASKS COMPLETION'));
  console.log(chalk.gray('─'.repeat(50)));
  
  console.log(chalk.blue('\n✅ Development Environment:'));
  console.log(chalk.green('• Node.js installed:'), process.version);
  console.log(chalk.green('• NPM available:'), 'Yes (package.json configured)');
  console.log(chalk.green('• ES Modules enabled:'), 'Yes (type: module)');
  console.log(chalk.green('• Dependencies installed:'), 'chalk, dotenv, ora, etc.');
  
  console.log(chalk.blue('\n✅ JavaScript Functions:'));
  console.log(chalk.green('• Closures demonstrated:'), 'Counter factory, module pattern');
  console.log(chalk.green('• Higher-order functions:'), 'withLogging, createMultiplier, compose');
  console.log(chalk.green('• Scope examples:'), 'Global, function, block scope');
  console.log(chalk.green('• Modern features:'), 'Arrow functions, destructuring, template literals');
  
  console.log(chalk.blue('\n✅ Node.js Script:'));
  console.log(chalk.green('• Console operations:'), 'Logging, formatting, colors');
  console.log(chalk.green('• File system:'), 'Reading directories, async I/O');
  console.log(chalk.green('• Process information:'), 'Environment, memory, uptime');
  console.log(chalk.green('• Event system:'), 'EventEmitter, custom events');
  
  console.log(chalk.blue('\n✅ REPL Exploration Guide:'));
  console.log(chalk.cyan('To explore Node.js REPL:'));
  console.log(chalk.gray('1. Type "node" in terminal'));
  console.log(chalk.gray('2. Try: process.version'));
  console.log(chalk.gray('3. Try: global'));
  console.log(chalk.gray('4. Try: require("os").cpus().length'));
  console.log(chalk.gray('5. Try: console.log("Hello from REPL!")'));
  console.log(chalk.gray('6. Type ".help" for REPL commands'));
  console.log(chalk.gray('7. Type ".exit" to quit'));
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function runFundamentalsLab() {
  try {
    demonstrateFunctions();
    demonstrateDataStructures();
    demonstrateClosures();
    demonstrateHigherOrderFunctions();
    demonstrateExecutionContext();
    await demonstrateNodeJS();
    compareBackendFrameworks();
    demonstratePracticalTasks();
    
    console.log(chalk.green.bold('\nJavaScript & Node.js Fundamentals Complete!'));
    console.log(chalk.cyan('\nNext Steps:'));
    console.log(chalk.gray('• Practice with the note manager: npm start'));
    console.log(chalk.gray('• Explore Node.js REPL: node'));
    console.log(chalk.gray('• Try the original lab: npm run lab1'));
    console.log(chalk.gray('• Read Node.js docs: https://nodejs.org/docs/'));
    
  } catch (error) {
    console.error(chalk.red('Error running fundamentals lab:'), error.message);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runFundamentalsLab();
}

export {
  demonstrateFunctions,
  demonstrateDataStructures,
  demonstrateClosures,
  demonstrateHigherOrderFunctions,
  demonstrateExecutionContext,
  demonstrateNodeJS,
  compareBackendFrameworks,
  runFundamentalsLab
};
