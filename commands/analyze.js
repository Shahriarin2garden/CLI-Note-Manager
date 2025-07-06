import chalk from 'chalk';
import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import aiAnalyzer from '../utils/aiAnalyzer.js';

const fileHandler = new AdvancedFileHandler();

/**
 * AI-powered note analysis
 * @param {string} title - The title of the note to analyze
 * @param {object} options - Analysis options
 */
export async function analyzeNote(title, options = {}) {
  try {
    const { findSimilar = false, detailed = true } = options;
    
    const note = await fileHandler.findNote({ title });
    
    if (!note) {
      console.log(chalk.red(`Note "${title}" not found.`));
      return;
    }

    console.log(chalk.blue.bold(`\nAI Analysis for: "${note.title}"`));
    console.log('═'.repeat(60));

    // Sentiment Analysis
    const sentiment = aiAnalyzer.analyzeSentiment(note.body);
    const moodEmoji = {
      'very positive': '[+]',
      'positive': '[+]',
      'neutral': '[=]',
      'negative': '😔',
      'very negative': '😢'
    };

    console.log(chalk.cyan.bold('\n💭 Sentiment Analysis:'));
    console.log(chalk.white(`Mood: ${moodEmoji[sentiment.mood]} ${sentiment.mood}`));
    console.log(chalk.gray(`Score: ${sentiment.score} (${sentiment.comparative.toFixed(3)} comparative)`));
    console.log(chalk.gray(`Positive words: ${sentiment.positive.length}`));
    console.log(chalk.gray(`Negative words: ${sentiment.negative.length}`));

    // Topic Extraction
    const topics = aiAnalyzer.extractTopics(note.body);
    
    if (topics.people.length > 0) {
      console.log(chalk.cyan.bold('\n👥 People Mentioned:'));
      topics.people.forEach(person => console.log(chalk.white(`  • ${person}`)));
    }

    if (topics.places.length > 0) {
      console.log(chalk.cyan.bold('\n📍 Places Mentioned:'));
      topics.places.forEach(place => console.log(chalk.white(`  • ${place}`)));
    }

    if (topics.organizations.length > 0) {
      console.log(chalk.cyan.bold('\n🏢 Organizations Mentioned:'));
      topics.organizations.forEach(org => console.log(chalk.white(`  • ${org}`)));
    }

    if (topics.topics.length > 0) {
      console.log(chalk.cyan.bold('\n🔍 Key Topics:'));
      topics.topics.slice(0, 10).forEach(topic => console.log(chalk.white(`  • ${topic}`)));
    }

    // Auto-generated tags
    const autoTags = aiAnalyzer.generateTags(note.body, 10);
    console.log(chalk.cyan.bold('\n🏷️  Suggested Tags:'));
    console.log(chalk.magenta(autoTags.join(', ')));

    // Category suggestion
    const suggestedCategory = aiAnalyzer.suggestCategory(note.body);
    console.log(chalk.cyan.bold('\n📁 Suggested Category:'));
    console.log(chalk.yellow(suggestedCategory));

    // Summary generation
    const summary = aiAnalyzer.generateSummary(note.body, 150);
    console.log(chalk.cyan.bold('\nAuto-Generated Summary:'));
    console.log(chalk.white(`"${summary}"`));

    // Content statistics
    const wordCount = note.body.split(' ').length;
    const sentences = note.body.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);

    console.log(chalk.cyan.bold('\nContent Statistics:'));
    console.log(chalk.gray(`Words: ${wordCount}`));
    console.log(chalk.gray(`Sentences: ${sentences}`));
    console.log(chalk.gray(`Average words per sentence: ${Math.round(wordCount / sentences)}`));
    console.log(chalk.gray(`Estimated reading time: ${readingTime} minutes`));

    // Find similar notes if requested
    if (findSimilar) {
      const notes = await fileHandler.readNotes(true);
      const similarNotes = aiAnalyzer.findSimilarNotes(note, notes.filter(n => n.id !== note.id), 5);
      
      if (similarNotes.length > 0) {
        console.log(chalk.cyan.bold('\n🔗 Similar Notes Found:'));
        similarNotes.forEach((similarNote, index) => {
          console.log(chalk.white(`  ${index + 1}. ${similarNote.title}`));
          if (similarNote.category) {
            console.log(chalk.gray(`     Category: ${similarNote.category}`));
          }
        });
      } else {
        console.log(chalk.yellow('\n🔍 No similar notes found.'));
      }
    }

    // Writing insights
    if (detailed) {
      console.log(chalk.cyan.bold('\nWriting Insights:'));
      
      const wordFrequency = getWordFrequency(note.body);
      console.log(chalk.gray('Most used words:'));
      Object.entries(wordFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .forEach(([word, count]) => {
          console.log(chalk.gray(`  • "${word}" - ${count} times`));
        });

      // Complexity analysis
      const avgWordsPerSentence = Math.round(wordCount / sentences);
      let complexity = 'Simple';
      if (avgWordsPerSentence > 20) complexity = 'Complex';
      else if (avgWordsPerSentence > 15) complexity = 'Moderate';
      
      console.log(chalk.gray(`Writing complexity: ${complexity}`));
    }

    console.log('\n' + '═'.repeat(60));
    
    console.log(chalk.yellow('\nSuggestions:'));
    if (sentiment.score < -1) {
      console.log(chalk.gray('• Consider adding positive reflections or solutions'));
    }
    if (autoTags.length > 5) {
      console.log(chalk.gray('• Consider organizing with more specific categories'));
    }
    if (wordCount > 500) {
      console.log(chalk.gray('• This is a substantial note - consider breaking into smaller notes'));
    }
    
  } catch (error) {
    console.error(chalk.red('Failed to analyze note:'), error.message);
    throw error;
  }
}

/**
 * Get word frequency analysis
 */
function getWordFrequency(text) {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3); // Only words longer than 3 characters
  
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return frequency;
}
