import chalk from 'chalk';
import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';

const fileHandler = new AdvancedFileHandler();

/**
 * Enhanced list function with filtering and beautiful display
 * @param {string} category - Optional category filter
 * @param {object} options - Display options
 */
export async function listNotes(category = null, options = {}) {
  try {
    const notes = await fileHandler.readNotes(true);
    
    if (notes.length === 0) {
      console.log(chalk.yellow('No notes found. Create your first note with:'));
      console.log(chalk.gray('   npm start add "My First Note" "Note content here"'));
      return;
    }

    // Filter by category if specified
    let filteredNotes = notes;
    if (category) {
      filteredNotes = notes.filter(note => 
        note.category && note.category.toLowerCase() === category.toLowerCase()
      );
      
      if (filteredNotes.length === 0) {
        console.log(chalk.yellow(`No notes found in category "${category}"`));
        console.log(chalk.gray('Available categories:'));
        const categories = [...new Set(notes.map(note => note.category || 'General'))];
        categories.forEach(cat => console.log(chalk.gray(`   • ${cat}`)));
        return;
      }
    }

    // Sort notes by creation date (newest first)
    filteredNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Display header
    const title = category ? `Notes in "${category}"` : 'All Notes';
    console.log(chalk.blue.bold(`\n${title} (${filteredNotes.length} total)`));
    console.log(chalk.gray('─'.repeat(60)));

    // Group notes by category for better organization
    const groupedNotes = {};
    filteredNotes.forEach(note => {
      const cat = note.category || 'General';
      if (!groupedNotes[cat]) groupedNotes[cat] = [];
      groupedNotes[cat].push(note);
    });

    // Display notes grouped by category
    Object.entries(groupedNotes).forEach(([cat, notesInCategory]) => {
      if (!category) { // Only show category headers when not filtering
        console.log(chalk.magenta.bold(`\n${cat} (${notesInCategory.length})`));
      }
      
      notesInCategory.forEach((note, index) => {
        // Create preview of note content
        const preview = note.body.length > 80 ? 
          note.body.substring(0, 77) + '...' : 
          note.body;
        
        // Format date
        const date = new Date(note.createdAt).toLocaleDateString();
        const time = new Date(note.createdAt).toLocaleTimeString([], {
          hour: '2-digit', 
          minute: '2-digit'
        });
        
        // Note number
        const noteNum = category ? index + 1 : notes.indexOf(note) + 1;
        
        // Title with emoji based on sentiment
        let titleWithMood = note.title;
        if (note.metadata?.sentiment) {
          const moodEmoji = {
            'very positive': '[+]',
            'positive': '[+]', 
            'neutral': '[=]',
            'negative': '😔',
            'very negative': '😢'
          };
          titleWithMood = `${moodEmoji[note.metadata.sentiment.mood]} ${note.title}`;
        }
        
        console.log(chalk.cyan(`\n  ${noteNum}. ${titleWithMood}`));
        console.log(chalk.gray(`     ${preview}`));
        
        // Display metadata
        const metadata = [];
        metadata.push(chalk.blue(`${date} ${time}`));
        
        if (note.metadata?.wordCount) {
          metadata.push(chalk.green(`${note.metadata.wordCount} words`));
        }
        
        if (note.metadata?.readingTime) {
          metadata.push(chalk.yellow(`${note.metadata.readingTime}m read`));
        }
        
        if (note.tags && note.tags.length > 0) {
          const tagString = note.tags.slice(0, 3).join(', ') + 
            (note.tags.length > 3 ? ` +${note.tags.length - 3} more` : '');
          metadata.push(chalk.magenta(`${tagString}`));
        }
        
        if (note.encrypted) {
          metadata.push(chalk.red('Encrypted'));
        }
        
        console.log(chalk.gray(`     ${metadata.join(' • ')}`));
      });
    });

    // Display summary statistics
    console.log(chalk.gray('\n─'.repeat(60)));
    
    const totalWords = filteredNotes.reduce((acc, note) => 
      acc + (note.metadata?.wordCount || note.body.split(' ').length), 0
    );
    
    const totalReadingTime = filteredNotes.reduce((acc, note) => 
      acc + (note.metadata?.readingTime || Math.ceil(note.body.split(' ').length / 200)), 0
    );

    console.log(chalk.cyan('Summary:'));
    console.log(chalk.gray(`   Total notes: ${filteredNotes.length}`));
    console.log(chalk.gray(`   Total words: ${totalWords.toLocaleString()}`));
    console.log(chalk.gray(`   Total reading time: ~${totalReadingTime} minutes`));
    
    // Show available categories if not filtering
    if (!category && Object.keys(groupedNotes).length > 1) {
      console.log(chalk.gray(`   Categories: ${Object.keys(groupedNotes).join(', ')}`));
    }

    console.log(chalk.gray('\nTips:'));
    console.log(chalk.gray('   • Use "npm start read <title>" to read a specific note'));
    console.log(chalk.gray('   • Use "npm start search <term>" to search notes'));
    if (!category) {
      console.log(chalk.gray('   • Use "npm start list <category>" to filter by category'));
    }
    
  } catch (error) {
    console.error(chalk.red('Failed to list notes:'), error.message);
    throw error;
  }
}
