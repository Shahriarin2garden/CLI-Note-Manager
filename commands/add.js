import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import aiAnalyzer from '../utils/aiAnalyzer.js';
import chalk from 'chalk';

const fileHandler = new AdvancedFileHandler();

export async function addNote(title, body, options = {}) {
  try {
    if (!title || !body) {
      console.log(chalk.red('Error: Title and body are required'));
      return false;
    }

    const notes = await fileHandler.readNotes(true);
    
    // AI enhancement
    const sentiment = aiAnalyzer.analyzeSentiment(body);
    const autoTags = aiAnalyzer.generateTags(body);
    const suggestedCategory = aiAnalyzer.suggestCategory(body);
    const topics = aiAnalyzer.extractTopics(body);
    
    const newNote = {
      id: Date.now(),
      title,
      body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: options.tags || autoTags,
      category: options.category || suggestedCategory,
      metadata: {
        sentiment,
        topics,
        wordCount: body.split(' ').length,
        readingTime: Math.ceil(body.split(' ').length / 200)
      }
    };
    
    notes.push(newNote);
    await fileHandler.writeNotes(notes);
    
    console.log(chalk.green(`✓ Note "${title}" created successfully!`));
    return true;
    
  } catch (error) {
    console.log(chalk.red(`Error creating note: ${error.message}`));
    return false;
  }
}
