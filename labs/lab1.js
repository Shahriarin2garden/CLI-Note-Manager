#!/usr/bin/env node

import chalk from 'chalk';

console.log(chalk.blue.bold('🚀 Lab 1: JavaScript Fundamentals & Node.js Basics\n'));

// Node.js Basics
console.log(chalk.cyan.bold('=== Node.js Environment Information ==='));
console.log(chalk.green(`Node.js Version: ${process.version}`));
console.log(chalk.green(`Platform: ${process.platform}`));
console.log(chalk.green(`Architecture: ${process.arch}`));
console.log(chalk.green(`Process ID: ${process.pid}`));
console.log(chalk.yellow('💡 Tip: You can explore the Node.js REPL by running "node" in your terminal\n'));

// Closures Demo
console.log(chalk.cyan.bold('=== Closures & Higher-Order Functions ==='));

/**
 * Creates a command parser with a specific prefix
 * Demonstrates closures by capturing the prefix in the returned function
 * @param {string} prefix - The prefix to add to commands
 * @returns {function} A function that parses commands with the given prefix
 */
function createCommandParser(prefix) {
  // This variable is captured in the closure
  const commandPrefix = prefix.toUpperCase();
  
  // Return a function that has access to commandPrefix
  return function(command, ...args) {
    const fullCommand = `${commandPrefix}: ${command}`;
    const result = {
      prefix: commandPrefix,
      command: command,
      args: args,
      fullCommand: fullCommand,
      timestamp: new Date().toISOString()
    };
    
    console.log(chalk.magenta(`📝 ${fullCommand}`));
    if (args.length > 0) {
      console.log(chalk.gray(`   Args: ${args.join(', ')}`));
    }
    console.log(chalk.gray(`   Timestamp: ${result.timestamp}`));
    
    return result;
  };
}

// Demonstrate closure usage
const noteParser = createCommandParser('NOTE');
const taskParser = createCommandParser('TASK');

console.log(chalk.yellow('\n🔄 Testing command parsers with closures:'));
noteParser('add', 'Shopping List', 'Buy groceries for dinner');
taskParser('create', 'Lab Assignment', 'Complete JavaScript exercises');
noteParser('search', 'groceries');

/**
 * Higher-order function that wraps another function with logging
 * @param {function} fn - The function to wrap
 * @returns {function} The wrapped function with logging
 */
function withLogging(fn) {
  return function(...args) {
    const startTime = Date.now();
    console.log(chalk.blue(`🔍 Calling function: ${fn.name || 'anonymous'}`));
    console.log(chalk.gray(`   Arguments: [${args.map(arg => typeof arg === 'string' ? `"${arg}"` : arg).join(', ')}]`));
    
    try {
      const result = fn.apply(this, args);
      const endTime = Date.now();
      console.log(chalk.green(`✅ Function completed successfully in ${endTime - startTime}ms`));
      return result;
    } catch (error) {
      const endTime = Date.now();
      console.log(chalk.red(`❌ Function failed after ${endTime - startTime}ms: ${error.message}`));
      throw error;
    }
  };
}

// Demo functions to wrap with logging
function calculateSum(a, b) {
  return a + b;
}

function formatNote(title, body) {
  return `Title: ${title}\nBody: ${body}\nCreated: ${new Date().toLocaleString()}`;
}

function simulateAsyncOperation(delay = 100) {
  // Simulate some processing time
  const start = Date.now();
  while (Date.now() - start < delay) {
    // Busy wait
  }
  return `Completed after ${delay}ms`;
}

// Wrap functions with logging
const loggedSum = withLogging(calculateSum);
const loggedFormat = withLogging(formatNote);
const loggedAsync = withLogging(simulateAsyncOperation);

console.log(chalk.yellow('\n📊 Testing higher-order function with logging:'));

// Test the wrapped functions
console.log(chalk.white(`Sum result: ${loggedSum(15, 27)}`));
console.log();

const formattedNote = loggedFormat('My First Note', 'This is the content of my first note.');
console.log(chalk.white('Formatted note:'));
console.log(chalk.gray(formattedNote));
console.log();

loggedAsync(150);

// Advanced Closure Example: Counter Factory
console.log(chalk.cyan.bold('\n=== Advanced Closure Example: Counter Factory ==='));

