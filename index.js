#!/usr/bin/env node

import dotenv from 'dotenv';
import chalk from 'chalk';
import { addNote } from './commands/add.js';
import { listNotes } from './commands/list.js';
import { readNote } from './commands/read.js';
import { removeNote } from './commands/remove.js';
import { searchNotes } from './commands/search.js';

// Load environment variables
dotenv.config();

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Display help if no command provided
if (!command) {
  console.log(chalk.blue.bold('CLI Note Manager'));
  console.log(chalk.cyan('\nUsage:'));
  console.log('  npm start add <title> <body>     - Add a new note');
  console.log('  npm start list                   - List all notes');
  console.log('  npm start read <title>           - Read a specific note');
  console.log('  npm start remove <title>         - Remove a note');
  console.log('  npm start search <term>          - Search notes by keyword');
  console.log(chalk.cyan('\nLab Exercises:'));
  console.log('  npm run lab1                     - Run Lab 1 exercises');
  process.exit(0);
}

// Execute commands
try {
  switch (command) {
    case 'add':
      if (args.length < 3) {
        console.log(chalk.red('Error: Please provide both title and body'));
        console.log(chalk.yellow('Usage: npm start add <title> <body>'));
        process.exit(1);
      }
      await addNote(args[1], args.slice(2).join(' '));
      break;

    case 'list':
      await listNotes();
      break;

    case 'read':
      if (args.length < 2) {
        console.log(chalk.red('Error: Please provide a note title'));
        console.log(chalk.yellow('Usage: npm start read <title>'));
        process.exit(1);
      }
      await readNote(args[1]);
      break;

    case 'remove':
      if (args.length < 2) {
        console.log(chalk.red('Error: Please provide a note title'));
        console.log(chalk.yellow('Usage: npm start remove <title>'));
        process.exit(1);
      }
      await removeNote(args[1]);
      break;

    case 'search':
      if (args.length < 2) {
        console.log(chalk.red('Error: Please provide a search term'));
        console.log(chalk.yellow('Usage: npm start search <term>'));
        process.exit(1);
      }
      await searchNotes(args[1]);
      break;

    default:
      console.log(chalk.red(`Unknown command: ${command}`));
      console.log(chalk.yellow('Run without arguments to see available commands'));
      process.exit(1);
  }
} catch (error) {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
}
