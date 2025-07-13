import fs from 'fs/promises';
import { EventEmitter } from 'events';

console.log('=== Complete Note Manager Example ===\n');

function createNoteManager() {
  let notes = []; // Private data using closures!
  let nextId = 1;
  
  return {
    // Each method is a closure that can access 'notes' and 'nextId'
    add(title, content) {
      const note = {
        id: nextId++,
        title,
        content,
        createdAt: new Date(),
        tags: this.extractTags(content)
      };
      notes.push(note);
      return note;
    },
    
    // Higher-order function - takes a function as parameter
    search(filterFunction) {
      return notes.filter(filterFunction);
    },
    
    // Using async/await for file operations
    async save() {
      try {
        await fs.writeFile('demo-notes.json', JSON.stringify(notes, null, 2));
        return true;
      } catch (error) {
        console.error('Save failed:', error.message);
        return false;
      }
    },
    
    // Method using regular expressions
    extractTags(content) {
      const tagPattern = /#(\w+)/g;
      const matches = content.match(tagPattern);
      return matches ? matches.map(tag => tag.slice(1)) : [];
    },
    
    // Get all notes
    getAll() {
      return [...notes]; // Return a copy to protect private data
    }
  };
}

// Event-driven programming
class EnhancedNoteManager extends EventEmitter {
  constructor() {
    super();
    this.manager = createNoteManager();
    
    this.on('noteAdded', (note) => {
      if (note.tags.includes('important')) {
        console.log('🔥 Important note detected!');
      }
      if (note.tags.includes('work')) {
        console.log('💼 Work-related note added!');
      }
    });
  }
  
  addNote(title, content) {
    const note = this.manager.add(title, content);
    this.emit('noteAdded', note);
    return note;
  }
  
  searchNotes(query) {
    return this.manager.search(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
  }
  
  async saveNotes() {
    return await this.manager.save();
  }
  
  getAllNotes() {
    return this.manager.getAll();
  }
}

// Demo the complete system
async function demonstrateNoteManager() {
  const noteManager = new EnhancedNoteManager();
  
  console.log('--- Adding Notes ---');
  noteManager.addNote('Grocery List', 'Buy milk, eggs, bread #personal');
  noteManager.addNote('Project Meeting', 'Discuss deadline with team #work #important');
  noteManager.addNote('Weekend Plans', 'Visit the park, watch movie #personal #fun');
  noteManager.addNote('Code Review', 'Review pull requests #work #development');
  
  console.log('\n--- All Notes ---');
  const allNotes = noteManager.getAllNotes();
  allNotes.forEach(note => {
    console.log(`📝 ${note.title} (ID: ${note.id})`);
    console.log(`   Content: ${note.content}`);
    console.log(`   Tags: ${note.tags.join(', ')}`);
    console.log(`   Created: ${note.createdAt.toLocaleString()}`);
    console.log('');
  });
  
  console.log('--- Search Results for "work" ---');
  const workNotes = noteManager.searchNotes('work');
  workNotes.forEach(note => {
    console.log(`🔍 Found: ${note.title}`);
  });
  
  console.log('\n--- Saving Notes ---');
  const saved = await noteManager.saveNotes();
  if (saved) {
    console.log('✅ Notes saved successfully!');
    
    // Show the saved file content
    const savedContent = await fs.readFile('demo-notes.json', 'utf8');
    console.log('\n📄 Saved file content:');
    console.log(savedContent);
    
    // Clean up
    await fs.unlink('demo-notes.json');
    console.log('\n🧹 Demo file cleaned up');
  }
}

demonstrateNoteManager();
