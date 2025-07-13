console.log('Welcome to JavaScript Functions Training!');

// Let's start with the three ways to create functions
console.log('\n--- Part 1: Different Ways to Make Functions ---');

// Method 1: Function Declaration (The classic approach)
function sayHelloClassic(name) {
  return `Hello, ${name}! (classic style)`;
}

// Method 2: Function Expression (Storing a function in a variable)
const sayHelloModern = function(name) {
  return `Hello, ${name}! (modern style)`;
};

// Method 3: Arrow Function (The sleek, modern way)
const sayHelloArrow = (name) => `Hello, ${name}! (arrow style)`;

// Let's test all three!
console.log(sayHelloClassic('Alice'));
console.log(sayHelloModern('Bob'));
console.log(sayHelloArrow('Charlie'));

// Understanding where variables "live"
console.log('\n--- Part 2: Variable Scope ---');

var globalOld = 'I am global (old way)';
let globalNew = 'I am global (new way)';
const globalConstant = 'I never change!';

function exploreScope() {
  var functionScoped = 'I live inside this function only';
  
  console.log('Inside the function, I can access:');
  console.log('- Global variables:', globalOld, globalNew, globalConstant);
  console.log('- Function variable:', functionScoped);
  
  if (true) {
    let blockScoped = 'I only exist in this block';
    const alsoBlockScoped = 'Me too!';
    var functionScopedTrick = 'I escape this block!';
    
    console.log('\nInside the if block:');
    console.log('- Block scoped let:', blockScoped);
    console.log('- Block scoped const:', alsoBlockScoped);
    console.log('- Var in block:', functionScopedTrick);
  }
  
  console.log('\nAfter the if block:');
  console.log('- Can I still access functionScopedTrick?', functionScopedTrick);
}

exploreScope();

// Closures - JavaScript's secret superpower
console.log('\n--- Part 3: Closures (The Magic!) ---');

function createSecretCounter(startingNumber = 0, stepSize = 1) {
  let secretNumber = startingNumber; // This is private!
  
  return {
    increment() {
      secretNumber += stepSize;
      return secretNumber;
    },
    getValue() {
      return secretNumber;
    },
    reset() {
      secretNumber = startingNumber;
      console.log(`Counter reset to ${startingNumber}`);
    }
  };
}

const counter1 = createSecretCounter(10, 2);
const counter2 = createSecretCounter(100, 5);

console.log('Counter1 increment:', counter1.increment());
console.log('Counter1 increment:', counter1.increment());
console.log('Counter2 increment:', counter2.increment());
console.log('Counter1 current value:', counter1.getValue());
counter1.reset();
console.log('After reset:', counter1.getValue());
