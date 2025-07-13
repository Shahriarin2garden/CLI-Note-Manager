import { EventEmitter } from 'events';

console.log('=== Node.js EventEmitter Example ===\n');

class SmartNotepad extends EventEmitter {
  constructor() {
    super();
    this.notes = [];
    
    this.on('noteAdded', (note) => {
      console.log(`New note: "${note.title}"`);
      this.checkForKeywords(note);
    });
    
    this.on('importantNote', (note) => {
      console.log(`IMPORTANT: "${note.title}" contains important keywords!`);
    });
  }
  
  addNote(title, content) {
    const note = {
      id: Date.now(),
      title,
      content,
      createdAt: new Date()
    };
    
    this.notes.push(note);
    this.emit('noteAdded', note);
    return note;
  }
  
  checkForKeywords(note) {
    const importantWords = ['urgent', 'important', 'deadline', 'asap'];
    const hasImportantWord = importantWords.some(word => 
      note.title.toLowerCase().includes(word) || 
      note.content.toLowerCase().includes(word)
    );
    
    if (hasImportantWord) {
      this.emit('importantNote', note);
    }
  }
}

const notepad = new SmartNotepad();
notepad.addNote('Grocery List', 'Buy milk, eggs, bread');
notepad.addNote('URGENT Meeting', 'Project deadline discussion ASAP');
