# Advanced JavaScript & Node.js Concepts
*Mastering Professional CLI Development*

Building on the fundamentals from [JavaScript & Node.js Basics](./EDUCATIONAL_GUIDE_BASICS.md), this guide explores advanced concepts used in our [AI-Powered CLI Note Manager](./README.md). You'll learn enterprise-grade patterns, AI integration, and professional development practices.

## Prerequisites

Before starting this guide, ensure you've completed:
- [JavaScript & Node.js Basics](./EDUCATIONAL_GUIDE_BASICS.md)
- Understanding of functions, scope, closures, and basic async programming
- Familiarity with Node.js file operations and command-line arguments

## Advanced JavaScript Concepts

### Deep Dive into Execution Context and Call Stack

Understanding how JavaScript executes code is crucial for debugging and optimization.

**Call Stack Mechanics**
```javascript
function analyzeNoteStack() {
  console.log('1. Starting note analysis');
  processContent();
  console.log('4. Analysis complete');
}

function processContent() {
  console.log('2. Processing content');
  extractKeywords();
  console.log('3. Content processed');
}

function extractKeywords() {
  console.log('2.1. Extracting keywords');
  // Keyword extraction logic
}

// Call stack visualization:
// extractKeywords()  ← Top of stack
// processContent()   ← Middle
// analyzeNoteStack() ← Bottom
```

**Event Loop and Asynchronous Execution**
```javascript
console.log('1. Synchronous start');

// Macrotask (setTimeout)
setTimeout(() => {
  console.log('4. Timeout callback (macrotask)');
}, 0);

// Microtask (Promise)
Promise.resolve().then(() => {
  console.log('3. Promise resolved (microtask)');
});

console.log('2. Synchronous end');

// Output order: 1, 2, 3, 4
// Synchronous code → Microtasks → Macrotasks
```

**Memory Management and Garbage Collection**
```javascript
class NoteCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  set(key, value) {
    // Implement LRU cache to prevent memory leaks
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  get(key) {
    const value = this.cache.get(key);
    if (value) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }
  
  clear() {
    this.cache.clear(); // Explicit cleanup
  }
}
```

### Advanced Asynchronous Programming

**Promise Composition and Error Handling**
```javascript
import fs from 'fs/promises';

class AdvancedNoteManager {
  constructor(dataPath) {
    this.dataPath = dataPath;
    this.backupPath = `${dataPath}.backup`;
  }
  
  async safeWrite(data) {
    try {
      // Create backup before writing
      await this.createBackup();
      
      // Write new data
      await fs.writeFile(this.dataPath, data);
      
      // Verify write succeeded
      await this.verifyIntegrity();
      
      return { success: true };
      
    } catch (error) {
      // Restore from backup on failure
      await this.restoreFromBackup();
      throw new Error(`Write failed: ${error.message}`);
    }
  }
  
  async createBackup() {
    try {
      const data = await fs.readFile(this.dataPath);
      await fs.writeFile(this.backupPath, data);
    } catch (error) {
      // Backup failure is not critical for new files
      if (error.code !== 'ENOENT') throw error;
    }
  }
  
  async verifyIntegrity() {
    const data = await fs.readFile(this.dataPath, 'utf8');
    JSON.parse(data); // Throws if invalid JSON
  }
  
  async restoreFromBackup() {
    try {
      const backup = await fs.readFile(this.backupPath);
      await fs.writeFile(this.dataPath, backup);
    } catch (error) {
      console.warn('Could not restore from backup:', error.message);
    }
  }
}
```

**Parallel Processing with Promise.all and Promise.allSettled**
```javascript
class BulkNoteProcessor {
  async processMultipleNotes(notes) {
    console.log(`Processing ${notes.length} notes in parallel...`);
    
    // Process all notes simultaneously
    const results = await Promise.allSettled(
      notes.map(note => this.processNote(note))
    );
    
    // Analyze results
    const successful = results.filter(r => r.status === 'fulfilled');
    const failed = results.filter(r => r.status === 'rejected');
    
    console.log(`✅ Processed: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    
    // Log failures for debugging
    failed.forEach((result, index) => {
      console.error(`Note ${index} failed:`, result.reason.message);
    });
    
    return {
      successful: successful.map(r => r.value),
      failed: failed.length
    };
  }
  
  async processNote(note) {
    // Simulate processing with potential failure
    const processingTime = Math.random() * 1000;
    
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Randomly fail 10% of notes to demonstrate error handling
    if (Math.random() < 0.1) {
      throw new Error(`Processing failed for note: ${note.title}`);
    }
    
    return {
      ...note,
      processed: true,
      processingTime,
      timestamp: new Date().toISOString()
    };
  }
}
```

### Event-Driven Architecture

**Custom Event System for CLI Applications**
```javascript
import { EventEmitter } from 'events';

