import chalk from 'chalk';
import { findNoteByTitle } from '../utils/fileHandler.js';

/**
 * Reads and displays a specific note
 * @param {string} title - The title of the note to read
 */
export async function readNote(title) {
  try {
    const note = await findNoteByTitle(title);
    
    if (!note) {
      console.log(chalk.red(`Note "${title}" not found!`));
      console.log(chalk.yellow('Use "npm start list" to see available notes.'));
      return;
    }
    
    console.log(chalk.blue.bold('\n' + '='.repeat(50)));
    console.log(chalk.cyan.bold(`Title: ${note.title}`));
    console.log(chalk.blue.bold('='.repeat(50)));
    console.log(chalk.white(note.body));
    console.log(chalk.blue.bold('='.repeat(50)));
    console.log(chalk.gray(`Created: ${new Date(note.createdAt).toLocaleString()}`));
    if (note.updatedAt !== note.createdAt) {
      console.log(chalk.gray(`Updated: ${new Date(note.updatedAt).toLocaleString()}`));
    }
    console.log(chalk.blue.bold('='.repeat(50) + '\n'));
    
  } catch (error) {
    console.error(chalk.red('Failed to read note:'), error.message);
    throw error;
  }
}
