import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto-js';
import chalk from 'chalk';

const NOTES_FILE = './data/notes.json';
const BACKUP_DIR = './data/backups';
const ATTACHMENTS_DIR = './data/attachments';
const TEMPLATES_DIR = './data/templates';

/**
 * Enhanced file handler with encryption, backup, and advanced features
 */
export class AdvancedFileHandler {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-me';
    this.initializeDirectories();
  }

  async initializeDirectories() {
    const dirs = [
      './data',
      BACKUP_DIR,
      ATTACHMENTS_DIR,
      TEMPLATES_DIR,
      './data/exports',
      './data/analytics'
    ];

    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (error) {
        // Directory already exists
      }
    }
  }

  /**
   * Read notes with optional decryption
   */
  async readNotes(decrypt = false) {
    try {
      const data = await fs.readFile(NOTES_FILE, 'utf8');
      let notes = JSON.parse(data);
      
      if (decrypt && notes.length > 0 && notes[0].encrypted) {
        notes = notes.map(note => ({
          ...note,
          body: note.encrypted ? this.decrypt(note.body) : note.body,
          encrypted: false
        }));
      }
      
      return notes;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Write notes with optional encryption and backup
   */
  async writeNotes(notes, options = {}) {
    const { encrypt = false, backup = true } = options;
    
    if (backup) {
      await this.createBackup();
    }

    let processedNotes = notes;
    if (encrypt) {
      processedNotes = notes.map(note => ({
        ...note,
        body: this.encrypt(note.body),
        encrypted: true
      }));
    }

    await fs.writeFile(NOTES_FILE, JSON.stringify(processedNotes, null, 2));
  }

  /**
   * Create timestamped backup
   */
  async createBackup() {
    try {
      const data = await fs.readFile(NOTES_FILE, 'utf8');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(BACKUP_DIR, `notes-backup-${timestamp}.json`);
      await fs.writeFile(backupPath, data);
    } catch (error) {
      // Ignore if notes file doesn't exist yet
    }
  }

  /**
   * Encrypt text
   */
  encrypt(text) {
    return crypto.AES.encrypt(text, this.encryptionKey).toString();
  }

  /**
   * Decrypt text
   */
  decrypt(encryptedText) {
    const bytes = crypto.AES.decrypt(encryptedText, this.encryptionKey);
    return bytes.toString(crypto.enc.Utf8);
  }

  /**
   * Find note by various criteria
   */
  async findNote(criteria) {
    const notes = await this.readNotes(true);
    
    if (criteria.id) {
      return notes.find(note => note.id === criteria.id);
    }
    
    if (criteria.title) {
      return notes.find(note => 
        note.title.toLowerCase() === criteria.title.toLowerCase()
      );
    }
    
    if (criteria.tag) {
      return notes.filter(note => 
        note.tags && note.tags.includes(criteria.tag)
      );
    }
    
    return null;
  }

  /**
   * Advanced search with fuzzy matching
   */
  async searchNotes(query, options = {}) {
    const notes = await this.readNotes(true);
    const { 
      searchIn = ['title', 'body', 'tags'], 
      caseSensitive = false,
      exactMatch = false 
    } = options;

    const searchTerm = caseSensitive ? query : query.toLowerCase();

    return notes.filter(note => {
      return searchIn.some(field => {
        let value = note[field];
        
        if (!value) return false;
        
        if (Array.isArray(value)) {
          value = value.join(' ');
        }
        
        if (!caseSensitive) {
          value = value.toLowerCase();
        }
        
        return exactMatch ? 
          value === searchTerm : 
          value.includes(searchTerm);
      });
    });
  }

  /**
   * Save attachment file
   */
  async saveAttachment(fileName, buffer) {
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = path.join(ATTACHMENTS_DIR, sanitizedName);
    await fs.writeFile(filePath, buffer);
    return filePath;
  }

  /**
   * Get analytics data
   */
  async getAnalytics() {
    const notes = await this.readNotes(true);
    const now = new Date();
    
    const analytics = {
      totalNotes: notes.length,
      totalWords: notes.reduce((acc, note) => acc + note.body.split(' ').length, 0),
      notesThisWeek: notes.filter(note => {
        const noteDate = new Date(note.createdAt);
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return noteDate >= weekAgo;
      }).length,
      notesThisMonth: notes.filter(note => {
        const noteDate = new Date(note.createdAt);
        return noteDate.getMonth() === now.getMonth() && 
               noteDate.getFullYear() === now.getFullYear();
      }).length,
      categories: this.getCategoryStats(notes),
      tags: this.getTagStats(notes),
      wordCount: this.getWordCountStats(notes),
      creationPattern: this.getCreationPattern(notes)
    };

    return analytics;
  }

  getCategoryStats(notes) {
    const stats = {};
    notes.forEach(note => {
      const category = note.category || 'Uncategorized';
      stats[category] = (stats[category] || 0) + 1;
    });
    return stats;
  }

  getTagStats(notes) {
    const stats = {};
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => {
          stats[tag] = (stats[tag] || 0) + 1;
        });
      }
    });
    return stats;
  }

  getWordCountStats(notes) {
    const wordCounts = notes.map(note => note.body.split(' ').length);
    return {
      average: wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length,
      min: Math.min(...wordCounts),
      max: Math.max(...wordCounts),
      median: wordCounts.sort((a, b) => a - b)[Math.floor(wordCounts.length / 2)]
    };
  }

  getCreationPattern(notes) {
    const pattern = {};
    notes.forEach(note => {
      const date = new Date(note.createdAt);
      const hour = date.getHours();
      pattern[hour] = (pattern[hour] || 0) + 1;
    });
    return pattern;
  }
}

// Legacy compatibility functions
const fileHandler = new AdvancedFileHandler();

export const readNotes = () => fileHandler.readNotes(true);
export const writeNotes = (notes) => fileHandler.writeNotes(notes);
export const findNoteByTitle = (title) => fileHandler.findNote({ title });

export default fileHandler;
