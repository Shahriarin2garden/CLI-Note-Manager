// Simple Node.js environment demonstration
console.log('=== Node.js Environment Demo ===\n');

// Environment Information
function showEnvironment() {
  console.log('=== Environment ===');
  console.log('Node.js:', process.version);
  console.log('Platform:', process.platform);
  console.log('Architecture:', process.arch);
  console.log('Directory:', process.cwd());
  console.log('Arguments:', process.argv.slice(2).join(', ') || 'none');
}

// File operations demo
import fs from 'fs/promises';

async function demonstrateFileOps() {
  console.log('\n=== File Operations ===');
  
  const testFile = 'test-note.json';
  const noteData = {
    title: 'Test Note',
    content: 'This is a test note for the demo',
    created: new Date().toISOString()
  };
  
  try {
    // Write file
    await fs.writeFile(testFile, JSON.stringify(noteData, null, 2));
    console.log(`✓ Created ${testFile}`);
    
    // Read file
    const data = await fs.readFile(testFile, 'utf8');
    const parsed = JSON.parse(data);
    console.log(`✓ Read note: ${parsed.title}`);
    
    // File stats
    const stats = await fs.stat(testFile);
    console.log(`✓ File size: ${stats.size} bytes`);
    
    // Clean up
    await fs.unlink(testFile);
    console.log(`✓ Cleaned up ${testFile}`);
    
  } catch (error) {
    console.error('✗ File operation failed:', error.message);
  }
}

// Run demonstrations
console.log('Testing Node.js environment:');
showEnvironment();
await demonstrateFileOps();

console.log('\n✅ Node.js environment demonstration complete!');
