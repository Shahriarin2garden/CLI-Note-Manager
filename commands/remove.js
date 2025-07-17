import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import chalk from 'chalk';

const fileHandler = new AdvancedFileHandler();

export async function removeNote(title) {
  try {
    if (!title) {
      console.log(chalk.red('Error: Note title is required'));
      return false;
    }

    const notes = await fileHandler.readNotes(true);
    const noteIndex = notes.findIndex(note => 
      note.title.toLowerCase() === title.toLowerCase()
    );
    
    if (noteIndex === -1) {
      console.log(chalk.yellow(`Note "${title}" not found`));
      return false;
    }

    const removedNote = notes[noteIndex];
    notes.splice(noteIndex, 1);
    
    await fileHandler.writeNotes(notes);
    
    console.log(chalk.green(`✓ Note "${removedNote.title}" removed successfully!`));
    return true;

  } catch (error) {
    console.log(chalk.red(`Error removing note: ${error.message}`));
    return false;
  }
}