class SmartNoteManager extends EventEmitter {
  constructor() {
    super();
    this.notes = [];
    this.setupEventHandlers();
  }
  
  setupEventHandlers() {
    // Auto-save when notes are modified
    this.on('noteAdded', this.autoSave.bind(this));
    this.on('noteUpdated', this.autoSave.bind(this));
    this.on('noteDeleted', this.autoSave.bind(this));
    
    // Analytics tracking
    this.on('noteAdded', this.trackAnalytics.bind(this));
    
    // AI processing
    this.on('noteAdded', this.scheduleAIAnalysis.bind(this));
    
    // Notification system
    this.on('aiAnalysisComplete', this.handleAIResults.bind(this));
  }
  
  async addNote(title, content, options = {}) {
    const note = {
      id: this.generateId(),
      title,
      content,
      created: new Date().toISOString(),
      tags: options.tags || [],
      category: options.category || 'general'
    };
    
    this.notes.push(note);
    
    // Emit event to trigger all related processes
    this.emit('noteAdded', note, options);
    
    return note;
  }
  
  async autoSave() {
    try {
      await this.saveToFile();
      this.emit('saveComplete', { timestamp: new Date() });
    } catch (error) {
      this.emit('saveError', error);
    }
  }
  
  trackAnalytics(note) {
    this.emit('analyticsEvent', {
      type: 'note_created',
      noteId: note.id,
      wordCount: note.content.split(' ').length,
      category: note.category,
      timestamp: new Date()
    });
  }
  
  scheduleAIAnalysis(note) {
    // Schedule AI analysis without blocking note creation
    setTimeout(() => {
      this.performAIAnalysis(note);
    }, 100);
  }
  
  async performAIAnalysis(note) {
    try {
      const analysis = await this.analyzeWithAI(note);
      this.emit('aiAnalysisComplete', note, analysis);
    } catch (error) {
      this.emit('aiAnalysisError', note, error);
    }
  }
  
  handleAIResults(note, analysis) {
    // Update note with AI insights
    const noteIndex = this.notes.findIndex(n => n.id === note.id);
    if (noteIndex !== -1) {
      this.notes[noteIndex].aiAnalysis = analysis;
      this.emit('noteUpdated', this.notes[noteIndex]);
    }
  }
  
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  async analyzeWithAI(note) {
    // Simulate AI analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          sentiment: Math.random() > 0.5 ? 'positive' : 'negative',
          confidence: Math.random(),
          suggestedTags: ['ai-generated', 'analyzed'],
          summary: note.content.substring(0, 100) + '...'
        });
      }, Math.random() * 1000);
    });
  }
  
  async saveToFile() {
    // Implementation would save to actual file
    console.log(`Auto-saved ${this.notes.length} notes`);
  }
}
```

## Node.js Advanced Features

### Stream Processing for Large Data

```javascript
import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';

class NoteStreamProcessor {
  // Process large note files without loading everything into memory
  async processLargeNoteFile(inputPath, outputPath) {
    const transformStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        try {
          const note = JSON.parse(chunk.toString());
          
          // Process note
          const processedNote = {
            ...note,
            processedAt: new Date().toISOString(),
            wordCount: note.content.split(' ').length
          };
          
          callback(null, JSON.stringify(processedNote) + '\n');
        } catch (error) {
          callback(error);
        }
      }
    });
    
    await pipeline(
      createReadStream(inputPath),
      transformStream,
      createWriteStream(outputPath)
    );
    
    console.log('Large file processing complete');
  }
}
```

### Worker Threads for CPU-Intensive Tasks

```javascript
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';

