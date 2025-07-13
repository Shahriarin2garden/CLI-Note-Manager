console.log('=== Advanced JavaScript Concepts ===\n');

// Functions are "first-class citizens" in JavaScript
console.log('--- Functions as First-Class Citizens ---');

// This works even though the function is defined below! (hoisting)
console.log(sayHello('Alice'));

function sayHello(name) {
  return `Hello, ${name}!`;
}

// Functions can return other functions
function createGreeting(prefix) {
  return function(name) {
    return `${prefix}, ${name}!`;
  };
}

const casualGreeting = createGreeting('Hey there');
const formalGreeting = createGreeting('Good evening');

console.log(casualGreeting('Sarah'));
console.log(formalGreeting('Dr. Smith'));

// Scope - Like Rooms in a House
console.log('\n--- Scope Example ---');

let globalMessage = "I'm visible everywhere!";

function outerFunction() {
  let outerMessage = "I'm only visible inside this function and its inner functions";
  
  function innerFunction() {
    let innerMessage = "I'm only visible right here";
    
    // I can see all three messages!
    console.log('Global:', globalMessage);
    console.log('Outer:', outerMessage);
    console.log('Inner:', innerMessage);
  }
  
  innerFunction();
}

outerFunction();

// Closures - JavaScript's Magic Trick
console.log('\n--- Personal Safe with Closures ---');

function createPersonalSafe() {
  let secretValue = 0; // This is private!
  let accessLog = [];  // This tracks who accessed it
  
  return {
    deposit(amount) {
      secretValue += amount;
      accessLog.push(`Deposited ${amount} at ${new Date().toLocaleTimeString()}`);
      return `New balance: ${secretValue}`;
    },
    
    withdraw(amount) {
      if (amount <= secretValue) {
        secretValue -= amount;
        accessLog.push(`Withdrew ${amount} at ${new Date().toLocaleTimeString()}`);
        return `New balance: ${secretValue}`;
      } else {
        return "Insufficient funds!";
      }
    },
    
    checkBalance() {
      return secretValue;
    },
    
    getLog() {
      return [...accessLog];
    }
  };
}

const aliceSafe = createPersonalSafe();
const bobSafe = createPersonalSafe();

console.log(aliceSafe.deposit(100));
console.log(bobSafe.deposit(50));
console.log(aliceSafe.withdraw(30));

// Each safe keeps its own secrets!
console.log('Alice balance:', aliceSafe.checkBalance());
console.log('Bob balance:', bobSafe.checkBalance());
console.log('Alice log:', aliceSafe.getLog());