function createCounter(initialValue = 0, step = 1) {
  let count = initialValue;
  
  return {
    increment() {
      count += step;
      return count;
    },
    decrement() {
      count -= step;
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

const noteCounter = createCounter(0, 1);
const priorityCounter = createCounter(100, 10);

console.log(chalk.yellow('🔢 Testing counter factories:'));
console.log(chalk.white(`Note counter: ${noteCounter.increment()} → ${noteCounter.increment()} → ${noteCounter.getValue()}`));
console.log(chalk.white(`Priority counter: ${priorityCounter.increment()} → ${priorityCounter.increment()} → ${priorityCounter.getValue()}`));
console.log(chalk.white(`After reset - Note counter: ${noteCounter.reset()}`));

// Function Composition Example
console.log(chalk.cyan.bold('\n=== Function Composition ==='));

const compose = (...fns) => (value) => fns.reduceRight((acc, fn) => fn(acc), value);

const addExclamation = (str) => str + '!';
const makeUpperCase = (str) => str.toUpperCase();
const addPrefix = (str) => `NOTE: ${str}`;

const processTitle = compose(addExclamation, makeUpperCase, addPrefix);

console.log(chalk.yellow('🔄 Testing function composition:'));
const originalTitle = 'my important reminder';
const processedTitle = processTitle(originalTitle);
console.log(chalk.white(`"${originalTitle}" → "${processedTitle}"`));

// Practical Example: Note Validator Factory
console.log(chalk.cyan.bold('\n=== Practical Example: Note Validator Factory ==='));

function createNoteValidator(minTitleLength = 3, maxTitleLength = 100, minBodyLength = 10) {
  return function validateNote(title, body) {
    const errors = [];
    
    if (!title || title.trim().length < minTitleLength) {
      errors.push(`Title must be at least ${minTitleLength} characters long`);
    }
    
    if (title && title.trim().length > maxTitleLength) {
      errors.push(`Title must be no more than ${maxTitleLength} characters long`);
    }
    
    if (!body || body.trim().length < minBodyLength) {
      errors.push(`Body must be at least ${minBodyLength} characters long`);
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors,
      title: title?.trim(),
      body: body?.trim()
    };
  };
}

const strictValidator = createNoteValidator(5, 50, 20);
const lenientValidator = createNoteValidator(1, 200, 5);

console.log(chalk.yellow('✅ Testing note validators:'));

const testNote1 = strictValidator('Hi', 'Short note');
const testNote2 = lenientValidator('Hi', 'Short note');
const testNote3 = strictValidator('My Important Meeting Notes', 'Today we discussed the quarterly budget and decided to increase spending on development tools.');

console.log(chalk.white(`Strict validation - Short note: ${testNote1.isValid ? '✅ Valid' : '❌ Invalid'}`));
if (!testNote1.isValid) {
  testNote1.errors.forEach(error => console.log(chalk.red(`  - ${error}`)));
}

console.log(chalk.white(`Lenient validation - Short note: ${testNote2.isValid ? '✅ Valid' : '❌ Invalid'}`));

console.log(chalk.white(`Strict validation - Long note: ${testNote3.isValid ? '✅ Valid' : '❌ Invalid'}`));

console.log(chalk.green.bold('\n🎉 Lab 1 exercises completed successfully!'));
console.log(chalk.cyan('\n💡 Key Concepts Demonstrated:'));
console.log(chalk.white('  • Closures: Functions that capture variables from their outer scope'));
console.log(chalk.white('  • Higher-order functions: Functions that take or return other functions'));
console.log(chalk.white('  • Function composition: Combining simple functions to build complex operations'));
console.log(chalk.white('  • Factory patterns: Using closures to create specialized functions'));
console.log(chalk.white('  • Node.js environment: Accessing process information and understanding the runtime'));

console.log(chalk.yellow('\n🚀 Next Steps:'));
console.log(chalk.white('  • Try the note manager: npm start'));
console.log(chalk.white('  • Add some notes: npm start add "My Title" "My note content"'));
console.log(chalk.white('  • Explore the Node.js REPL: node'));
console.log(chalk.white('  • Read about closures: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures'));
