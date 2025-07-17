import fs from 'fs/promises';

console.log('Async Programming for CLI');

// Simulate different async operations
function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

async function simulateNoteTasks() {
  console.log('\n=== Async Task Simulation ===');
  
  try {
    console.log('1. Loading configuration...');
    const config = await delay(500, { theme: 'dark', autosave: true });
    console.log('✓ Config loaded:', config);
    
    console.log('2. Initializing note manager...');
    const manager = await delay(300, { status: 'ready', notes: 0 });
    console.log('✓ Manager initialized:', manager);
    
    console.log('3. Loading existing notes...');
    const notes = await delay(700, [
      { id: 1, title: 'Welcome', content: 'Welcome to the note manager' }
    ]);
    console.log(`✓ Loaded ${notes.length} existing notes`);
    
    console.log('4. All tasks completed successfully!');
    
  } catch (error) {
    console.error('✗ Task failed:', error.message);
  }
}

// Demonstrate error handling
async function demonstrateErrorHandling() {
  console.log('\n=== Error Handling ===');
  
  try {
    // Try to read a non-existent file
    await fs.readFile('non-existent-file.json', 'utf8');
  } catch (error) {
    console.log('✓ Caught expected error:', error.code);
  }
  
  // Graceful handling with fallback
  const data = await fs.readFile('fallback-data.json', 'utf8')
    .catch(() => '{"notes": []}'); // Fallback data
  
  console.log('✓ Fallback data used:', JSON.parse(data));
}

// Run demonstrations
await simulateNoteTasks();
await demonstrateErrorHandling();
