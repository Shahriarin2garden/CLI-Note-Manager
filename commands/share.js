import chalk from 'chalk';
import qrcode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';
import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';

const fileHandler = new AdvancedFileHandler();

/**
 * Share notes via various methods
 * @param {string} title - The title of the note to share
 * @param {string} method - Sharing method (qr, link, text)
 */
export async function shareNote(title, method = 'qr') {
  try {
    const note = await fileHandler.findNote({ title });
    
    if (!note) {
      console.log(chalk.red(`Note "${title}" not found.`));
      return;
    }

    console.log(chalk.blue.bold(`\n🌐 Sharing: "${note.title}"`));
    console.log('═'.repeat(50));

    switch (method.toLowerCase()) {
      case 'qr':
        await shareViaQR(note);
        break;
      case 'link':
        await shareViaLink(note);
        break;
      case 'text':
        await shareAsText(note);
        break;
      case 'json':
        await shareAsJSON(note);
        break;
      default:
        console.log(chalk.yellow('📤 Available sharing methods:'));
        console.log(chalk.gray('  • qr    - Generate QR code'));
        console.log(chalk.gray('  • link  - Generate shareable link'));
        console.log(chalk.gray('  • text  - Export as formatted text'));
        console.log(chalk.gray('  • json  - Export as JSON'));
        break;
    }
    
  } catch (error) {
    console.error(chalk.red('Failed to share note:'), error.message);
    throw error;
  }
}

/**
 * Share note via QR code
 */
async function shareViaQR(note) {
  try {
    const noteData = {
      title: note.title,
      content: note.body,
      category: note.category,
      tags: note.tags,
      createdAt: note.createdAt,
      sharedAt: new Date().toISOString(),
      source: 'TeleMed Notes'
    };
    
    const jsonData = JSON.stringify(noteData);
    
    // Generate QR code
    const qrString = await qrcode.toString(jsonData, {
      type: 'terminal',
      small: true
    });
    
    console.log(chalk.cyan('📱 QR Code:'));
    console.log(qrString);
    
    // Also save as image
    const qrDir = './data/exports/qr';
    await fs.mkdir(qrDir, { recursive: true });
    
    const sanitizedTitle = note.title.replace(/[^a-zA-Z0-9]/g, '_');
    const qrImagePath = path.join(qrDir, `${sanitizedTitle}_qr.png`);
    
    await qrcode.toFile(qrImagePath, jsonData, {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300
    });
    
    console.log(chalk.green(`✅ QR code saved: ${qrImagePath}`));
    console.log(chalk.gray('Tip: Scan with any QR reader to import the note'));
    
  } catch (error) {
    console.error(chalk.red('Failed to generate QR code:'), error.message);
  }
}

/**
 * Share note via link (simulated)
 */
async function shareViaLink(note) {
  // In a real application, this would upload to a cloud service
  const shareId = Buffer.from(note.id.toString()).toString('base64');
  const shareUrl = `https://telemed-notes.app/shared/${shareId}`;
  
  console.log(chalk.cyan('🔗 Shareable Link:'));
  console.log(chalk.blue.underline(shareUrl));
  console.log(chalk.gray('\n📋 Link copied to clipboard (simulated)'));
  console.log(chalk.gray('⏰ Link expires in 7 days'));
  
  // Save share record
  const shareRecord = {
    noteId: note.id,
    shareId,
    shareUrl,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 0,
    isActive: true
  };
  
  const shareDir = './data/exports/shares';
  await fs.mkdir(shareDir, { recursive: true });
  
  const shareFilePath = path.join(shareDir, `${shareId}.json`);
  await fs.writeFile(shareFilePath, JSON.stringify(shareRecord, null, 2));
  
  console.log(chalk.yellow('\n⚠️  Security Notice:'));
  console.log(chalk.gray('• Anyone with this link can view the note'));
  console.log(chalk.gray('• Consider the sensitivity of the content'));
  console.log(chalk.gray('• Link will expire automatically in 7 days'));
}

/**
 * Share note as formatted text
 */
