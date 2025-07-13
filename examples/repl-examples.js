// REPL Examples for demonstration
console.log('=== REPL Examples Demonstration ===\n');

// Basic operations
console.log('1. Basic Operations:');
const name = 'Developer';
console.log(`name = "${name}"`);
console.log(`name.length = ${name.length}`);

// Multi-line function
console.log('\n2. Function Creation:');
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
console.log(`createMultiplier(2)(5) = ${double(5)}`);

// Object exploration
console.log('\n3. Object Operations:');
const person = { name: 'Alice', age: 30, city: 'New York' };
console.log('person =', person);
console.log('Object.keys(person) =', Object.keys(person));

// Array operations
console.log('\n4. Array Operations:');
const numbers = [1, 2, 3, 4, 5];
console.log('numbers =', numbers);
console.log('numbers.map(n => n * 2) =', numbers.map(n => n * 2));
console.log('numbers.filter(n => n % 2 === 0) =', numbers.filter(n => n % 2 === 0));

// Async operations
console.log('\n5. Async Operations:');
async function demonstrateAsync() {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  console.log('Starting async operation...');
  await delay(1000);
  console.log('Async/await in action - 1 second delay completed!');
}

demonstrateAsync();
