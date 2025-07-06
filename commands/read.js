import chalk from 'chalk';
import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import aiAnalyzer from '../utils/aiAnalyzer.js';

const fileHandler = new AdvancedFileHandler();

/**
 * Enhanced read function with AI insights and beautiful formatting
 * @param {string} title - The title of the note to read
 * @param {object} options - Display options
 */
export async function readNote(title, options = {}) {
  try {
    const { enhanced = false } = options;
    
    const note = await fileHandler.findNote({ title });
    
    if (!note) {
      console.log(chalk.red(`Note "${title}" not found.`));
      
      // Suggest similar titles
      const notes = await fileHandler.readNotes(true);
      const similarTitles = notes
        .map(n => n.title)
        .filter(t => t.toLowerCase().includes(title.toLowerCase()))
        .slice(0, 3);
      
      if (similarTitles.length > 0) {
        console.log(chalk.yellow('\n🔍 Did you mean:'));
        similarTitles.forEach(similarTitle => {
          console.log(chalk.gray(`   • ${similarTitle}`));
        });
      } else {
        console.log(chalk.gray('\nTip: Use "npm start list" to see all available notes'));
      }
      return;
    }

    // Beautiful header
    console.log('\n' + '═'.repeat(80));
    
    // Title with sentiment
    let displayTitle = note.title;
    if (note.metadata?.sentiment) {
      const moodEmoji = {
        'very positive': '[+]',
        'positive': '[+]',
        'neutral': '[=]', 
        'negative': '😔',
        'very negative': '😢'
      };
      displayTitle = `${moodEmoji[note.metadata.sentiment.mood]} ${note.title}`;
    }
    
    console.log(chalk.blue.bold(`📖 ${displayTitle}`));
    
    // Category and tags
    const categoryText = note.category ? `📁 ${note.category}` : '';
    const tagsText = note.tags && note.tags.length > 0 ? `🏷️  ${note.tags.join(', ')}` : '';
    
    if (categoryText || tagsText) {
      console.log(chalk.magenta([categoryText, tagsText].filter(Boolean).join('  •  ')));
    }
    
    // Metadata line
    const metadata = [];
    const createdDate = new Date(note.createdAt);
    metadata.push(chalk.gray(`📅 Created: ${createdDate.toLocaleDateString()} ${createdDate.toLocaleTimeString()}`));
    
    if (note.updatedAt && note.updatedAt !== note.createdAt) {
      const updatedDate = new Date(note.updatedAt);
      metadata.push(chalk.gray(`✏️  Updated: ${updatedDate.toLocaleDateString()}`));
    }
    
    if (note.metadata?.wordCount) {
      metadata.push(chalk.gray(`${note.metadata.wordCount} words`));
    }
    
    if (note.metadata?.readingTime) {
      metadata.push(chalk.gray(`⏱️  ${note.metadata.readingTime} min read`));
    }
    
    console.log(metadata.join('  •  '));
    console.log('─'.repeat(80));

    // Display content with enhanced formatting
    if (enhanced && note.body.includes('#')) {
      console.log(chalk.white(formatMarkdownLike(note.body)));
    } else {
      console.log(chalk.white(note.body));
    }
    
    console.log('─'.repeat(80));

    // Enhanced features
    if (enhanced) {
      // Show AI analysis if available
      if (note.metadata?.sentiment) {
        console.log(chalk.cyan.bold('\nAI Analysis:'));
        console.log(chalk.gray(`Sentiment: ${note.metadata.sentiment.mood} (score: ${note.metadata.sentiment.score})`));
      }
      
      // Find and show similar notes
      const notes = await fileHandler.readNotes(true);
      if (notes.length > 1) {
        const similarNotes = aiAnalyzer.findSimilarNotes(note, notes.filter(n => n.id !== note.id), 3);
        if (similarNotes.length > 0) {
          console.log(chalk.cyan.bold('\n🔗 Similar Notes:'));
          similarNotes.forEach((similarNote, index) => {
            console.log(chalk.gray(`   ${index + 1}. ${similarNote.title}`));
          });
        }
      }
    }

    console.log('═'.repeat(80) + '\n');
    
  } catch (error) {
    console.error(chalk.red('Failed to read note:'), error.message);
    throw error;
  }
}

/**
 * Simple markdown-like formatting for better readability
 */
function formatMarkdownLike(text) {
  return text
    .replace(/^# (.+)$/gm, chalk.blue.bold('📌 $1'))
    .replace(/^## (.+)$/gm, chalk.cyan.bold('▶ $1'))
    .replace(/^### (.+)$/gm, chalk.yellow.bold('  • $1'))
    .replace(/\*\*(.+?)\*\*/g, chalk.bold('$1'))
    .replace(/\*(.+?)\*/g, chalk.italic('$1'));
}
