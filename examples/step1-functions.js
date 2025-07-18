// Simple function types demonstration
console.log('=== JavaScript Function Types Demo ===\n');

// Function Declaration (hoisted) - CLI command handler
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

// Function Expression (not hoisted) - Data processor
const processNoteData = function(notes) {
  return notes.map(note => ({
    ...note,
    summary: note.content.substring(0, 50) + '...'
  }));
};

// Arrow Function (modern syntax) - Quick formatter
const displayNote = (note) => `[${note.id}] ${note.title}`;

// Test the functions
console.log('Testing function types:');
const newNote = handleAddCommand('Test Note', 'This is test content');
console.log(`Note "${newNote.title}" created with ID: ${newNote.id}`);

const processed = processNoteData([newNote]);
console.log(displayNote(processed[0]));

console.log('\n✅ Function types demonstration complete!');
