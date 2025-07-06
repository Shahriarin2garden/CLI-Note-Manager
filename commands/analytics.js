import chalk from 'chalk';
import { AdvancedFileHandler } from '../utils/advancedFileHandler.js';
import aiAnalyzer from '../utils/aiAnalyzer.js';

const fileHandler = new AdvancedFileHandler();

/**
 * Analytics manager for note insights and statistics
 */
export class AnalyticsManager {
  /**
   * Show comprehensive analytics
   */
  async show(period = 'all') {
    try {
      const analytics = await fileHandler.getAnalytics();
      
      console.log(chalk.blue.bold('\nTeleMed Notes Analytics Dashboard'));
      console.log('═'.repeat(70));
      
      // Overview statistics
      console.log(chalk.cyan.bold('\n📈 Overview:'));
      console.log(chalk.white(`Total Notes: ${analytics.totalNotes.toLocaleString()}`));
      console.log(chalk.white(`Total Words: ${analytics.totalWords.toLocaleString()}`));
      console.log(chalk.white(`📅 This Week: ${analytics.notesThisWeek} notes`));
      console.log(chalk.white(`📆 This Month: ${analytics.notesThisMonth} notes`));
      
      // Productivity metrics
      const avgWordsPerNote = Math.round(analytics.totalWords / analytics.totalNotes);
      const totalReadingTime = Math.ceil(analytics.totalWords / 200);
      
      console.log(chalk.cyan.bold('\n⚡ Productivity:'));
      console.log(chalk.white(`✍️  Average words per note: ${avgWordsPerNote}`));
      console.log(chalk.white(`⏱️  Total reading time: ~${totalReadingTime} minutes`));
      console.log(chalk.white(`📖 Average reading time: ~${Math.round(totalReadingTime / analytics.totalNotes)} min/note`));
      
      // Writing patterns
      if (analytics.wordCount) {
        console.log(chalk.cyan.bold('\n📝 Writing Patterns:'));
        console.log(chalk.white(`📏 Shortest note: ${analytics.wordCount.min} words`));
        console.log(chalk.white(`📏 Longest note: ${analytics.wordCount.max} words`));
        console.log(chalk.white(`📏 Median length: ${Math.round(analytics.wordCount.median)} words`));
      }
      
      // Category breakdown
      if (Object.keys(analytics.categories).length > 0) {
        console.log(chalk.cyan.bold('\n📁 Categories:'));
        Object.entries(analytics.categories)
          .sort(([,a], [,b]) => b - a)
          .forEach(([category, count]) => {
            const percentage = ((count / analytics.totalNotes) * 100).toFixed(1);
            const bar = '█'.repeat(Math.round(percentage / 2));
            console.log(chalk.white(`   ${category.padEnd(15)} ${count.toString().padStart(3)} (${percentage}%) ${chalk.blue(bar)}`));
          });
      }
      
      // Popular tags
      if (Object.keys(analytics.tags).length > 0) {
        console.log(chalk.cyan.bold('\n🏷️  Popular Tags:'));
        Object.entries(analytics.tags)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .forEach(([tag, count]) => {
            console.log(chalk.magenta(`   #${tag} (${count})`));
          });
      }
      
      // Activity patterns
      if (analytics.creationPattern) {
        console.log(chalk.cyan.bold('\n🕐 Activity Patterns:'));
        this.displayActivityChart(analytics.creationPattern);
      }
      
      // Recent activity
      await this.showRecentActivity();
      
      console.log('\n' + '═'.repeat(70));
      
    } catch (error) {
      console.error(chalk.red('❌ Failed to generate analytics:'), error.message);
      throw error;
    }
  }
  
  /**
   * Show writing insights and AI analysis
   */
  async showInsights() {
    try {
      const notes = await fileHandler.readNotes(true);
      
      if (notes.length === 0) {
        console.log(chalk.yellow('📝 No notes available for analysis.'));
        return;
      }
      
      console.log(chalk.blue.bold('\n🧠 Writing Insights & AI Analysis'));
      console.log('═'.repeat(70));
      
      // Analyze writing patterns
      const patterns = aiAnalyzer.analyzeWritingPattern(notes);
      
      if (patterns) {
        console.log(chalk.cyan.bold('\n✍️  Writing Style Analysis:'));
        console.log(chalk.white(`📏 Average note length: ${patterns.averageLength} words`));
        
        // Sentiment trend
        if (patterns.sentimentTrend.length > 0) {
          const avgSentiment = patterns.sentimentTrend.reduce((a, b) => a + b, 0) / patterns.sentimentTrend.length;
          let moodDescription = 'neutral';
          if (avgSentiment > 1) moodDescription = 'positive';
          else if (avgSentiment > 2) moodDescription = 'very positive';
          else if (avgSentiment < -1) moodDescription = 'negative';
          else if (avgSentiment < -2) moodDescription = 'very negative';
          
          console.log(chalk.white(`💭 Overall mood: ${moodDescription} (${avgSentiment.toFixed(2)})`));
        }
        
        // Common topics
        if (Object.keys(patterns.commonTopics).length > 0) {
          console.log(chalk.cyan.bold('\n🔍 Most Discussed Topics:'));
          Object.entries(patterns.commonTopics)
            .slice(0, 8)
            .forEach(([topic, frequency]) => {
              console.log(chalk.white(`   ${topic} (mentioned ${frequency} times)`));
            });
        }
        
        // Writing time patterns
        if (Object.keys(patterns.writingTimes).length > 0) {
          console.log(chalk.cyan.bold('\n⏰ Preferred Writing Times:'));
          const peakHour = Object.entries(patterns.writingTimes)
            .sort(([,a], [,b]) => b - a)[0];
          
          console.log(chalk.white(`   Peak writing hour: ${this.formatHour(peakHour[0])} (${peakHour[1]} notes)`));
          
          // Show distribution
          this.displayWritingTimeChart(patterns.writingTimes);
        }
      }
      
      // Content analysis
      console.log(chalk.cyan.bold('\n📊 Content Analysis:'));
      const categorizedNotes = this.categorizeByComplexity(notes);
      
      console.log(chalk.white(`📝 Simple notes (< 100 words): ${categorizedNotes.simple}`));
      console.log(chalk.white(`📄 Medium notes (100-300 words): ${categorizedNotes.medium}`));
      console.log(chalk.white(`📚 Long notes (> 300 words): ${categorizedNotes.long}`));
      
      // Productivity recommendations
      console.log(chalk.cyan.bold('\n💡 Productivity Recommendations:'));
      this.generateRecommendations(notes, patterns);
      
    } catch (error) {
      console.error(chalk.red('❌ Failed to generate insights:'), error.message);
      throw error;
    }
  }
  
