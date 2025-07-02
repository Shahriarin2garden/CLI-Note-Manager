import chalk from 'chalk';
import { removeNoteByTitle } from '../utils/fileHandler.js';

/**
 * Removes a note by title
 * @param {string} title - The title of the note to remove
 */
export async function removeNote(title) {
  try {
    const wasRemoved = await removeNoteByTitle(title);
    
    if (wasRemoved) {
      console.log(chalk.green(`✓ Note "${title}" removed successfully!`));
    } else {
      console.log(chalk.red(`Note "${title}" not found!`));
      console.log(chalk.yellow('Use "npm start list" to see available notes.'));
    }
    
  } catch (error) {
    console.error(chalk.red('Failed to remove note:'), error.message);
    throw error;
  }
}
