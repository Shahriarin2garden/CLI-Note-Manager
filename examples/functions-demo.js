console.log('Function Types in CLI Development');

// CLI command handler (function declaration)
function handleAddCommand(title, content) {
  const note = createNote(title, content);
  return note;
}

function createNote(title, content) {
  return {
    id: Date.now(),
    title,
    content,
    created: new Date().toISOString()
  };
}

// Data processor (function expression)
const processNoteData = function(notes) {
  return notes.map(note => ({
    ...note,
    summary: note.content.substring(0, 50) + '...'
  }));
};

// Quick formatter (arrow function)
const displayNote = (note) => `[${note.id}] ${note.title}`;

// Test the functions
const newNote = handleAddCommand('Test Note', 'This is test content');
console.log(`Note "${newNote.title}" created with ID: ${newNote.id}`);
const processed = processNoteData([newNote]);
console.log(displayNote(processed[0]));
