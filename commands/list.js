import chalk from 'chalk';
import { readNotes } from '../utils/fileHandler.js';

/**
 * Lists all notes
 */
export async function listNotes() {
  try {
    const notes = await readNotes();
    
    if (notes.length === 0) {
      console.log(chalk.yellow('No notes found. Add your first note!'));
      return;
    }
    
    console.log(chalk.blue.bold(`\nFound ${notes.length} note(s):\n`));
    
    notes.forEach((note, index) => {
      console.log(chalk.cyan(`${index + 1}. ${note.title}`));
      console.log(chalk.gray(`   Created: ${new Date(note.createdAt).toLocaleDateString()}`));
      if (note.updatedAt !== note.createdAt) {
        console.log(chalk.gray(`   Updated: ${new Date(note.updatedAt).toLocaleDateString()}`));
      }
      console.log(); // Empty line for spacing
    });
  } catch (error) {
    console.error(chalk.red('Failed to list notes:'), error.message);
    throw error;
  }
}
