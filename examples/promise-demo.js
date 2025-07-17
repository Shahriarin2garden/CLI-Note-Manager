console.log('Promise Demo - Loading Notes');

// Creating promises for CLI operations
function loadNotesAsync() {
  return new Promise((resolve, reject) => {
    console.log(`Start time: ${new Date().toLocaleTimeString()}`);
    console.log('Loading notes...');
    
    setTimeout(() => {
      // Simulate loading notes
      const notes = [
        { id: 1, title: 'First Note', content: 'Content 1' },
        { id: 2, title: 'Second Note', content: 'Content 2' }
      ];
      console.log('Notes loaded from storage');
      resolve(notes);
    }, 1000);
  });
}

// Using promises
loadNotesAsync()
  .then(notes => {
    console.log(`✓ Loaded ${notes.length} notes`);
    return notes.map(note => note.title);
  })
  .then(titles => {
    console.log('Processing note titles...');
    console.log(`✓ Note titles: ${titles.join(', ')}`);
    console.log(`End time: ${new Date().toLocaleTimeString()}`);
  })
  .catch(error => {
    console.error('Failed to load notes:', error);
  });
