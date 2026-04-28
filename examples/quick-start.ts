import {
  Pipeline,
  StageFactory,
  StageType,
  pluginRegistry,
  OrderModel,
  OrderModule,
  SpecificationModel,
  SpecificationModule,
} from '../src/index';

/**
 * Quick Start Example - Run with: npx ts-node examples/quick-start.ts
 */
async function quickStart() {
  console.log('\n🤖 Creating your first AI agent...\n');

  // Step 1: Register components
  console.log('📝 Step 1: Registering components...');
  pluginRegistry.registerModel('OrderModel', new OrderModel());
  pluginRegistry.registerModule('OrderModule', new OrderModule());
  pluginRegistry.registerModel('SpecificationModel', new SpecificationModel());
  pluginRegistry.registerModule('SpecificationModule', new SpecificationModule());
  console.log('✅ Components registered\n');

  // Step 2: Create pipeline
  console.log('🔧 Step 2: Creating pipeline...');
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
  console.log('✅ Pipeline created\n');

  // Step 3: Define agent
  console.log('📋 Step 3: Defining agent...');
  const agent = {
    name: 'MyFirstAgent',
    description: 'My first AI agent created with the builder',
    type: 'research',
    capabilities: ['search', 'analysis', 'document_analysis'],
    llmConfig: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
    },
    customInstructions:
      'Be helpful, accurate, and provide detailed responses.',
  };
  console.log('✅ Agent defined\n');

  // Step 4: Execute pipeline
  console.log('🚀 Step 4: Building agent...');
  const spec = await pipeline.execute(agent);
  console.log('✅ Agent built successfully!\n');

  // Step 5: Display results
  console.log('='.repeat(60));
  console.log('📊 AGENT CREATED SUCCESSFULLY');
  console.log('='.repeat(60));
  console.log('\nAgent Details:');
  console.log(`  Name: ${spec.name}`);
  console.log(`  Type: ${spec.type}`);
  console.log(`  ID: ${spec.id}`);
  console.log(`\nCapabilities: ${spec.capabilities.join(', ')}`);
  console.log(`\nAvailable Tools:`);
  for (const tool of spec.tools) {
    console.log(`  - ${tool.name}: ${tool.description}`);
  }
  console.log(`\nLLM Configuration:`);
  console.log(`  Provider: ${spec.llmConfig.provider}`);
  console.log(`  Model: ${spec.llmConfig.model}`);
  console.log(`  Temperature: ${spec.llmConfig.temperature}`);
  console.log(`  Max Tokens: ${spec.llmConfig.maxTokens}`);
  console.log(`\nSystem Prompt:`);
  console.log('-'.repeat(60));
  console.log(spec.systemPrompt);
  console.log('-'.repeat(60));

  // Step 6: Show statistics
  const stats = pipeline.getStats();
  console.log('\n📈 Pipeline Performance:');
  console.log(`  Total Stages: ${stats.totalStages}`);
  console.log(`  Total Executions: ${stats.executionCount}`);
  console.log(`  Total Time: ${stats.totalExecutionTime.toFixed(2)}ms`);

  for (const [stageName, stageStats] of stats.stages) {
    console.log(`\n  ${stageName}:`);
    console.log(
      `    Success Rate: ${(stageStats.successCount / stageStats.executionCount * 100).toFixed(1)}%`
    );
    console.log(`    Avg Time: ${stageStats.averageExecutionTime.toFixed(2)}ms`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Next Steps:');
  console.log('  1. Read HOW-TO-USE.md for detailed usage instructions');
  console.log('  2. Check examples/ folder for more complex examples');
  console.log('  3. Modify this file to create your own agents');
  console.log('  4. Explore the self-improvement system');
  console.log('='.repeat(60) + '\n');
}

quickStart().catch((error) => {
  console.error('❌ Error:', error.message);
  process.exit(1);
});
