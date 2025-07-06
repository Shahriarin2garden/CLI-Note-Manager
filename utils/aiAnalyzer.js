import chalk from 'chalk';
import sentiment from 'sentiment';
import nlp from 'compromise';

/**
 * AI-powered analysis and smart features for notes
 */
export class AIAnalyzer {
  constructor() {
    this.sentimentAnalyzer = new sentiment();
  }

  /**
   * Analyze sentiment of note content
   */
  analyzeSentiment(text) {
    const result = this.sentimentAnalyzer.analyze(text);
    
    let mood = 'neutral';
    if (result.score > 2) mood = 'very positive';
    else if (result.score > 0) mood = 'positive';
    else if (result.score < -2) mood = 'very negative';
    else if (result.score < 0) mood = 'negative';

    return {
      score: result.score,
      comparative: result.comparative,
      mood,
      positive: result.positive,
      negative: result.negative,
      tokens: result.tokens.length
    };
  }

  /**
   * Extract key topics and entities from text
   */
  extractTopics(text) {
    const doc = nlp(text);
    
    return {
      people: doc.people().out('array'),
      places: doc.places().out('array'),
      organizations: doc.organizations().out('array'),
      topics: doc.topics().out('array'),
      nouns: doc.nouns().out('array').slice(0, 10), // Top 10 nouns
      verbs: doc.verbs().out('array').slice(0, 10)   // Top 10 verbs
    };
  }

  /**
   * Auto-generate tags based on content
   */
  generateTags(text, maxTags = 5) {
    const topics = this.extractTopics(text);
    const sentiment = this.analyzeSentiment(text);
    
    let tags = new Set();
    
    // Add topic-based tags
    [...topics.topics, ...topics.nouns].forEach(topic => {
      if (topic.length > 2 && topic.length < 15) {
        tags.add(topic.toLowerCase());
      }
    });

    // Add sentiment tag
    tags.add(sentiment.mood);

    // Add length-based tag
    const wordCount = text.split(' ').length;
    if (wordCount < 50) tags.add('short');
    else if (wordCount > 200) tags.add('long');
    else tags.add('medium');

    // Add entity tags
    if (topics.people.length > 0) tags.add('people');
    if (topics.places.length > 0) tags.add('places');
    if (topics.organizations.length > 0) tags.add('organizations');

    return Array.from(tags).slice(0, maxTags);
  }

  /**
   * Suggest category based on content
   */
  suggestCategory(text) {
    const topics = this.extractTopics(text);
    const lowerText = text.toLowerCase();
    
    // Work-related keywords
    if (lowerText.includes('meeting') || lowerText.includes('project') || 
        lowerText.includes('deadline') || lowerText.includes('task') ||
        topics.organizations.length > 0) {
      return 'Work';
    }
    
    // Personal keywords
    if (lowerText.includes('family') || lowerText.includes('friend') ||
        lowerText.includes('vacation') || lowerText.includes('hobby')) {
      return 'Personal';
    }
    
    // Learning keywords
    if (lowerText.includes('learn') || lowerText.includes('study') ||
        lowerText.includes('course') || lowerText.includes('book')) {
      return 'Learning';
    }
    
    // Health keywords
    if (lowerText.includes('health') || lowerText.includes('doctor') ||
        lowerText.includes('exercise') || lowerText.includes('fitness')) {
      return 'Health';
    }
    
    // Financial keywords
    if (lowerText.includes('money') || lowerText.includes('budget') ||
        lowerText.includes('investment') || lowerText.includes('finance')) {
      return 'Finance';
    }
    
    // Travel keywords
    if (topics.places.length > 0 || lowerText.includes('travel') ||
        lowerText.includes('trip') || lowerText.includes('vacation')) {
      return 'Travel';
    }
    
    return 'General';
  }

  /**
   * Generate summary of the note
   */
  generateSummary(text, maxLength = 100) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (sentences.length <= 1) {
      return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
    }
    
    // Simple extractive summary - take first and most "important" sentences
    const firstSentence = sentences[0].trim();
    let summary = firstSentence;
    
    // Add more sentences if under max length
    for (let i = 1; i < sentences.length && summary.length < maxLength; i++) {
      const sentence = sentences[i].trim();
      if (summary.length + sentence.length < maxLength) {
        summary += '. ' + sentence;
      }
    }
    
    return summary + (text.length > summary.length ? '...' : '');
  }

  /**
   * Find similar notes based on content
   */
  findSimilarNotes(targetNote, allNotes, limit = 3) {
    const targetTopics = this.extractTopics(targetNote.body);
    const targetTags = new Set(targetNote.tags || []);
    
    const similarities = allNotes
      .filter(note => note.id !== targetNote.id)
      .map(note => {
        const noteTopics = this.extractTopics(note.body);
        const noteTags = new Set(note.tags || []);
        
        let score = 0;
        
        // Category match
        if (note.category === targetNote.category) score += 0.3;
        
        // Tag overlap
        const tagOverlap = [...targetTags].filter(tag => noteTags.has(tag)).length;
        score += tagOverlap * 0.2;
        
        // Topic overlap
        const topicOverlap = targetTopics.nouns.filter(noun => 
          noteTopics.nouns.includes(noun)
        ).length;
        score += topicOverlap * 0.1;
        
        // People/places overlap
        const peopleOverlap = targetTopics.people.filter(person =>
          noteTopics.people.includes(person)
        ).length;
        score += peopleOverlap * 0.2;
        
        const placesOverlap = targetTopics.places.filter(place =>
          noteTopics.places.includes(place)
        ).length;
        score += placesOverlap * 0.2;
        
        return { note, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
    return similarities.filter(sim => sim.score > 0.1).map(sim => sim.note);
  }

  /**
   * Analyze writing patterns and provide insights
   */
  analyzeWritingPattern(notes) {
    if (!notes.length) return null;
    
    const patterns = {
      averageLength: 0,
      sentimentTrend: [],
      commonTopics: {},
      writingTimes: {},
      productivityMetrics: {}
    };
    
    let totalWords = 0;
    const sentiments = [];
    const allTopics = [];
    
    notes.forEach(note => {
      const wordCount = note.body.split(' ').length;
      totalWords += wordCount;
      
      const sentiment = this.analyzeSentiment(note.body);
      sentiments.push(sentiment.score);
      
      const topics = this.extractTopics(note.body);
      allTopics.push(...topics.nouns);
      
      // Track writing time
      const hour = new Date(note.createdAt).getHours();
      patterns.writingTimes[hour] = (patterns.writingTimes[hour] || 0) + 1;
    });
    
    patterns.averageLength = Math.round(totalWords / notes.length);
    patterns.sentimentTrend = sentiments;
    
    // Find common topics
    allTopics.forEach(topic => {
      patterns.commonTopics[topic] = (patterns.commonTopics[topic] || 0) + 1;
    });
    
    // Sort topics by frequency
    patterns.commonTopics = Object.fromEntries(
      Object.entries(patterns.commonTopics)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    );
    
    return patterns;
  }
}

export default new AIAnalyzer();
