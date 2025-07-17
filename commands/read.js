import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import chalk from 'chalk';

const fileHandler = new AdvancedFileHandler();

export async function readNote(title) {
  try {
    if (!title) {
      console.log(chalk.red('Error: Note title is required'));
      return;
    }

    const note = await fileHandler.findNote({ title });
    
    if (!note) {
      console.log(chalk.yellow(`Note "${title}" not found`));
      return;
    }

    const date = new Date(note.createdAt).toLocaleDateString();
    const updatedDate = new Date(note.updatedAt).toLocaleDateString();
    
    console.log(chalk.cyan.bold(`\n📖 ${note.title}`));
    console.log('═'.repeat(60));
    console.log(note.body);
    console.log('\n' + '─'.repeat(60));
    console.log(chalk.gray(`📁 Category: ${note.category || 'General'}`));
    console.log(chalk.gray(`📅 Created: ${date}`));
    
    if (note.createdAt !== note.updatedAt) {
      console.log(chalk.gray(`📝 Updated: ${updatedDate}`));
    }
    
    if (note.tags && note.tags.length > 0) {
      console.log(chalk.gray(`🏷️ Tags: ${note.tags.join(', ')}`));
    }
    
    if (note.metadata) {
      if (note.metadata.wordCount) {
        console.log(chalk.gray(`📊 Words: ${note.metadata.wordCount} • Reading time: ${note.metadata.readingTime} min`));
      }
      
      if (note.metadata.sentiment) {
        const moodEmoji = {
          'very positive': '😄',
          'positive': '😊',
          'neutral': '😐',
          'negative': '😔',
          'very negative': '😢'
        };
        console.log(chalk.gray(`💭 Mood: ${moodEmoji[note.metadata.sentiment.mood]} ${note.metadata.sentiment.mood}`));
      }
    }

  } catch (error) {
    console.log(chalk.red(`Error reading note: ${error.message}`));
  }
}
