#!/usr/bin/env node

import dotenv from 'dotenv';
import chalk from 'chalk';
import ora from 'ora';

// Import enhanced commands
import { addNote } from './commands/add.js';
import { listNotes } from './commands/list.js';
import { readNote } from './commands/read.js';
import { removeNote } from './commands/remove.js';
import { searchNotes } from './commands/search.js';

// Load environment variables
dotenv.config();

// Simple startup banner
function displayBanner() {
  console.clear();
  console.log(chalk.cyan.bold('TELEMED NOTES v2.0'));
  console.log(chalk.gray('AI-Powered Note Manager\n'));
}

// Enhanced help display
function displayHelp() {
  displayBanner();
  
  console.log(chalk.yellow.bold('BASIC OPERATIONS:'));
  console.log('  ' + chalk.cyan('add') + ' <title> <body>     - Add a new note');
  console.log('  ' + chalk.cyan('list') + ' [category]        - List notes');
  console.log('  ' + chalk.cyan('read') + ' <title>           - Read a note');
  console.log('  ' + chalk.cyan('remove') + ' <title>         - Remove a note');
  console.log('  ' + chalk.cyan('search') + ' <term>          - Search notes');
  
  console.log(chalk.yellow.bold('\nPRODUCTIVITY:'));
  console.log('  ' + chalk.green('quick') + ' <text>           - Quick note');
  console.log('  ' + chalk.green('daily') + '                 - Daily journal');
  console.log('  ' + chalk.green('analytics') + '             - View stats');
  console.log('  ' + chalk.green('tui') + '                   - Interactive mode');
  
  console.log(chalk.yellow.bold('\nADVANCED:'));
  console.log('  ' + chalk.magenta('analyze') + ' <title>       - AI analysis');
  console.log('  ' + chalk.magenta('export') + ' <format>       - Export notes');
  console.log('  ' + chalk.magenta('share') + ' <note>          - Share notes');
  console.log('  ' + chalk.magenta('server') + '                - Start API server');
  
  console.log(chalk.yellow.bold('\nEDUCATION:'));
  console.log('  ' + chalk.blue('learn') + '                  - JavaScript & Node.js fundamentals');
  console.log('  ' + chalk.blue('lab1') + '                   - Original lab exercise');
  
  console.log(chalk.gray('\nExamples:'));
  console.log(chalk.gray('  npm start add "Meeting" "Project discussion"'));
  console.log(chalk.gray('  npm start quick "Call client"'));
  console.log(chalk.gray('  npm start search "project"'));
  console.log(chalk.gray('  npm start learn                # Core concepts'));
  console.log(chalk.gray('  npm start lab1                 # Lab exercise'));
  
  console.log(chalk.gray('\nLab: npm run lab1'));
  console.log(chalk.gray('  npm start list Work'));
  
  console.log(chalk.gray('\nLab Exercises: npm run lab1'));
  console.log(chalk.gray('Advanced Features: Use individual commands listed above\n'));
}

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

// Display help if no command provided
if (!command) {
  displayHelp();
  process.exit(0);
}

