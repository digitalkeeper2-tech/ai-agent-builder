#!/usr/bin/env node

/**
 * Quick Setup Script for Windows Users
 * Run: node setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('\n🚀 AI Agent Builder - Windows Setup\n');

// Check Node.js
console.log('✓ Checking Node.js...');
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' });
  console.log(`  Found: ${nodeVersion.trim()}`);
} catch (e) {
  console.error('  ✗ Node.js not found. Please install from https://nodejs.org/');
  process.exit(1);
}

// Check npm
console.log('\n✓ Checking npm...');
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' });
  console.log(`  Found: ${npmVersion.trim()}`);
} catch (e) {
  console.error('  ✗ npm not found.');
  process.exit(1);
}

// Install dependencies
console.log('\n✓ Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('  Dependencies installed!');
} catch (e) {
  console.error('  ✗ Failed to install dependencies');
  process.exit(1);
}

// Build project
console.log('\n✓ Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('  Build complete!');
} catch (e) {
  console.error('  ✗ Build failed');
  process.exit(1);
}

// Create example file
console.log('\n✓ Creating example file...');
const examplePath = path.join(__dirname, 'examples', 'quick-start.ts');
const exampleContent = `import {
  Pipeline,
  StageFactory,
  StageType,
  pluginRegistry,
  OrderModel,
  OrderModule,
  SpecificationModel,
  SpecificationModule,
} from '../src/index';

async function quickStart() {
  console.log('🤖 Creating your first AI agent...\\n');

  // Register components
  pluginRegistry.registerModel('OrderModel', new OrderModel());
  pluginRegistry.registerModule('OrderModule', new OrderModule());
  pluginRegistry.registerModel('SpecificationModel', new SpecificationModel());
  pluginRegistry.registerModule('SpecificationModule', new SpecificationModule());

  // Create pipeline
  const pipeline = new Pipeline();
  pipeline.addStage(
    StageFactory.create('order', StageType.ORDER, 'OrderModel', 'OrderModule')
  );
  pipeline.addStage(
    StageFactory.create(
      'specification',
      StageType.SPECIFICATION,
      'SpecificationModel',
      'SpecificationModule'
    )
  );

  // Define agent
  const agent = {
    name: 'MyFirstAgent',
    description: 'My first AI agent created with the builder',
    type: 'research',
    capabilities: ['search', 'analysis'],
    llmConfig: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
    },
  };

  // Execute
  const spec = await pipeline.execute(agent);

  console.log('✅ Agent created successfully!\\n');
  console.log('Agent Details:');
  console.log('  Name:', spec.name);
  console.log('  Type:', spec.type);
  console.log('  Capabilities:', spec.capabilities);
  console.log('  Tools:', spec.tools.map((t) => t.name));
  console.log('\\nSystem Prompt:');
  console.log(spec.systemPrompt);

  // Show statistics
  const stats = pipeline.getStats();
  console.log('\\nPipeline Performance:');
  console.log('  Total Stages:', stats.totalStages);
  console.log('  Total Time:', stats.totalExecutionTime.toFixed(2), 'ms');
}

quickStart().catch(console.error);
`;

if (!fs.existsSync(path.dirname(examplePath))) {
  fs.mkdirSync(path.dirname(examplePath), { recursive: true });
}
fs.writeFileSync(examplePath, exampleContent);
console.log('  Created: examples/quick-start.ts');

// Create .env template
console.log('\n✓ Creating .env template...');
const envPath = path.join(__dirname, '.env.example');
const envContent = `# Environment Variables
NODE_ENV=development
LOG_LEVEL=debug

# LLM API Keys (optional)
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here
OLLAMA_BASE_URL=http://localhost:11434
`;
fs.writeFileSync(envPath, envContent);
console.log('  Created: .env.example');

// Success
console.log('\n' + '='.repeat(50));
console.log('✅ Setup Complete!');
console.log('='.repeat(50));
console.log('\nNext steps:');
console.log('  1. Read WINDOWS-SETUP.md for detailed instructions');
console.log('  2. Read HOW-TO-USE.md to learn how to use the system');
console.log('  3. Run: npx ts-node examples/quick-start.ts');
console.log('  4. Check examples/ folder for more examples');
console.log('\n');