// Main thread
class AIAnalysisManager {
  constructor() {
    this.workers = [];
    this.maxWorkers = 4;
  }
  
  async analyzeNotesInParallel(notes) {
    const chunks = this.chunkArray(notes, this.maxWorkers);
    const promises = chunks.map(chunk => this.processChunk(chunk));
    
    const results = await Promise.all(promises);
    return results.flat();
  }
  
  processChunk(notes) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: { notes }
      });
      
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
  
  chunkArray(array, chunks) {
    const result = [];
    const chunkSize = Math.ceil(array.length / chunks);
    
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    
    return result;
  }
}

// Worker thread
if (!isMainThread) {
  const { notes } = workerData;
  
  // CPU-intensive analysis
  const results = notes.map(note => ({
    id: note.id,
    sentiment: analyzesentiment(note.content),
    keywords: extractKeywords(note.content),
    readability: calculateReadability(note.content)
  }));
  
  parentPort.postMessage(results);
}

function analyzesentiment(text) {
  // Simplified sentiment analysis
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disappointing'];
  
  const words = text.toLowerCase().split(' ');
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score++;
    if (negativeWords.includes(word)) score--;
  });
  
  return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
}

function extractKeywords(text) {
  // Simplified keyword extraction
  return text.toLowerCase()
    .split(' ')
    .filter(word => word.length > 4)
    .slice(0, 5);
}

function calculateReadability(text) {
  const words = text.split(' ').length;
  const sentences = text.split(/[.!?]/).length;
  return words / sentences; // Simplified readability score
}
```

## Professional CLI Development

### Command Pattern Implementation

```javascript
class CommandRegistry {
  constructor() {
    this.commands = new Map();
    this.middleware = [];
  }
  
  register(name, command) {
    this.commands.set(name, command);
  }
  
  use(middleware) {
    this.middleware.push(middleware);
  }
  
  async execute(name, args, context = {}) {
    const command = this.commands.get(name);
    if (!command) {
      throw new Error(`Command '${name}' not found`);
    }
    
    // Apply middleware
    for (const middleware of this.middleware) {
      context = await middleware(context, name, args);
    }
    
    return await command.execute(args, context);
  }
}

class AddNoteCommand {
  constructor(noteManager) {
    this.noteManager = noteManager;
  }
  
  async execute(args, context) {
    const [title, content] = args;
    
    if (!title || !content) {
      throw new Error('Usage: add <title> <content>');
    }
    
    const note = await this.noteManager.addNote(title, content);
    
    return {
      success: true,
      message: `Note "${title}" created with ID: ${note.id}`,
      data: note
    };
  }
}

class SearchCommand {
  constructor(noteManager) {
    this.noteManager = noteManager;
  }
  
  async execute(args, context) {
    const [query] = args;
    
    if (!query) {
      throw new Error('Usage: search <query>');
    }
    
    const results = await this.noteManager.search(query);
    
    return {
      success: true,
      message: `Found ${results.length} notes matching "${query}"`,
      data: results
    };
  }
}

// Middleware examples
function loggingMiddleware(context, command, args) {
  console.log(`Executing command: ${command} with args: ${args.join(', ')}`);
  context.startTime = Date.now();
  return context;
}

function authMiddleware(context, command, args) {
  // Simulate authentication check
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return context;
}

function timingMiddleware(context, command, args) {
  if (context.startTime) {
    const duration = Date.now() - context.startTime;
    console.log(`Command completed in ${duration}ms`);
  }
  return context;
}
```

### Interactive Terminal UI

```javascript
import blessed from 'blessed';
import chalk from 'chalk';

class NoteTUI {
  constructor(noteManager) {
    this.noteManager = noteManager;
    this.screen = null;
    this.noteList = null;
    this.noteContent = null;
    this.setupUI();
  }
  
