import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import chalk from 'chalk';

const fileHandler = new AdvancedFileHandler();

export async function listNotes(category = null) {
  try {
    const notes = await fileHandler.readNotes(true);
    
    if (notes.length === 0) {
      console.log(chalk.yellow('No notes found. Create your first note!'));
      return;
    }

    let filteredNotes = notes;
    if (category) {
      filteredNotes = notes.filter(note => 
        note.category && note.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (filteredNotes.length === 0) {
      console.log(chalk.yellow(`No notes found in category: ${category}`));
      return;
    }

    console.log(chalk.cyan.bold(`\n📝 Notes${category ? ` in "${category}"` : ''} (${filteredNotes.length} total):`));
    console.log('─'.repeat(60));

    // Sort by creation date (newest first)
    filteredNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    filteredNotes.forEach((note, index) => {
      const date = new Date(note.createdAt).toLocaleDateString();
      const preview = note.body.length > 100 ? note.body.substring(0, 97) + '...' : note.body;
      
      console.log(chalk.cyan(`${index + 1}. ${note.title}`));
      console.log(`   ${preview}`);
      console.log(chalk.gray(`   📁 ${note.category || 'General'} • 📅 ${date}`));
      
      if (note.tags && note.tags.length > 0) {
        console.log(chalk.gray(`   🏷️ ${note.tags.slice(0, 3).join(', ')}`));
      }
      
      console.log();
    });

  } catch (error) {
    console.log(chalk.red(`Error listing notes: ${error.message}`));
  }
}
