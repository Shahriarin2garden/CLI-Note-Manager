import chalk from 'chalk';
import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import aiAnalyzer from '../utils/aiAnalyzer.js';

const fileHandler = new AdvancedFileHandler();

/**
 * Enhanced note creation with AI features
 * @param {string} title - The title of the note
 * @param {string} body - The body content of the note
 * @param {object} options - Additional options for AI enhancement
 */
export async function addNote(title, body, options = {}) {
  try {
    const { 
      aiEnhanced = false, 
      generateTags = false, 
      category = null, 
      quick = false 
    } = options;

    // Check if note with same title already exists
    const existingNote = await fileHandler.findNote({ title });
    if (existingNote) {
      console.log(chalk.red(`Note with title "${title}" already exists!`));
      return;
    }

    // Read existing notes
    const notes = await fileHandler.readNotes(true);
    
    // Create base note object
    const newNote = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      category: category || 'General',
      metadata: {}
    };

    // AI Enhancement
    if (aiEnhanced) {
      console.log(chalk.cyan('Analyzing content with AI...'));
      
      // Sentiment analysis
      const sentiment = aiAnalyzer.analyzeSentiment(body);
      newNote.metadata.sentiment = sentiment;
      
      // Auto-generate tags
      if (generateTags) {
        const autoTags = aiAnalyzer.generateTags(body);
        newNote.tags = autoTags;
        console.log(chalk.green(`Auto-tags: ${autoTags.join(', ')}`));
      }
      
      // Suggest category
      if (!category || category === 'General') {
        const suggestedCategory = aiAnalyzer.suggestCategory(body);
        newNote.category = suggestedCategory;
        console.log(chalk.blue(`Suggested category: ${suggestedCategory}`));
      }
      
      // Extract topics and entities
      const topics = aiAnalyzer.extractTopics(body);
      newNote.metadata.topics = topics;
      
      // Generate summary for long notes
      if (body.length > 200) {
        newNote.metadata.summary = aiAnalyzer.generateSummary(body);
      }
      
      // Display sentiment
      const moodEmoji = {
        'very positive': '[+]',
        'positive': '[+]',
        'neutral': '[=]',
        'negative': '😔',
        'very negative': '😢'
      };
      
      console.log(chalk.magenta(`Mood: ${moodEmoji[sentiment.mood]} ${sentiment.mood}`));
      
      if (topics.people.length > 0) {
        console.log(chalk.yellow(`People: ${topics.people.join(', ')}`));
      }
      
      if (topics.places.length > 0) {
        console.log(chalk.yellow(`Places: ${topics.places.join(', ')}`));
      }
    }

    // Quick note indicator
    if (quick) {
      newNote.tags.push('quick-note');
      newNote.category = 'Quick Notes';
    }

    // Add word count
    newNote.metadata.wordCount = body.split(' ').length;
    newNote.metadata.readingTime = Math.ceil(newNote.metadata.wordCount / 200); // Assuming 200 WPM
    
    // Add new note and save
    notes.push(newNote);
    await fileHandler.writeNotes(notes);
    
    // Success message with details
    console.log(chalk.green.bold(`Note "${title}" created successfully!`));
    console.log(chalk.gray(`Word count: ${newNote.metadata.wordCount}`));
    console.log(chalk.gray(`Reading time: ~${newNote.metadata.readingTime} min`));
    console.log(chalk.gray(`Category: ${newNote.category}`));
    
    if (newNote.tags.length > 0) {
      console.log(chalk.gray(`Tags: ${newNote.tags.join(', ')}`));
    }

    // Suggest similar notes if AI is enabled
    if (aiEnhanced && notes.length > 1) {
      const similarNotes = aiAnalyzer.findSimilarNotes(newNote, notes.slice(0, -1), 2);
      if (similarNotes.length > 0) {
        console.log(chalk.cyan('\nSimilar notes found:'));
        similarNotes.forEach(note => {
          console.log(chalk.gray(`   • ${note.title}`));
        });
      }
    }
    
  } catch (error) {
    console.error(chalk.red('Failed to add note:'), error.message);
    throw error;
  }
}