  setupUI() {
    // Create screen
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'AI Note Manager'
    });
    
    // Note list panel
    this.noteList = blessed.list({
      parent: this.screen,
      label: ' Notes ',
      top: 0,
      left: 0,
      width: '50%',
      height: '70%',
      border: { type: 'line' },
      style: {
        selected: { bg: 'blue' },
        item: { hover: { bg: 'grey' } }
      },
      keys: true,
      vi: true
    });
    
    // Note content panel
    this.noteContent = blessed.box({
      parent: this.screen,
      label: ' Content ',
      top: 0,
      left: '50%',
      width: '50%',
      height: '70%',
      border: { type: 'line' },
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true
    });
    
    // Status bar
    this.statusBar = blessed.box({
      parent: this.screen,
      bottom: 0,
      left: 0,
      width: '100%',
      height: 3,
      border: { type: 'line' },
      content: 'Ready | Arrow keys: navigate | Enter: view | q: quit | n: new note'
    });
    
    // Command input
    this.commandInput = blessed.textbox({
      parent: this.screen,
      bottom: 3,
      left: 0,
      width: '100%',
      height: 3,
      border: { type: 'line' },
      label: ' Command ',
      inputOnFocus: true
    });
    
    this.setupEventHandlers();
    this.loadNotes();
  }
  
  setupEventHandlers() {
    // Note selection
    this.noteList.on('select', (item, index) => {
      this.displayNote(index);
    });
    
    // Keyboard shortcuts
    this.screen.key(['q', 'C-c'], () => {
      this.cleanup();
      process.exit(0);
    });
    
    this.screen.key(['n'], () => {
      this.newNoteDialog();
    });
    
    this.screen.key(['s'], () => {
      this.searchDialog();
    });
    
    this.screen.key(['r'], () => {
      this.refreshNotes();
    });
    
    // Command input
    this.commandInput.on('submit', (value) => {
      this.executeCommand(value);
      this.commandInput.clearValue();
    });
  }
  
  async loadNotes() {
    try {
      const notes = await this.noteManager.getAllNotes();
      const items = notes.map(note => 
        `${note.title} (${new Date(note.created).toLocaleDateString()})`
      );
      
      this.noteList.setItems(items);
      this.notes = notes;
      this.screen.render();
      
    } catch (error) {
      this.showError(`Failed to load notes: ${error.message}`);
    }
  }
  
  displayNote(index) {
    if (!this.notes || index >= this.notes.length) return;
    
    const note = this.notes[index];
    const content = [
      chalk.bold(note.title),
      '',
      chalk.gray(`Created: ${new Date(note.created).toLocaleString()}`),
      chalk.gray(`Words: ${note.content.split(' ').length}`),
      '',
      note.content,
      ''
    ];
    
    if (note.aiAnalysis) {
      content.push(
        chalk.blue('AI Analysis:'),
        `Sentiment: ${note.aiAnalysis.sentiment}`,
        `Tags: ${note.aiAnalysis.suggestedTags?.join(', ') || 'None'}`,
        ''
      );
    }
    
    this.noteContent.setContent(content.join('\n'));
    this.screen.render();
  }
  
  newNoteDialog() {
    const form = blessed.form({
      parent: this.screen,
      top: 'center',
      left: 'center',
      width: 60,
      height: 15,
      border: { type: 'line' },
      label: ' New Note '
    });
    
    const titleInput = blessed.textbox({
      parent: form,
      top: 1,
      left: 1,
      width: '95%',
      height: 3,
      border: { type: 'line' },
      label: ' Title ',
      inputOnFocus: true
    });
    
    const contentInput = blessed.textarea({
      parent: form,
      top: 5,
      left: 1,
      width: '95%',
      height: 6,
      border: { type: 'line' },
      label: ' Content ',
      inputOnFocus: true
    });
    
    const saveButton = blessed.button({
      parent: form,
      bottom: 1,
      left: 2,
      width: 10,
      height: 3,
      content: 'Save',
      style: { bg: 'green' }
    });
    
    const cancelButton = blessed.button({
      parent: form,
      bottom: 1,
      right: 2,
      width: 10,
      height: 3,
      content: 'Cancel',
      style: { bg: 'red' }
    });
    
    saveButton.on('press', async () => {
      const title = titleInput.getValue();
      const content = contentInput.getValue();
      
      if (title && content) {
        try {
          await this.noteManager.addNote(title, content);
          this.loadNotes();
          this.showStatus('Note saved successfully');
        } catch (error) {
          this.showError(`Failed to save note: ${error.message}`);
        }
      }
      
      form.destroy();
      this.screen.render();
    });
    
    cancelButton.on('press', () => {
      form.destroy();
      this.screen.render();
    });
    
    titleInput.focus();
    this.screen.render();
  }
  
  showStatus(message) {
    this.statusBar.setContent(message);
    this.screen.render();
    
    setTimeout(() => {
      this.statusBar.setContent('Ready | Arrow keys: navigate | Enter: view | q: quit | n: new note');
      this.screen.render();
    }, 3000);
  }
  
  showError(message) {
    this.statusBar.setContent(chalk.red(`Error: ${message}`));
    this.screen.render();
  }
  
  cleanup() {
    if (this.screen) {
      this.screen.destroy();
    }
  }
  
  start() {
    this.screen.render();
  }
}
```

## AI Integration and Natural Language Processing

### Sentiment Analysis Implementation

```javascript
class SentimentAnalyzer {
  constructor() {
    this.positiveWords = new Set([
      'amazing', 'awesome', 'excellent', 'fantastic', 'great', 'good',
      'happy', 'love', 'perfect', 'wonderful', 'brilliant', 'outstanding'
    ]);
    
    this.negativeWords = new Set([
      'awful', 'bad', 'terrible', 'horrible', 'hate', 'worst',
      'disappointing', 'frustrated', 'angry', 'sad', 'depressed', 'annoying'
    ]);
    
    this.intensifiers = new Set([
      'very', 'extremely', 'incredibly', 'absolutely', 'completely', 'totally'
    ]);
  }
  
