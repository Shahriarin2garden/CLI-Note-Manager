console.log('=== Call Stack and Event Loop ===\n');

// The Call Stack - JavaScript's Memory System
console.log('--- Call Stack Example ---');

function first() {
  console.log('Starting first function');
  second();
  console.log('Back in first function - second() is done!');
}

function second() {
  console.log('In second function');
  third();
  console.log('Back in second function - third() is done!');
}

function third() {
  console.log('In third function - deepest level!');
}

first();

// The Event Loop - JavaScript's Multitasking Magic
console.log('\n--- Event Loop Example ---');

console.log('1: I run first (synchronous)');

setTimeout(() => {
  console.log('3: I run after the promise (macro task)');
}, 0);

Promise.resolve().then(() => {
  console.log('2: I run before setTimeout (micro task)');
});

console.log('1.5: I also run immediately (synchronous)');
