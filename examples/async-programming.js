import fs from 'fs/promises';

console.log('=== Async Programming Examples ===\n');

// The modern way (clean and readable)
console.log('--- Modern Async/Await Approach ---');

async function createBackup() {
  try {
    // Create some sample files first
    await fs.writeFile('notes.json', JSON.stringify({notes: ['Note 1', 'Note 2']}, null, 2));
    await fs.writeFile('config.json', JSON.stringify({theme: 'dark', auto_save: true}, null, 2));
    
    console.log('Sample files created...');
    
    const notesData = await fs.readFile('notes.json', 'utf8');
    const notes = JSON.parse(notesData);
    
    const configData = await fs.readFile('config.json', 'utf8');
    const config = JSON.parse(configData);
    
    const backup = { notes, config, createdAt: new Date().toISOString() };
    await fs.writeFile('backup.json', JSON.stringify(backup, null, 2));
    
    console.log('✅ Backup created successfully!');
    
    // Show the backup content
    const backupContent = await fs.readFile('backup.json', 'utf8');
    console.log('📄 Backup content:');
    console.log(backupContent);
    
    // Clean up
    await fs.unlink('notes.json');
    await fs.unlink('config.json');
    await fs.unlink('backup.json');
    console.log('🧹 Cleanup completed');
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
  }
}

// Parallel operations - even better!
console.log('\n--- Parallel Async Operations ---');

async function createAdvancedBackup() {
  try {
    // Create sample files
    await Promise.all([
      fs.writeFile('parallel-notes.json', JSON.stringify({notes: ['Parallel Note 1', 'Parallel Note 2']}, null, 2)),
      fs.writeFile('parallel-config.json', JSON.stringify({theme: 'light', version: '2.0'}, null, 2))
    ]);
    
    console.log('Parallel sample files created...');
    
    // These run at the same time - much faster!
    const [notesData, configData] = await Promise.all([
      fs.readFile('parallel-notes.json', 'utf8'),
      fs.readFile('parallel-config.json', 'utf8')
    ]);
    
    const backup = {
      notes: JSON.parse(notesData),
      config: JSON.parse(configData),
      createdAt: new Date().toISOString(),
      method: 'parallel'
    };
    
    await fs.writeFile('parallel-backup.json', JSON.stringify(backup, null, 2));
    console.log('⚡ Advanced parallel backup completed!');
    
    // Show the backup content
    const backupContent = await fs.readFile('parallel-backup.json', 'utf8');
    console.log('📄 Parallel backup content:');
    console.log(backupContent);
    
    // Clean up
    await Promise.all([
      fs.unlink('parallel-notes.json'),
      fs.unlink('parallel-config.json'),
      fs.unlink('parallel-backup.json')
    ]);
    console.log('🧹 Parallel cleanup completed');
    
  } catch (error) {
    console.error('❌ Advanced backup failed:', error.message);
  }
}

// Run both examples
async function runAllExamples() {
  await createBackup();
  console.log('\n' + '='.repeat(50) + '\n');
  await createAdvancedBackup();
}

runAllExamples();
