console.log('Closures in CLI Development');

// Create a note counter with private state
function createNoteCounter() {
  let count = 0;
  let history = [];
  
  return {
    increment(reason = 'note added') {
      count++;
      history.push({ count, reason, timestamp: Date.now() });
      return count;
    },
    
    decrement(reason = 'note removed') {
      if (count > 0) {
        count--;
        history.push({ count, reason, timestamp: Date.now() });
      }
      return count;
    },
    
    getCurrent() {
      return count;
    },
    
    getHistory() {
      return [...history];
    },
    
    reset() {
      const oldCount = count;
      count = 0;
      history = [];
      console.log(`Counter reset from ${oldCount} to 0`);
    }
  };
}

// Test the counter
const counter = createNoteCounter();

console.log('Current count:', counter.getCurrent());
console.log('After adding 3 notes:', counter.increment('bulk import'));
counter.increment('manual add');
counter.increment('API import');

console.log('Current count:', counter.getCurrent());
counter.decrement('note deleted');
console.log('After deletion:', counter.getCurrent());

console.log('History:', counter.getHistory());
