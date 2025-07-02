import chalk from 'chalk';
import { searchNotesByKeyword } from '../utils/fileHandler.js';

/**
 * Searches notes by keyword in title or body
 * @param {string} keyword - The keyword to search for
 */
export async function searchNotes(keyword) {
  try {
    const matchingNotes = await searchNotesByKeyword(keyword);
    
    if (matchingNotes.length === 0) {
      console.log(chalk.yellow(`No notes found containing "${keyword}"`));
      console.log(chalk.gray('Try a different search term or use "npm start list" to see all notes.'));
      return;
    }
    
    console.log(chalk.blue.bold(`\nFound ${matchingNotes.length} note(s) containing "${keyword}":\n`));
    
    matchingNotes.forEach((note, index) => {
      console.log(chalk.cyan(`${index + 1}. ${note.title}`));
      
      // Show a preview of the body with highlighted search term
      const bodyPreview = note.body.length > 100 
        ? note.body.substring(0, 100) + '...' 
        : note.body;
      
      // Highlight the search term in the preview
      const highlightedPreview = bodyPreview.replace(
        new RegExp(keyword, 'gi'),
        chalk.bgYellow.black('$&')
      );
      
      console.log(chalk.white(`   ${highlightedPreview}`));
      console.log(chalk.gray(`   Created: ${new Date(note.createdAt).toLocaleDateString()}`));
      console.log(); // Empty line for spacing
    });
    
    console.log(chalk.gray(`Use "npm start read <title>" to view the full note.`));
    
  } catch (error) {
    console.error(chalk.red('Failed to search notes:'), error.message);
    throw error;
  }
}
