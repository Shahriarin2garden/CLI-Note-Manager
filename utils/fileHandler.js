import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

const NOTES_FILE_PATH = process.env.NOTES_FILE_PATH || './data/notes.json';

/**
 * Ensures the data directory exists
 */
async function ensureDataDirectory() {
  const dir = path.dirname(NOTES_FILE_PATH);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

/**
 * Reads notes from the JSON file
 * @returns {Promise<Array>} Array of notes
 */
export async function readNotes() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(NOTES_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    throw new Error(`Failed to read notes: ${error.message}`);
  }
}

/**
 * Writes notes to the JSON file
 * @param {Array} notes - Array of notes to write
 */
export async function writeNotes(notes) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(NOTES_FILE_PATH, JSON.stringify(notes, null, 2));
  } catch (error) {
    throw new Error(`Failed to write notes: ${error.message}`);
  }
}

/**
 * Finds a note by title
 * @param {string} title - The title to search for
 * @returns {Promise<Object|null>} The found note or null
 */
export async function findNoteByTitle(title) {
  const notes = await readNotes();
  return notes.find(note => note.title.toLowerCase() === title.toLowerCase()) || null;
}

/**
 * Removes a note by title
 * @param {string} title - The title of the note to remove
 * @returns {Promise<boolean>} True if note was removed, false if not found
 */
export async function removeNoteByTitle(title) {
  const notes = await readNotes();
  const initialLength = notes.length;
  const filteredNotes = notes.filter(note => note.title.toLowerCase() !== title.toLowerCase());
  
  if (filteredNotes.length < initialLength) {
    await writeNotes(filteredNotes);
    return true;
  }
  return false;
}

/**
 * Searches notes by keyword in title or body
 * @param {string} keyword - The keyword to search for
 * @returns {Promise<Array>} Array of matching notes
 */
export async function searchNotesByKeyword(keyword) {
  const notes = await readNotes();
  const searchTerm = keyword.toLowerCase();
  
  return notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm) || 
    note.body.toLowerCase().includes(searchTerm)
  );
}
