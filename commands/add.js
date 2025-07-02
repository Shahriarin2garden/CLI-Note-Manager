import chalk from 'chalk';
import { readNotes, writeNotes, findNoteByTitle } from '../utils/fileHandler.js';

/**
 * Adds a new note
 * @param {string} title - The title of the note
 * @param {string} body - The body content of the note
 */
export async function addNote(title, body) {
  try {
    // Check if note with same title already exists
    const existingNote = await findNoteByTitle(title);
    if (existingNote) {
      console.log(chalk.red(`Note with title "${title}" already exists!`));
      return;
    }

    // Read existing notes
    const notes = await readNotes();
    
    // Create new note
    const newNote = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add new note and save
    notes.push(newNote);
    await writeNotes(notes);
    
    console.log(chalk.green(`✓ Note "${title}" added successfully!`));
  } catch (error) {
    console.error(chalk.red('Failed to add note:'), error.message);
    throw error;
  }
}