async function shareAsText(note) {
  const formattedText = formatNoteAsText(note);
  
  const shareDir = './data/exports/text';
  await fs.mkdir(shareDir, { recursive: true });
  
  const sanitizedTitle = note.title.replace(/[^a-zA-Z0-9]/g, '_');
  const textFilePath = path.join(shareDir, `${sanitizedTitle}.txt`);
  
  await fs.writeFile(textFilePath, formattedText);
  
  console.log(chalk.cyan('📄 Formatted Text:'));
  console.log(chalk.white(formattedText));
  console.log(chalk.green(`\n✅ Text file saved: ${textFilePath}`));
}

/**
 * Share note as JSON
 */
async function shareAsJSON(note) {
  const jsonData = {
    title: note.title,
    content: note.body,
    category: note.category || 'General',
    tags: note.tags || [],
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    metadata: note.metadata || {},
    exportedAt: new Date().toISOString(),
    exportedBy: 'TeleMed Notes v2.0'
  };
  
  const shareDir = './data/exports/json';
  await fs.mkdir(shareDir, { recursive: true });
  
  const sanitizedTitle = note.title.replace(/[^a-zA-Z0-9]/g, '_');
  const jsonFilePath = path.join(shareDir, `${sanitizedTitle}.json`);
  
  await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2));
  
  console.log(chalk.cyan('JSON Data:'));
  console.log(chalk.white(JSON.stringify(jsonData, null, 2)));
  console.log(chalk.green(`\n✅ JSON file saved: ${jsonFilePath}`));
  console.log(chalk.gray('Note: This format can be imported back into TeleMed Notes'));
}

/**
 * Format note as readable text
 */
function formatNoteAsText(note) {
  return `
╔══════════════════════════════════════════════════════════════════════╗
║                           TELEMED NOTES                             ║
╚══════════════════════════════════════════════════════════════════════╝

Title: ${note.title}
Category: ${note.category || 'General'}
Created: ${new Date(note.createdAt).toLocaleString()}
${note.tags && note.tags.length > 0 ? `Tags: ${note.tags.join(', ')}` : ''}

${note.body.split('\n').map(line => `${line}`).join('\n')}

────────────────────────────────────────────────────────────────────────
Exported from TeleMed Notes v2.0 on ${new Date().toLocaleString()}
Word Count: ${note.body.split(' ').length}
Reading Time: ~${Math.ceil(note.body.split(' ').length / 200)} minutes
`;
}

/**
 * List all shared notes
 */
export async function listSharedNotes() {
  try {
    const shareDir = './data/exports/shares';
    
    try {
      const shareFiles = await fs.readdir(shareDir);
      
      if (shareFiles.length === 0) {
        console.log(chalk.yellow('📤 No shared notes found.'));
        return;
      }
      
      console.log(chalk.blue.bold('\n🌐 Shared Notes:'));
      console.log('═'.repeat(60));
      
      for (const shareFile of shareFiles) {
        if (!shareFile.endsWith('.json')) continue;
        
        const shareFilePath = path.join(shareDir, shareFile);
        const shareData = JSON.parse(await fs.readFile(shareFilePath, 'utf8'));
        
        const note = await fileHandler.findNote({ id: shareData.noteId });
        const isExpired = new Date() > new Date(shareData.expiresAt);
        
        console.log(chalk.cyan(`\n📋 ${note ? note.title : 'Unknown Note'}`));
        console.log(chalk.gray(`   URL: ${shareData.shareUrl}`));
        console.log(chalk.gray(`   Created: ${new Date(shareData.createdAt).toLocaleString()}`));
        console.log(chalk.gray(`   Expires: ${new Date(shareData.expiresAt).toLocaleString()}`));
        console.log(isExpired ? chalk.red('   Status: Expired') : chalk.green('   Status: Active'));
        console.log(chalk.gray(`   Views: ${shareData.viewCount}`));
      }
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(chalk.yellow('📤 No shared notes found.'));
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    console.error(chalk.red('Failed to list shared notes:'), error.message);
    throw error;
  }
}
