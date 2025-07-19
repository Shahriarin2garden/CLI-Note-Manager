#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';

// Load environment
dotenv.config();

console.log(chalk.blue(' Lab 2: Simple Node.js CLI\n'));

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
    console.error(chalk.red(' Please provide a note title'));
    return;
  }

  const notes = loadNotes();
  
  if (notes.length >= config.maxNotes) {
    console.error(chalk.red(` Maximum ${config.maxNotes} notes allowed`));
    return;
  }

  const newNote = {
    id: Date.now(),
    title: title.trim(),
    created: new Date().toISOString()
  };

  notes.push(newNote);
  
  if (saveNotes(notes)) {
    console.log(chalk.green(' Note added successfully!'));
    console.log(chalk.blue(`   ID: ${newNote.id}`));
    console.log(chalk.blue(`   Title: ${newNote.title}`));
  }
}

function listNotes() {
  const notes = loadNotes();
  
  if (notes.length === 0) {
    console.log(chalk.yellow(' No notes found'));
    return;
  }

  console.log(chalk.blue(` Found ${notes.length} notes:\n`));
  notes.forEach(note => {
    console.log(chalk.green(`[${note.id}]`) + ` ${note.title}`);
    console.log(chalk.gray(`   Created: ${new Date(note.created).toLocaleString()}\n`));
  });
}

function removeNote(id) {
  const noteId = parseInt(id);
  if (!noteId) {
    console.error(chalk.red(' Please provide a valid note ID'));
    return;
  }

  const notes = loadNotes();
  const initialLength = notes.length;
  const filteredNotes = notes.filter(note => note.id !== noteId);

  if (filteredNotes.length === initialLength) {
    console.error(chalk.red(` Note with ID ${noteId} not found`));
    return;
  }

  if (saveNotes(filteredNotes)) {
    console.log(chalk.green(` Note ${noteId} removed successfully`));
  }
}

function showHelp() {
  console.log(chalk.blue(' Available Commands:\n'));
  console.log(chalk.green('  add <title>     ') + '- Add a new note');
  console.log(chalk.green('  list            ') + '- List all notes');
  console.log(chalk.green('  remove <id>     ') + '- Remove a note by ID');
  console.log(chalk.green('  help            ') + '- Show this help');
  
  console.log(chalk.yellow('\n Examples:'));
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
