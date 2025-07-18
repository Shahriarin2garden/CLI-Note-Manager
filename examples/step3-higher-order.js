// Simple higher-order functions demonstration
console.log('=== Higher-Order Functions Demo ===\n');

// Higher-order function that wraps another function with logging
function withLogging(fn) {
  return function(...args) {
    const startTime = Date.now();
    console.log(`🔍 Calling function: ${fn.name || 'anonymous'}`);
    console.log(`   Arguments: [${args.map(arg => typeof arg === 'string' ? `"${arg}"` : arg).join(', ')}]`);
    
    try {
      const result = fn.apply(this, args);
      const endTime = Date.now();
      console.log(`✅ Function completed successfully in ${endTime - startTime}ms`);
      return result;
    } catch (error) {
      const endTime = Date.now();
      console.log(`❌ Function failed after ${endTime - startTime}ms: ${error.message}`);
      throw error;
    }
  };
}

// Demo functions to wrap with logging
function calculateSum(a, b) {
  return a + b;
}

// Test higher-order function
console.log('Testing higher-order function with logging:');
const loggedAdd = withLogging(calculateSum);
const result = loggedAdd(15, 27);
console.log(`Sum result: ${result}`);

console.log('\n✅ Higher-order functions demonstration complete!');