  /**
   * Display activity chart
   */
  displayActivityChart(pattern) {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const maxActivity = Math.max(...Object.values(pattern));
    
    console.log(chalk.gray('   Hours: 00  04  08  12  16  20'));
    console.log(chalk.gray('          │   │   │   │   │   │'));
    
    const chart = hours.map(hour => {
      const activity = pattern[hour] || 0;
      const intensity = maxActivity > 0 ? Math.round((activity / maxActivity) * 5) : 0;
      const symbols = ['·', '▁', '▃', '▅', '▇', '█'];
      return symbols[intensity];
    }).join('');
    
    console.log(chalk.blue(`   Activity: ${chart}`));
  }
  
  /**
   * Display writing time chart
   */
  displayWritingTimeChart(times) {
    const timeRanges = {
      'Early Morning (5-8 AM)': [5, 6, 7, 8],
      'Morning (9-11 AM)': [9, 10, 11],
      'Midday (12-2 PM)': [12, 13, 14],
      'Afternoon (3-5 PM)': [15, 16, 17],
      'Evening (6-8 PM)': [18, 19, 20],
      'Night (9-11 PM)': [21, 22, 23],
      'Late Night (12-4 AM)': [0, 1, 2, 3, 4]
    };
    
    Object.entries(timeRanges).forEach(([range, hours]) => {
      const count = hours.reduce((sum, hour) => sum + (times[hour] || 0), 0);
      if (count > 0) {
        const bar = '█'.repeat(Math.min(count, 20));
        console.log(chalk.white(`   ${range.padEnd(25)} ${chalk.blue(bar)} (${count})`));
      }
    });
  }
  
  /**
   * Show recent activity
   */
  async showRecentActivity() {
    const notes = await fileHandler.readNotes(true);
    const recentNotes = notes
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
    
    if (recentNotes.length > 0) {
      console.log(chalk.cyan.bold('\n📋 Recent Activity:'));
      recentNotes.forEach(note => {
        const timeAgo = this.getTimeAgo(new Date(note.createdAt));
        console.log(chalk.white(`   • ${note.title} ${chalk.gray(`(${timeAgo})`)}`));
      });
    }
  }
  
  /**
   * Categorize notes by complexity
   */
  categorizeByComplexity(notes) {
    return notes.reduce((acc, note) => {
      const wordCount = note.body.split(' ').length;
      if (wordCount < 100) acc.simple++;
      else if (wordCount <= 300) acc.medium++;
      else acc.long++;
      return acc;
    }, { simple: 0, medium: 0, long: 0 });
  }
  
  /**
   * Generate productivity recommendations
   */
  generateRecommendations(notes, patterns) {
    const recommendations = [];
    
    if (notes.length < 10) {
      recommendations.push('Consider writing more regularly to build a habit');
    }
    
    if (patterns && patterns.averageLength < 50) {
      recommendations.push('Try writing longer, more detailed notes for better insights');
    }
    
    if (patterns && patterns.sentimentTrend.length > 0) {
      const avgSentiment = patterns.sentimentTrend.reduce((a, b) => a + b, 0) / patterns.sentimentTrend.length;
      if (avgSentiment < -1) {
        recommendations.push('Consider adding positive reflections or gratitude notes');
      }
    }
    
    const categories = [...new Set(notes.map(note => note.category))];
    if (categories.length === 1) {
      recommendations.push('Try organizing notes into different categories for better structure');
    }
    
    const recentNotes = notes.filter(note => {
      const daysDiff = (new Date() - new Date(note.createdAt)) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    
    if (recentNotes.length === 0) {
      recommendations.push('You haven\'t written any notes recently - consider daily journaling');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Great job! Your note-taking habits look healthy');
      recommendations.push('Try using AI analysis features to discover new insights');
    }
    
    recommendations.forEach(rec => {
      console.log(chalk.yellow(`   • ${rec}`));
    });
  }
  
  /**
   * Format hour for display
   */
  formatHour(hour) {
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayHour}:00 ${ampm}`;
  }
  
  /**
   * Get time ago string
   */
  getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'just now';
  }
}

export const analyticsManager = new AnalyticsManager();
