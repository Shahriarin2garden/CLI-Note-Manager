console.log('Node.js Runtime Environment Training');

// First, let's see what Node.js tells us about itself
console.log('\n1. Node.js Runtime Information:');
console.log('Node.js Version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);
console.log('Process ID:', process.pid);
console.log('Current Working Directory:', process.cwd());
console.log('Uptime (seconds):', Math.floor(process.uptime()));

// Working with command line arguments
console.log('\n2. Command Line Arguments:');
console.log('Script arguments:', process.argv.slice(2));

const args = process.argv.slice(2);
if (args.length > 0) {
  console.log(`Processing ${args.length} arguments:`);
  args.forEach((arg, index) => {
    console.log(`  Arg ${index + 1}: ${arg}`);
  });
} else {
  console.log('No arguments provided. Try: node nodejs-runtime.js hello world');
}

import fs from 'fs/promises';
import path from 'path';

console.log('\n3. File System Operations:');

async function demonstrateFileOperations() {
  try {
    const fileName = 'training-example.txt';
    const content = `Training file created at: ${new Date().toISOString()}\nNode.js version: ${process.version}`;
    
    await fs.writeFile(fileName, content);
    console.log(`✅ File '${fileName}' created successfully`);
    
    const readContent = await fs.readFile(fileName, 'utf8');
    console.log('📖 File contents:');
    console.log(readContent);
    
    const stats = await fs.stat(fileName);
    console.log('📊 File stats:');
    console.log(`- Size: ${stats.size} bytes`);
    console.log(`- Created: ${stats.birthtime}`);
    
    await fs.unlink(fileName);
    console.log(`🗑️ File '${fileName}' deleted`);
    
  } catch (error) {
    console.error('❌ File operation error:', error.message);
  }
}

demonstrateFileOperations();
