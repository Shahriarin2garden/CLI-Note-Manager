console.log('CLI Arguments Demo');

// Process command line arguments
const args = process.argv.slice(2);

console.log('Script name:', process.argv[1]);
console.log('Arguments received:', args);

if (args.length === 0) {
  console.log('No arguments provided');
  console.log('Try: node cli-args-demo.js command arg1 arg2');
} else {
  const [command, ...params] = args;
  console.log('Command:', command);
  console.log('Parameters:', params);
  
  // Simple command processing
  switch (command) {
    case 'greet':
      const name = params[0] || 'World';
      console.log(`Hello, ${name}!`);
      break;
    case 'add':
      const numbers = params.map(Number).filter(n => !isNaN(n));
      const sum = numbers.reduce((a, b) => a + b, 0);
      console.log(`Sum: ${sum}`);
      break;
    default:
      console.log(`Unknown command: ${command}`);
  }
}