// Execute commands with enhanced error handling
async function executeCommand() {
  const startTime = Date.now();
  console.log(chalk.cyan('Processing...'));

  try {
    switch (command) {
      // Basic operations (enhanced)
      case 'add':
        if (args.length < 3) {
          console.log(chalk.red('Error: Please provide both title and body'));
          console.log(chalk.yellow('Usage: npm start add <title> <body>'));
          console.log(chalk.gray('Example: npm start add "My Note" "This is the content"'));
          process.exit(1);
        }
        console.log(chalk.cyan('Adding note...'));
        await addNote(args[1], args.slice(2).join(' '), { 
          aiEnhanced: true,
          generateTags: true 
        });
        break;

      case 'list':
        await listNotes(args[1]); // category filter
        break;

      case 'read':
        if (args.length < 2) {
          console.log(chalk.red('Error: Please provide a note title'));
          console.log(chalk.yellow('Usage: npm start read <title>'));
          process.exit(1);
        }
        await readNote(args[1], { enhanced: true });
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
        await searchNotes(args[1], { 
          aiPowered: true,
          showSimilarity: true 
        });
        break;

      // Quick productivity features
      case 'quick':
        if (args.length < 2) {
          console.log(chalk.red('Error: Please provide note content'));
          console.log(chalk.yellow('Usage: npm start quick "your note content"'));
          process.exit(1);
        }
        const quickTitle = `Quick Note ${new Date().toLocaleString()}`;
        console.log(chalk.cyan('Creating quick note...'));
        await addNote(quickTitle, args.slice(1).join(' '), { 
          aiEnhanced: true,
          quick: true 
        });
        break;

      case 'daily':
        const today = new Date().toDateString();
        const dailyTitle = `Daily Journal - ${today}`;
        const template = '## Daily Reflection\n\n### What went well:\n\n### What could improve:\n\n### Tomorrow\'s goals:\n\n';
        console.log(chalk.cyan('Creating daily journal...'));
        await addNote(dailyTitle, template, { 
          category: 'Journal',
          aiEnhanced: true 
        });
        break;

      // Advanced features (placeholders for now)
      case 'analytics':
        console.log(chalk.blue.bold('\nAnalytics Dashboard'));
        console.log(chalk.yellow('Coming soon! This will show:'));
        console.log(chalk.gray('• Note statistics and trends'));
        console.log(chalk.gray('• Writing patterns analysis'));
        console.log(chalk.gray('• Productivity insights'));
        console.log(chalk.gray('• AI-powered recommendations'));
        break;

      case 'tui':
        console.log(chalk.blue.bold('\nInteractive TUI Mode'));
        console.log(chalk.yellow('Coming soon! Features:'));
        console.log(chalk.gray('• Beautiful terminal interface'));
        console.log(chalk.gray('• Mouse and keyboard navigation'));
        console.log(chalk.gray('• Real-time note editing'));
        console.log(chalk.gray('• Visual analytics dashboard'));
        break;

      case 'analyze':
        console.log(chalk.blue.bold('\nAI Analysis'));
        console.log(chalk.yellow('Coming soon! Will provide:'));
        console.log(chalk.gray('• Sentiment analysis'));
        console.log(chalk.gray('• Topic extraction'));
        console.log(chalk.gray('• Similar note detection'));
        console.log(chalk.gray('• Content insights'));
        break;

      case 'export':
        console.log(chalk.blue.bold('\nExport Features'));
        console.log(chalk.yellow('Coming soon! Export formats:'));
        console.log(chalk.gray('• PDF with beautiful formatting'));
        console.log(chalk.gray('• HTML with responsive design'));
        console.log(chalk.gray('• Markdown for documentation'));
        console.log(chalk.gray('• JSON for data backup'));
        break;

      case 'share':
        console.log(chalk.blue.bold('\nSharing Features'));
        console.log(chalk.yellow('Coming soon! Share via:'));
        console.log(chalk.gray('• QR codes for mobile access'));
        console.log(chalk.gray('• Secure temporary links'));
        console.log(chalk.gray('• Email integration'));
        console.log(chalk.gray('• Cloud storage sync'));
        break;

      case 'server':
        console.log(chalk.blue.bold('\nWeb API Server'));
        console.log(chalk.yellow('Coming soon! Features:'));
        console.log(chalk.gray('• RESTful API endpoints'));
        console.log(chalk.gray('• Web interface'));
        console.log(chalk.gray('• Real-time collaboration'));
        console.log(chalk.gray('• Mobile-friendly design'));
        break;

      // Education commands
      case 'learn':
        console.log(chalk.blue.bold('\nStarting JavaScript & Node.js Fundamentals...'));
        const { runFundamentalsLab } = await import('./labs/fundamentals.js');
        await runFundamentalsLab();
        break;

      case 'lab1':
        console.log(chalk.blue.bold('\nStarting Original Lab Exercise...'));
        const { runLab1 } = await import('./labs/lab1.js');
        await runLab1();
        break;

      // Help and version
      case 'help':
      case '--help':
      case '-h':
        displayHelp();
        break;

      case 'version':
      case '--version':
      case '-v':
        console.log(chalk.cyan.bold('TeleMed Notes v2.0.0'));
        console.log(chalk.gray('Advanced AI-powered note management system'));
        console.log(chalk.gray(`Node.js: ${process.version}`));
        console.log(chalk.gray(`Platform: ${process.platform}`));
        break;

      default:
        console.log(chalk.red(`Unknown command: ${command}`));
        console.log(chalk.yellow('Available commands:'));
        console.log(chalk.gray('• Basic: add, list, read, remove, search'));
        console.log(chalk.gray('• Quick: quick, daily'));
        console.log(chalk.gray('• Advanced: analytics, tui, analyze, export, share, server'));
        console.log(chalk.gray('• Education: learn, lab1'));
        console.log(chalk.gray('\nRun "npm start help" for detailed usage information'));
        process.exit(1);
    }
    
    const duration = Date.now() - startTime;
    console.log(chalk.green(`\nCompleted in ${duration}ms`));
    
  } catch (error) {
    console.log(chalk.red('Operation failed'));
    console.error(chalk.red('Error:'), error.message);
    
    if (process.env.NODE_ENV === 'development') {
      console.error(chalk.gray(error.stack));
    }
    
    console.log(chalk.yellow('\nTroubleshooting:'));
    console.log(chalk.gray('• Check your command syntax'));
    console.log(chalk.gray('• Ensure all required parameters are provided'));
    console.log(chalk.gray('• Try running with --help for usage information'));
    process.exit(1);
  }
}

// Run the command
executeCommand();
