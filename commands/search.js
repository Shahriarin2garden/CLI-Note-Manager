import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import chalk from 'chalk';

const fileHandler = new AdvancedFileHandler();

export async function searchNotes(term, options = {}) {
  try {
    if (!term) {
      console.log(chalk.red('Error: Search term is required'));
      return;
    }

    const results = await fileHandler.searchNotes(term, {
      searchIn: ['title', 'body', 'tags'],
      caseSensitive: false,
      ...options
    });
    
    if (results.length === 0) {
      console.log(chalk.yellow(`No notes found for: "${term}"`));
      console.log(chalk.gray('Try different keywords or check spelling'));
      return;
    }

    console.log(chalk.cyan.bold(`\n🔍 Search Results for "${term}" (${results.length} found):`));
    console.log('─'.repeat(60));

    results.forEach((note, index) => {
      const date = new Date(note.createdAt).toLocaleDateString();
      const preview = note.body.length > 100 ? note.body.substring(0, 97) + '...' : note.body;
      
      // Highlight search term in preview (simple approach)
      const highlightedPreview = preview.replace(
        new RegExp(term, 'gi'), 
        chalk.yellow.bold(`$&`)
      );
      
      console.log(chalk.cyan(`${index + 1}. ${note.title}`));
      console.log(`   ${highlightedPreview}`);
      console.log(chalk.gray(`   📁 ${note.category || 'General'} • 📅 ${date}`));
      
      if (note.tags && note.tags.length > 0) {
        console.log(chalk.gray(`   🏷️ ${note.tags.slice(0, 3).join(', ')}`));
      }
      
      console.log();
    });

  } catch (error) {
    console.log(chalk.red(`Error searching notes: ${error.message}`));
  }
}
