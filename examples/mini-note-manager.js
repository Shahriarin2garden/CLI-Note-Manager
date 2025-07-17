import fs from 'fs/promises';
import path from 'path';

class MiniNoteManager {
  constructor() {
    this.dataFile = './examples/mini-notes.json';
    this.initialized = false;
  }
  
  async init() {
    if (this.initialized) return;
    
    try {
      await fs.access(path.dirname(this.dataFile));
    } catch {
      await fs.mkdir(path.dirname(this.dataFile), { recursive: true });
    }
    
    this.initialized = true;
    console.log('✓ Mini Note Manager initialized');
  }
  
  async loadNotes() {
    await this.init();
    try {
      const data = await fs.readFile(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
  
  async saveNotes(notes) {
    await this.init();
    await fs.writeFile(this.dataFile, JSON.stringify(notes, null, 2));
  }
  
  async add(title, content) {
    const notes = await this.loadNotes();
    const note = {
      id: Date.now(),
      title,
      content,
      created: new Date().toISOString(),
      wordCount: content.split(' ').length
    };
    
    notes.push(note);
    await this.saveNotes(notes);
    
    console.log(`✓ Added note "${title}" (${note.wordCount} words)`);
    return note;
  }
  
  async list() {
    const notes = await this.loadNotes();
    
    if (notes.length === 0) {
      console.log('No notes found');
      return;
    }
    
    console.log(`\n📝 ${notes.length} notes found:`);
    notes.forEach(note => {
      const preview = note.content.length > 40 
        ? note.content.substring(0, 40) + '...'
        : note.content;
      console.log(`  [${note.id}] ${note.title}`);
      console.log(`      ${preview}`);
    });
  }
  
  async stats() {
    const notes = await this.loadNotes();
    const totalWords = notes.reduce((sum, note) => sum + note.wordCount, 0);
    
    console.log('\n📊 Statistics:');
    console.log(`  Total notes: ${notes.length}`);
    console.log(`  Total words: ${totalWords}`);
    console.log(`  Average words per note: ${notes.length ? Math.round(totalWords / notes.length) : 0}`);
  }
}

// CLI Interface
async function runCLI() {
  const manager = new MiniNoteManager();
  const args = process.argv.slice(2);
  const command = args[0];
  
  try {
    switch (command) {
      case 'add':
        if (args.length < 3) {
          console.log('Usage: node mini-note-manager.js add "title" "content"');
          return;
        }
        await manager.add(args[1], args[2]);
        break;
        
      case 'list':
        await manager.list();
        break;
        
      case 'stats':
        await manager.stats();
        break;
        
      default:
        console.log('Mini Note Manager');
        console.log('Commands:');
        console.log('  add "title" "content" - Add a new note');
        console.log('  list                  - List all notes');
        console.log('  stats                 - Show statistics');
    }
  } catch (error) {
    console.error('✗ Error:', error.message);
  }
}

runCLI();
