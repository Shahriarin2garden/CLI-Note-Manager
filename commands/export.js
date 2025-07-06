import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { PDFDocument, rgb } from 'pdf-lib';
import { marked } from 'marked';
import archiver from 'archiver';
import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';

const fileHandler = new AdvancedFileHandler();

/**
 * Export notes in various formats
 * @param {string} format - Export format (pdf, html, md, json, zip)
 * @param {array} filters - Optional filters
 */
export async function exportNotes(format, filters = []) {
  try {
    const notes = await fileHandler.readNotes(true);
    
    if (notes.length === 0) {
      console.log(chalk.yellow('No notes to export.'));
      return;
    }

    // Apply filters
    let filteredNotes = notes;
    
    if (filters.length > 0) {
      const filterType = filters[0];
      const filterValue = filters[1];
      
      switch (filterType) {
        case 'category':
          filteredNotes = notes.filter(note => 
            note.category && note.category.toLowerCase() === filterValue.toLowerCase()
          );
          break;
        case 'tag':
          filteredNotes = notes.filter(note => 
            note.tags && note.tags.some(tag => tag.toLowerCase().includes(filterValue.toLowerCase()))
          );
          break;
        case 'date':
          const targetDate = new Date(filterValue);
          filteredNotes = notes.filter(note => {
            const noteDate = new Date(note.createdAt);
            return noteDate.toDateString() === targetDate.toDateString();
          });
          break;
        default:
          console.log(chalk.yellow(`Unknown filter type: ${filterType}`));
      }
    }

    console.log(chalk.cyan(`📦 Exporting ${filteredNotes.length} notes as ${format.toUpperCase()}...`));
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportDir = './data/exports';
    await fs.mkdir(exportDir, { recursive: true });

    switch (format.toLowerCase()) {
      case 'pdf':
        await exportToPDF(filteredNotes, exportDir, timestamp);
        break;
      case 'html':
        await exportToHTML(filteredNotes, exportDir, timestamp);
        break;
      case 'md':
      case 'markdown':
        await exportToMarkdown(filteredNotes, exportDir, timestamp);
        break;
      case 'json':
        await exportToJSON(filteredNotes, exportDir, timestamp);
        break;
      case 'zip':
        await exportToZip(filteredNotes, exportDir, timestamp);
        break;
      default:
        console.log(chalk.red(`❌ Unsupported export format: ${format}`));
        console.log(chalk.gray('Supported formats: pdf, html, md, json, zip'));
        return;
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Export failed:'), error.message);
    throw error;
  }
}

/**
 * Export to PDF format
 */
async function exportToPDF(notes, exportDir, timestamp) {
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage();
  const { width, height } = currentPage.getSize();
  const fontSize = 12;
  const lineHeight = 20;
  let yPosition = height - 50;

  // Title page
  currentPage.drawText('TeleMed Notes Export', {
    x: 50,
    y: yPosition,
    size: 24,
    color: rgb(0, 0, 0.5)
  });
  
  yPosition -= 40;
  currentPage.drawText(`Generated: ${new Date().toLocaleString()}`, {
    x: 50,
    y: yPosition,
    size: 12,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  yPosition -= 40;
  currentPage.drawText(`Total Notes: ${notes.length}`, {
    x: 50,
    y: yPosition,
    size: 12,
    color: rgb(0.5, 0.5, 0.5)
  });

  // Add notes
  for (const note of notes) {
    // Check if we need a new page
    if (yPosition < 100) {
      currentPage = pdfDoc.addPage();
      yPosition = height - 50;
    }

    yPosition -= 40;
    
    // Note title
    currentPage.drawText(note.title, {
      x: 50,
      y: yPosition,
      size: 16,
      color: rgb(0, 0, 0.8)
    });
    
    yPosition -= 20;
    
    // Note metadata
    const metadata = `Category: ${note.category || 'General'} | Created: ${new Date(note.createdAt).toLocaleDateString()}`;
    currentPage.drawText(metadata, {
      x: 50,
      y: yPosition,
      size: 10,
      color: rgb(0.6, 0.6, 0.6)
    });
    
    yPosition -= 30;
    
    // Note content (simplified for PDF)
    const lines = wrapText(note.body, 80);
    for (const line of lines.slice(0, 10)) { // Limit lines per note
      if (yPosition < 50) {
        currentPage = pdfDoc.addPage();
        yPosition = height - 50;
      }
      
      currentPage.drawText(line, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0)
      });
      
      yPosition -= lineHeight;
    }
    
    yPosition -= 20; // Space between notes
  }

  const pdfBytes = await pdfDoc.save();
  const fileName = `notes-export-${timestamp}.pdf`;
  const filePath = path.join(exportDir, fileName);
  
  await fs.writeFile(filePath, pdfBytes);
  console.log(chalk.green(`PDF exported: ${filePath}`));
}

/**
 * Export to HTML format
 */
async function exportToHTML(notes, exportDir, timestamp) {
  const htmlContent = generateHTML(notes);
  const fileName = `notes-export-${timestamp}.html`;
  const filePath = path.join(exportDir, fileName);
  
  await fs.writeFile(filePath, htmlContent);
  console.log(chalk.green(`HTML exported: ${filePath}`));
}

/**
 * Export to Markdown format
 */
async function exportToMarkdown(notes, exportDir, timestamp) {
  let mdContent = `# TeleMed Notes Export\n\nGenerated: ${new Date().toLocaleString()}\nTotal Notes: ${notes.length}\n\n---\n\n`;
  
  notes.forEach((note, index) => {
    mdContent += `## ${note.title}\n\n`;
    mdContent += `**Category:** ${note.category || 'General'}  \n`;
    mdContent += `**Created:** ${new Date(note.createdAt).toLocaleString()}  \n`;
    
    if (note.tags && note.tags.length > 0) {
      mdContent += `**Tags:** ${note.tags.join(', ')}  \n`;
    }
    
    mdContent += `\n${note.body}\n\n`;
    
    if (index < notes.length - 1) {
      mdContent += '---\n\n';
    }
  });
  
  const fileName = `notes-export-${timestamp}.md`;
  const filePath = path.join(exportDir, fileName);
  
  await fs.writeFile(filePath, mdContent);
  console.log(chalk.green(`✅ Markdown exported: ${filePath}`));
}

/**
 * Export to JSON format
 */
async function exportToJSON(notes, exportDir, timestamp) {
  const exportData = {
    exportedAt: new Date().toISOString(),
    totalNotes: notes.length,
    notes: notes.map(note => ({
      ...note,
      exportMetadata: {
        wordCount: note.body.split(' ').length,
        readingTime: Math.ceil(note.body.split(' ').length / 200)
      }
    }))
  };
  
  const fileName = `notes-export-${timestamp}.json`;
  const filePath = path.join(exportDir, fileName);
  
  await fs.writeFile(filePath, JSON.stringify(exportData, null, 2));
  console.log(chalk.green(`✅ JSON exported: ${filePath}`));
}

/**
 * Export to ZIP format with multiple files
 */
async function exportToZip(notes, exportDir, timestamp) {
  const zipFileName = `notes-export-${timestamp}.zip`;
  const zipFilePath = path.join(exportDir, zipFileName);
  
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', { zlib: { level: 9 } });
  
  output.on('close', () => {
    console.log(chalk.green(`✅ ZIP exported: ${zipFilePath} (${archive.pointer()} bytes)`));
  });
  
  archive.pipe(output);
  
  // Add individual note files
  notes.forEach(note => {
    const noteContent = `# ${note.title}\n\nCategory: ${note.category || 'General'}\nCreated: ${new Date(note.createdAt).toLocaleString()}\n\n${note.body}`;
    const sanitizedTitle = note.title.replace(/[^a-zA-Z0-9]/g, '_');
    archive.append(noteContent, { name: `${sanitizedTitle}.md` });
  });
  
  // Add index file
  const indexContent = generateHTML(notes);
  archive.append(indexContent, { name: 'index.html' });
  
  // Add JSON export
  const jsonData = {
    exportedAt: new Date().toISOString(),
    totalNotes: notes.length,
    notes
  };
  archive.append(JSON.stringify(jsonData, null, 2), { name: 'notes.json' });
  
  await archive.finalize();
}

/**
 * Generate HTML content
 */
function generateHTML(notes) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TeleMed Notes Export</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 40px; }
        .note { border-left: 4px solid #3498db; padding: 20px; margin: 20px 0; background: #ecf0f1; }
        .note-title { color: #2c3e50; margin-bottom: 10px; }
        .note-meta { color: #7f8c8d; font-size: 0.9em; margin-bottom: 15px; }
        .note-content { line-height: 1.6; }
        .tag { background: #3498db; color: white; padding: 2px 8px; border-radius: 3px; font-size: 0.8em; margin-right: 5px; }
        .stats { background: #34495e; color: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>TeleMed Notes Export</h1>
        <div class="stats">
            <strong>Generated:</strong> ${new Date().toLocaleString()}<br>
            <strong>Total Notes:</strong> ${notes.length}<br>
            <strong>Total Words:</strong> ${notes.reduce((acc, note) => acc + note.body.split(' ').length, 0).toLocaleString()}
        </div>
        
        ${notes.map(note => `
            <div class="note">
                <h2 class="note-title">${note.title}</h2>
                <div class="note-meta">
                    📁 ${note.category || 'General'} | 
                    📅 ${new Date(note.createdAt).toLocaleString()}
                    ${note.tags && note.tags.length > 0 ? 
                        ` | 🏷️ ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}` 
                        : ''
                    }
                </div>
                <div class="note-content">${note.body.replace(/\n/g, '<br>')}</div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
}

/**
 * Wrap text for PDF
 */
function wrapText(text, maxLength) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines;
}