  analyze(text) {
    const words = this.tokenize(text.toLowerCase());
    let score = 0;
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const prevWord = i > 0 ? words[i - 1] : '';
      const intensifier = this.intensifiers.has(prevWord) ? 2 : 1;
      
      if (this.positiveWords.has(word)) {
        score += intensifier;
        positiveCount++;
      } else if (this.negativeWords.has(word)) {
        score -= intensifier;
        negativeCount++;
      }
    }
    
    // Normalize score
    const totalWords = words.length;
    const normalizedScore = totalWords > 0 ? score / totalWords : 0;
    
    return {
      score: normalizedScore,
      magnitude: Math.abs(normalizedScore),
      label: this.getLabel(normalizedScore),
      details: {
        positiveWords: positiveCount,
        negativeWords: negativeCount,
        totalWords: totalWords
      }
    };
  }
  
  tokenize(text) {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }
  
  getLabel(score) {
    if (score > 0.1) return 'positive';
    if (score < -0.1) return 'negative';
    return 'neutral';
  }
}
```

### Topic Extraction and Keyword Analysis

```javascript
class TopicExtractor {
  constructor() {
    this.stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    ]);
  }
  
  extractKeywords(text, maxKeywords = 10) {
    const words = this.tokenize(text.toLowerCase());
    const wordFreq = new Map();
    
    // Count word frequency
    words.forEach(word => {
      if (!this.stopWords.has(word) && word.length > 2) {
        wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
      }
    });
    
    // Sort by frequency and return top keywords
    return Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxKeywords)
      .map(([word, freq]) => ({ word, frequency: freq }));
  }
  
  extractTopics(text) {
    const keywords = this.extractKeywords(text, 20);
    const topics = this.clusterKeywords(keywords);
    
    return topics.map(topic => ({
      name: topic.name,
      keywords: topic.keywords,
      confidence: topic.confidence
    }));
  }
  
  clusterKeywords(keywords) {
    // Simplified topic clustering based on keyword similarity
    const topics = [];
    const used = new Set();
    
    keywords.forEach(keyword => {
      if (used.has(keyword.word)) return;
      
      const relatedWords = keywords.filter(k => 
        !used.has(k.word) && this.areRelated(keyword.word, k.word)
      );
      
      if (relatedWords.length > 0) {
        const topicName = this.generateTopicName(relatedWords);
        topics.push({
          name: topicName,
          keywords: relatedWords.map(w => w.word),
          confidence: this.calculateConfidence(relatedWords)
        });
        
        relatedWords.forEach(w => used.add(w.word));
      }
    });
    
    return topics;
  }
  
  areRelated(word1, word2) {
    // Simple relatedness check (could be enhanced with word embeddings)
    const commonPrefixes = ['tech', 'work', 'project', 'manage', 'develop'];
    
    return commonPrefixes.some(prefix => 
      word1.startsWith(prefix) && word2.startsWith(prefix)
    );
  }
  
  generateTopicName(keywords) {
    // Generate topic name from most frequent keyword
    return keywords.sort((a, b) => b.frequency - a.frequency)[0].word;
  }
  
  calculateConfidence(keywords) {
    const totalFreq = keywords.reduce((sum, k) => sum + k.frequency, 0);
    return Math.min(totalFreq / 10, 1); // Normalize to 0-1
  }
  
  tokenize(text) {
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }
}
```

## Security and Data Protection

### Encryption for Sensitive Notes

```javascript
import crypto from 'crypto';

