console.log("=== Node.js Runtime Demo ===");

console.log("1. Node.js Environment:");
console.log(`   Version: ${process.version}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Architecture: ${process.arch}`);
console.log(`   Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);

console.log("2. Command Line Arguments:");
console.log(`   Script: ${process.argv[1]}`);
console.log(`   Args: ${process.argv.slice(2).join(", ") || "none"}`);

console.log("3. Simple Demo (without file operations for now):");
console.log("   This demonstrates basic Node.js runtime features");
