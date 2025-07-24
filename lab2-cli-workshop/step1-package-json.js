#!/usr/bin/env node

import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

console.log('=== Step 1: Package.json & NPM Configuration ===\n');

// Package.json Configuration Management
class PackageManager {
  constructor() {
    this.projectPath = process.cwd();
    this.packagePath = path.join(this.projectPath, 'package.json');
  }

  // Read and analyze current package.json
  async analyzePackage() {
    console.log('📦 Analyzing Package.json Configuration:');
    
    try {
      const packageData = JSON.parse(await fs.readFile(this.packagePath, 'utf8'));
      
      console.log('  ✅ Package.json loaded successfully');
      console.log(`  📋 Project Name: ${packageData.name}`);
      console.log(`  🔢 Version: ${packageData.version}`);
      console.log(`  📝 Description: ${packageData.description || 'No description'}`);
      console.log(`  🔧 Main Entry: ${packageData.main || 'index.js'}`);
      console.log(`  📦 Module Type: ${packageData.type || 'commonjs'}`);
      
      // Analyze dependencies
      if (packageData.dependencies) {
        console.log(`  📚 Dependencies: ${Object.keys(packageData.dependencies).length}`);
        Object.entries(packageData.dependencies).forEach(([name, version]) => {
          console.log(`    - ${name}: ${version}`);
        });
      }
      
      // Analyze dev dependencies
      if (packageData.devDependencies) {
        console.log(`  🛠️ Dev Dependencies: ${Object.keys(packageData.devDependencies).length}`);
        Object.entries(packageData.devDependencies).forEach(([name, version]) => {
          console.log(`    - ${name}: ${version}`);
        });
      }
      
      // Analyze scripts
      if (packageData.scripts) {
        console.log(`  🚀 Scripts: ${Object.keys(packageData.scripts).length}`);
        Object.entries(packageData.scripts).forEach(([name, command]) => {
          console.log(`    - ${name}: ${command}`);
        });
      }
      
      return packageData;
    } catch (error) {
      console.error('  ❌ Failed to read package.json:', error.message);
      throw error;
    }
  }

  // Demonstrate semantic versioning concepts
  demonstrateSemanticVersioning() {
    console.log('\n🔢 Semantic Versioning (SemVer) Explanation:');
    
    const examples = [
      { version: '1.0.0', type: 'Initial Release', description: 'First stable version' },
      { version: '1.0.1', type: 'Patch', description: 'Bug fixes, no breaking changes' },
      { version: '1.1.0', type: 'Minor', description: 'New features, backward compatible' },
      { version: '2.0.0', type: 'Major', description: 'Breaking changes, requires updates' },
      { version: '^1.2.3', type: 'Caret Range', description: 'Compatible with 1.x.x (>=1.2.3 <2.0.0)' },
      { version: '~1.2.3', type: 'Tilde Range', description: 'Compatible with 1.2.x (>=1.2.3 <1.3.0)' }
    ];
    
    examples.forEach(example => {
      console.log(`  ${example.version.padEnd(8)} | ${example.type.padEnd(15)} | ${example.description}`);
    });
  }

  // Demonstrate NPM commands
  demonstrateNPMCommands() {
    console.log('\n📋 Essential NPM Commands:');
    
    const commands = [
      { command: 'npm init', description: 'Initialize new package.json' },
      { command: 'npm install', description: 'Install all dependencies' },
      { command: 'npm install <package>', description: 'Install specific package' },
      { command: 'npm install --save-dev <package>', description: 'Install as dev dependency' },
      { command: 'npm update', description: 'Update all packages' },
      { command: 'npm audit', description: 'Check for security vulnerabilities' },
      { command: 'npm run <script>', description: 'Run custom script' },
      { command: 'npm test', description: 'Run tests' },
      { command: 'npm start', description: 'Start application' },
      { command: 'npm publish', description: 'Publish to NPM registry' }
    ];
    
    commands.forEach(cmd => {
      console.log(`  ${cmd.command.padEnd(30)} | ${cmd.description}`);
    });
  }

  // Show module system differences
  demonstrateModuleSystems() {
    console.log('\n🔄 Module Systems Comparison:');
    
    console.log('  CommonJS (Traditional):');
    console.log('    const fs = require("fs");');
    console.log('    const path = require("path");');
    console.log('    module.exports = { function1, function2 };');
    
    console.log('\n  ES Modules (Modern):');
    console.log('    import fs from "fs";');
    console.log('    import { readFile } from "fs/promises";');
    console.log('    export { function1, function2 };');
    console.log('    export default myFunction;');
    
    console.log('\n  Configuration for ES Modules:');
    console.log('    Add "type": "module" to package.json');
    console.log('    Or use .mjs file extension');
  }
}

// Main execution
async function runPackageDemo() {
  try {
    const packageManager = new PackageManager();
    
    await packageManager.analyzePackage();
    packageManager.demonstrateSemanticVersioning();
    packageManager.demonstrateNPMCommands();
    packageManager.demonstrateModuleSystems();
    
    console.log('\n✅ Package.json & NPM demonstration completed!');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

runPackageDemo();