class NoteEncryption {
  constructor(password) {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.tagLength = 16;
    this.key = this.deriveKey(password);
  }
  
  deriveKey(password) {
    return crypto.pbkdf2Sync(password, 'salt', 100000, this.keyLength, 'sha256');
  }
  
  encrypt(text) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }
  
  decrypt(encryptedData) {
    const { encrypted, iv, tag } = encryptedData;
    
    const decipher = crypto.createDecipher(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

class SecureNoteManager {
  constructor(password) {
    this.encryption = new NoteEncryption(password);
    this.encryptedFields = ['content', 'title'];
  }
  
  async saveSecureNote(note, encrypt = false) {
    const secureNote = { ...note };
    
    if (encrypt) {
      this.encryptedFields.forEach(field => {
        if (secureNote[field]) {
          secureNote[field] = this.encryption.encrypt(secureNote[field]);
        }
      });
      secureNote.encrypted = true;
    }
    
    return secureNote;
  }
  
  async loadSecureNote(note) {
    if (!note.encrypted) return note;
    
    const decryptedNote = { ...note };
    
    this.encryptedFields.forEach(field => {
      if (decryptedNote[field] && typeof decryptedNote[field] === 'object') {
        decryptedNote[field] = this.encryption.decrypt(decryptedNote[field]);
      }
    });
    
    return decryptedNote;
  }
}
```

### Input Validation and Sanitization

```javascript
class InputValidator {
  static validateNoteTitle(title) {
    const errors = [];
    
    if (!title || typeof title !== 'string') {
      errors.push('Title is required and must be a string');
    } else {
      if (title.length < 1) {
        errors.push('Title cannot be empty');
      }
      if (title.length > 200) {
        errors.push('Title cannot exceed 200 characters');
      }
      if (!/^[\w\s\-.,!?()]+$/.test(title)) {
        errors.push('Title contains invalid characters');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: this.sanitizeString(title)
    };
  }
  
  static validateNoteContent(content) {
    const errors = [];
    
    if (!content || typeof content !== 'string') {
      errors.push('Content is required and must be a string');
    } else {
      if (content.length < 1) {
        errors.push('Content cannot be empty');
      }
      if (content.length > 100000) {
        errors.push('Content cannot exceed 100,000 characters');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: this.sanitizeString(content)
    };
  }
  
  static validateTags(tags) {
    const errors = [];
    
    if (!Array.isArray(tags)) {
      errors.push('Tags must be an array');
    } else {
      if (tags.length > 20) {
        errors.push('Cannot have more than 20 tags');
      }
      
      const invalidTags = tags.filter(tag => 
        typeof tag !== 'string' || 
        tag.length > 50 || 
        !/^[\w\-]+$/.test(tag)
      );
      
      if (invalidTags.length > 0) {
        errors.push('All tags must be valid strings (alphanumeric and hyphens only, max 50 chars)');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      sanitized: Array.isArray(tags) ? tags.map(tag => this.sanitizeString(tag)) : []
    };
  }
  
  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    
    return str
      .trim()
      .replace(/\x00/g, '') // Remove null bytes
      .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
      .substring(0, 100000); // Limit length
  }
  
  static validateNote(noteData) {
    const validation = {
      isValid: true,
      errors: [],
      sanitized: {}
    };
    
    // Validate title
    const titleValidation = this.validateNoteTitle(noteData.title);
    if (!titleValidation.isValid) {
      validation.isValid = false;
      validation.errors.push(...titleValidation.errors);
    }
    validation.sanitized.title = titleValidation.sanitized;
    
    // Validate content
    const contentValidation = this.validateNoteContent(noteData.content);
    if (!contentValidation.isValid) {
      validation.isValid = false;
      validation.errors.push(...contentValidation.errors);
    }
    validation.sanitized.content = contentValidation.sanitized;
    
    // Validate tags
    const tagsValidation = this.validateTags(noteData.tags || []);
    if (!tagsValidation.isValid) {
      validation.isValid = false;
      validation.errors.push(...tagsValidation.errors);
    }
    validation.sanitized.tags = tagsValidation.sanitized;
    
    return validation;
  }
}
```

## Performance Optimization and Monitoring

### Performance Profiling

```javascript
class PerformanceProfiler {
  constructor() {
    this.metrics = new Map();
    this.activeTimers = new Map();
  }
  
  startTimer(label) {
    this.activeTimers.set(label, {
      start: process.hrtime.bigint(),
      memoryStart: process.memoryUsage()
    });
  }
  
  endTimer(label) {
    const timer = this.activeTimers.get(label);
    if (!timer) return null;
    
    const end = process.hrtime.bigint();
    const memoryEnd = process.memoryUsage();
    
    const duration = Number(end - timer.start) / 1000000; // Convert to milliseconds
    const memoryDelta = {
      rss: memoryEnd.rss - timer.memoryStart.rss,
      heapUsed: memoryEnd.heapUsed - timer.memoryStart.heapUsed,
      heapTotal: memoryEnd.heapTotal - timer.memoryStart.heapTotal
    };
    
    const metric = {
      duration,
      memoryDelta,
      timestamp: new Date().toISOString()
    };
    
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    this.metrics.get(label).push(metric);
    
    this.activeTimers.delete(label);
    return metric;
  }
  
  getMetrics(label) {
    const metrics = this.metrics.get(label) || [];
    if (metrics.length === 0) return null;
    
    const durations = metrics.map(m => m.duration);
    const memoryUsage = metrics.map(m => m.memoryDelta.heapUsed);
    
    return {
      count: metrics.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      avgMemoryDelta: memoryUsage.reduce((a, b) => a + b, 0) / memoryUsage.length,
      recentMetrics: metrics.slice(-10)
    };
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      operations: {}
    };
    
    for (const [label, _] of this.metrics) {
      report.operations[label] = this.getMetrics(label);
    }
    
    return report;
  }
}

// Usage with decorators/wrappers
function profileOperation(profiler, label) {
  return function(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function(...args) {
      profiler.startTimer(label);
      try {
        const result = await originalMethod.apply(this, args);
        const metrics = profiler.endTimer(label);
        
        if (metrics && metrics.duration > 1000) {
          console.warn(`Slow operation detected: ${label} took ${metrics.duration.toFixed(2)}ms`);
        }
        
        return result;
      } catch (error) {
        profiler.endTimer(label);
        throw error;
      }
    };
    
    return descriptor;
  };
}
```

## Testing and Quality Assurance

### Unit Testing with Node.js Test Runner

```javascript
// tests/note-manager.test.js
import { test, describe, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import { NoteManager } from '../src/note-manager.js';

describe('NoteManager', () => {
  let noteManager;
  let mockFileSystem;
  
  before(() => {
    // Setup mock file system
    mockFileSystem = {
      readFile: mock.fn(),
      writeFile: mock.fn(),
      access: mock.fn()
    };
    
    noteManager = new NoteManager(mockFileSystem);
  });
  
  after(() => {
    // Cleanup
    mock.reset();
  });
  
  test('should create a new note with valid data', async () => {
    const title = 'Test Note';
    const content = 'This is test content';
    
    mockFileSystem.readFile.mock.mockImplementation(() => 
      Promise.resolve('[]')
    );
    mockFileSystem.writeFile.mock.mockImplementation(() => 
      Promise.resolve()
    );
    
    const note = await noteManager.addNote(title, content);
    
    assert.equal(note.title, title);
    assert.equal(note.content, content);
    assert.ok(note.id);
    assert.ok(note.created);
  });
  
  test('should reject invalid note data', async () => {
    await assert.rejects(
      () => noteManager.addNote('', 'content'),
      { message: /Title is required/ }
    );
    
    await assert.rejects(
      () => noteManager.addNote('title', ''),
      { message: /Content is required/ }
    );
  });
  
  test('should search notes by content', async () => {
    const notes = [
      { id: 1, title: 'JavaScript Guide', content: 'Learn JavaScript fundamentals' },
      { id: 2, title: 'Node.js Tutorial', content: 'Build CLI applications with Node.js' },
      { id: 3, title: 'React Basics', content: 'Introduction to React components' }
    ];
    
    mockFileSystem.readFile.mock.mockImplementation(() => 
      Promise.resolve(JSON.stringify(notes))
    );
    
    const results = await noteManager.search('JavaScript');
    
    assert.equal(results.length, 1);
    assert.equal(results[0].title, 'JavaScript Guide');
  });
  
  test('should handle file system errors gracefully', async () => {
    mockFileSystem.readFile.mock.mockImplementation(() => 
      Promise.reject(new Error('File not found'))
    );
    
    const notes = await noteManager.loadNotes();
    assert.deepEqual(notes, []);
  });
});

// Integration test
describe('NoteManager Integration', () => {
  test('should perform end-to-end note operations', async () => {
    const noteManager = new NoteManager('./test-data/notes.json');
    
    // Create note
    const note = await noteManager.addNote('Integration Test', 'This is an integration test');
    assert.ok(note.id);
    
    // List notes
    const notes = await noteManager.getAllNotes();
    assert.ok(notes.length > 0);
    
    // Search notes
    const searchResults = await noteManager.search('integration');
    assert.equal(searchResults.length, 1);
    
    // Delete note
    await noteManager.deleteNote(note.id);
    const updatedNotes = await noteManager.getAllNotes();
    assert.ok(!updatedNotes.find(n => n.id === note.id));
  });
});
```

## Course Completion and Next Steps

You've mastered advanced JavaScript and Node.js concepts for professional CLI development. You now have expertise in:

### Technical Mastery
- ✅ Advanced asynchronous programming patterns
- ✅ Event-driven architecture and real-time systems
- ✅ Professional CLI frameworks and interactive UIs
- ✅ AI integration and natural language processing
- ✅ Security, encryption, and data validation
- ✅ Performance optimization and monitoring
- ✅ Testing strategies and quality assurance

### Professional Skills
- ✅ Enterprise-grade design patterns
- ✅ Scalable application architecture
- ✅ Error handling and debugging
- ✅ Code organization and modularity
- ✅ Documentation and testing practices

### Production Application

You've learned through building our complete [AI-Powered CLI Note Manager](./README.md), which demonstrates:

- **AI-Powered Features**: Sentiment analysis, auto-tagging, topic extraction
- **Interactive Terminal UI**: Professional keyboard navigation and real-time updates
- **Enterprise Security**: AES-256 encryption, input validation, secure data handling
- **Advanced Analytics**: Performance monitoring, usage metrics, trend analysis
- **Multi-format Export**: PDF, HTML, Markdown, ZIP with template support
- **RESTful API**: Complete integration endpoints for external applications

### Continue Your Journey

**Explore the Full Application**
```bash
# Experience all advanced features
npm start tui                      # Interactive terminal UI
npm start analytics                # Advanced analytics dashboard
npm start server                   # RESTful API server
npm start analyze "Note Title"     # AI-powered analysis
```

**Extend Your Skills**
- Web development with Express.js and React
- Database integration (PostgreSQL, MongoDB)
- Microservices and distributed systems
- DevOps and deployment automation
- Machine learning and AI integration

**Professional Development**
- Open source contributions
- Technical leadership and mentoring
- System architecture and design
- Product development and strategy

You're now equipped to build enterprise-grade applications and lead technical projects. Keep building, keep learning, and keep pushing the boundaries of what's possible with JavaScript and Node.js.

---

**From fundamentals to production: Your journey to professional JavaScript development is complete.** 🎓
