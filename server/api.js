import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import chalk from 'chalk';
import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import aiAnalyzer from '../utils/aiAnalyzer.js';

const app = express();
const fileHandler = new AdvancedFileHandler();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({
  dest: './data/attachments/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Start the API server
 */
export async function startServer() {
  console.log(chalk.blue.bold('\n🌐 Starting NoteCLI API Server...'));
  
  // Routes
  setupRoutes();
  
  app.listen(PORT, () => {
    console.log(chalk.green.bold(`Server running on http://localhost:${PORT}`));
    console.log(chalk.gray('API endpoints:'));
    console.log(chalk.gray('  GET    /api/notes           - Get all notes'));
    console.log(chalk.gray('  POST   /api/notes           - Create a new note'));
    console.log(chalk.gray('  GET    /api/notes/:id       - Get a specific note'));
    console.log(chalk.gray('  PUT    /api/notes/:id       - Update a note'));
    console.log(chalk.gray('  DELETE /api/notes/:id       - Delete a note'));
    console.log(chalk.gray('  GET    /api/search/:query   - Search notes'));
    console.log(chalk.gray('  POST   /api/analyze/:id     - AI analysis of a note'));
    console.log(chalk.gray('  GET    /api/analytics       - Get analytics data'));
    console.log(chalk.gray('  POST   /api/upload          - Upload attachment'));
    console.log(chalk.gray('\nPress Ctrl+C to stop the server'));
  });
}

/**
 * Setup API routes
 */
function setupRoutes() {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      version: '2.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // Get all notes
  app.get('/api/notes', async (req, res) => {
    try {
      const { category, tag, limit, offset } = req.query;
      let notes = await fileHandler.readNotes(true);
      
      // Apply filters
      if (category) {
        notes = notes.filter(note => 
          note.category && note.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (tag) {
        notes = notes.filter(note => 
          note.tags && note.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
        );
      }
      
      // Sort by creation date (newest first)
      notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      // Pagination
      const start = parseInt(offset) || 0;
      const count = parseInt(limit) || notes.length;
      const paginatedNotes = notes.slice(start, start + count);
      
      res.json({
        notes: paginatedNotes,
        total: notes.length,
        offset: start,
        limit: count
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific note
  app.get('/api/notes/:id', async (req, res) => {
    try {
      const note = await fileHandler.findNote({ id: parseInt(req.params.id) });
      
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      res.json(note);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create a new note
  app.post('/api/notes', async (req, res) => {
    try {
      const { title, body, category, tags, aiEnhanced = true } = req.body;
      
      if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' });
      }
      
      const notes = await fileHandler.readNotes(true);
      
      // Check for duplicate title
      const existingNote = notes.find(note => 
        note.title.toLowerCase() === title.toLowerCase()
      );
      
      if (existingNote) {
        return res.status(409).json({ error: 'Note with this title already exists' });
      }
      
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        body: body.trim(),
        category: category || 'General',
        tags: tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {}
      };
      
      // AI Enhancement
      if (aiEnhanced) {
        const sentiment = aiAnalyzer.analyzeSentiment(body);
        const topics = aiAnalyzer.extractTopics(body);
        const autoTags = aiAnalyzer.generateTags(body);
        const suggestedCategory = aiAnalyzer.suggestCategory(body);
        
        newNote.metadata = {
          sentiment,
          topics,
          wordCount: body.split(' ').length,
          readingTime: Math.ceil(body.split(' ').length / 200)
        };
        
        // Merge auto-generated tags with provided tags
        const allTags = [...new Set([...newNote.tags, ...autoTags])];
        newNote.tags = allTags;
        
        // Use suggested category if none provided
        if (!category) {
          newNote.category = suggestedCategory;
        }
      }
      
      notes.push(newNote);
      await fileHandler.writeNotes(notes);
      
      res.status(201).json(newNote);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update a note
  app.put('/api/notes/:id', async (req, res) => {
    try {
      const notes = await fileHandler.readNotes(true);
      const noteIndex = notes.findIndex(note => note.id === parseInt(req.params.id));
      
      if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      const { title, body, category, tags } = req.body;
      const existingNote = notes[noteIndex];
      
      // Update note
      const updatedNote = {
        ...existingNote,
        title: title || existingNote.title,
        body: body || existingNote.body,
        category: category || existingNote.category,
        tags: tags || existingNote.tags,
        updatedAt: new Date().toISOString()
      };
      
      // Re-analyze if content changed
      if (body && body !== existingNote.body) {
        const sentiment = aiAnalyzer.analyzeSentiment(body);
        const topics = aiAnalyzer.extractTopics(body);
        
        updatedNote.metadata = {
          ...updatedNote.metadata,
          sentiment,
          topics,
          wordCount: body.split(' ').length,
          readingTime: Math.ceil(body.split(' ').length / 200)
        };
      }
      
      notes[noteIndex] = updatedNote;
      await fileHandler.writeNotes(notes);
      
      res.json(updatedNote);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a note
  app.delete('/api/notes/:id', async (req, res) => {
    try {
      const notes = await fileHandler.readNotes(true);
      const noteIndex = notes.findIndex(note => note.id === parseInt(req.params.id));
      
      if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      const deletedNote = notes.splice(noteIndex, 1)[0];
      await fileHandler.writeNotes(notes);
      
      res.json({ message: 'Note deleted successfully', note: deletedNote });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Search notes
  app.get('/api/search/:query', async (req, res) => {
    try {
      const { query } = req.params;
      const { category, tag } = req.query;
      
      const results = await fileHandler.searchNotes(query, {
        searchIn: ['title', 'body', 'tags'],
        caseSensitive: false
      });
      
      // Apply additional filters
      let filteredResults = results;
      
      if (category) {
        filteredResults = filteredResults.filter(note => 
          note.category && note.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      if (tag) {
        filteredResults = filteredResults.filter(note => 
          note.tags && note.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
        );
      }
      
      res.json({
        query,
        results: filteredResults,
        count: filteredResults.length
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI analysis of a note
  app.post('/api/analyze/:id', async (req, res) => {
    try {
      const note = await fileHandler.findNote({ id: parseInt(req.params.id) });
      
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      
      const sentiment = aiAnalyzer.analyzeSentiment(note.body);
      const topics = aiAnalyzer.extractTopics(note.body);
      const autoTags = aiAnalyzer.generateTags(note.body);
      const suggestedCategory = aiAnalyzer.suggestCategory(note.body);
      const summary = aiAnalyzer.generateSummary(note.body);
      
      // Find similar notes
      const allNotes = await fileHandler.readNotes(true);
      const similarNotes = aiAnalyzer.findSimilarNotes(
        note, 
        allNotes.filter(n => n.id !== note.id), 
        3
      );
      
      const analysis = {
        noteId: note.id,
        sentiment,
        topics,
        suggestedTags: autoTags,
        suggestedCategory,
        summary,
        similarNotes: similarNotes.map(n => ({ id: n.id, title: n.title })),
        wordCount: note.body.split(' ').length,
        readingTime: Math.ceil(note.body.split(' ').length / 200),
        analyzedAt: new Date().toISOString()
      };
      
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get analytics
  app.get('/api/analytics', async (req, res) => {
    try {
      const analytics = await fileHandler.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Upload attachment
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const { noteId } = req.body;
      
      if (noteId) {
        const note = await fileHandler.findNote({ id: parseInt(noteId) });
        if (!note) {
          return res.status(404).json({ error: 'Note not found' });
        }
      }
      
      const fileInfo = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: req.file.path,
        uploadedAt: new Date().toISOString()
      };
      
      res.json({
        message: 'File uploaded successfully',
        file: fileInfo
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve a simple web interface
  app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NoteCLI API</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        .endpoint { background: #ecf0f1; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .method { background: #3498db; color: white; padding: 2px 8px; border-radius: 3px; font-size: 0.8em; }
        .method.post { background: #2ecc71; }
        .method.put { background: #f39c12; }
        .method.delete { background: #e74c3c; }
        code { background: #34495e; color: white; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>NoteCLI API v2.0</h1>
        <p>Welcome to the NoteCLI REST API server. This API provides access to your notes with AI-powered features.</p>
        
        <h2>📋 Available Endpoints</h2>
        
        <div class="endpoint">
            <span class="method">GET</span> <code>/api/health</code><br>
            Health check endpoint
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <code>/api/notes</code><br>
            Get all notes (supports ?category, ?tag, ?limit, ?offset)
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/api/notes</code><br>
            Create a new note with AI enhancement
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <code>/api/notes/:id</code><br>
            Get a specific note by ID
        </div>
        
        <div class="endpoint">
            <span class="method put">PUT</span> <code>/api/notes/:id</code><br>
            Update an existing note
        </div>
        
        <div class="endpoint">
            <span class="method delete">DELETE</span> <code>/api/notes/:id</code><br>
            Delete a note
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <code>/api/search/:query</code><br>
            Search notes by keyword
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/api/analyze/:id</code><br>
            AI analysis of a specific note
        </div>
        
        <div class="endpoint">
            <span class="method">GET</span> <code>/api/analytics</code><br>
            Get comprehensive analytics
        </div>
        
        <div class="endpoint">
            <span class="method post">POST</span> <code>/api/upload</code><br>
            Upload file attachment
        </div>
        
        <h2>🤖 AI Features</h2>
        <ul>
            <li>Automatic sentiment analysis</li>
            <li>Smart categorization</li>
            <li>Auto-tag generation</li>
            <li>Topic extraction</li>
            <li>Similar note detection</li>
            <li>Content summarization</li>
        </ul>
        
        <h2>Documentation</h2>
        <p>For detailed API documentation and examples, please refer to the CLI help or the project README.</p>
    </div>
</body>
</html>
    `);
  });
}

export default { startServer };
