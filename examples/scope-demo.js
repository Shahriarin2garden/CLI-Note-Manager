console.log('Scope in CLI Applications');

// Global settings
const APP_NAME = 'AI Note Manager';
let debugMode = false;

function createLogger(module) {
  // Function scope - private to each logger instance
  let logCount = 0;
  
  return {
    info(message) {
      logCount++;
      console.log(`[${APP_NAME}:${module}] INFO: ${message} (${logCount})`);
    },
    
    debug(message) {
      if (debugMode) {
        logCount++;
        console.log(`[${APP_NAME}:${module}] DEBUG: ${message} (${logCount})`);
      }
    },
    
    getLogCount() {
      return logCount;
    }
  };
}

// Test different scope levels
const noteLogger = createLogger('NOTES');
const commandLogger = createLogger('COMMANDS');

noteLogger.info('Note manager initialized');
commandLogger.info('Command parser ready');

debugMode = true;
noteLogger.debug('Debug mode enabled');

console.log(`Note logger count: ${noteLogger.getLogCount()}`);
console.log(`Command logger count: ${commandLogger.getLogCount()}`);
