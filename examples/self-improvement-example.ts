/**
 * Self-Improvement Example
 * Shows how agents can improve the builder itself
 */

import {
  Pipeline,
  StageFactory,
  StageType,
  pluginRegistry,
  logger,
} from '../src/index';
import { OrderModule } from '../src/modules/order.module';
import { OrderModel } from '../src/models/order.model';
import { SpecificationModule } from '../src/modules/specification.module';
import { SpecificationModel } from '../src/models/specification.model';
import { FeedbackAnalyzerModule } from '../src/modules/feedback-analyzer.module';
import { FeedbackModel } from '../src/models/feedback.model';
import { ImprovementGeneratorModule } from '../src/modules/improvement-generator.module';
import { ImprovementSuggestionModel } from '../src/models/improvement-suggestion.model';
import { AutoUpdateModule } from '../src/modules/auto-update.module';

async function runSelfImprovementExample() {
  try {
    console.log('🤖 AI Agent Builder - Self-Improvement Example\n');

    // Step 1: Register all components
    console.log('📦 Registering components...');
    pluginRegistry.registerModel('OrderModel', new OrderModel());
    pluginRegistry.registerModel('SpecificationModel', new SpecificationModel());
    pluginRegistry.registerModel('FeedbackModel', new FeedbackModel());
    pluginRegistry.registerModel(
      'ImprovementSuggestionModel',
      new ImprovementSuggestionModel()
    );

    pluginRegistry.registerModule('OrderModule', new OrderModule());
    pluginRegistry.registerModule('SpecificationModule', new SpecificationModule());
    pluginRegistry.registerModule('FeedbackAnalyzerModule', new FeedbackAnalyzerModule());
    pluginRegistry.registerModule(
      'ImprovementGeneratorModule',
      new ImprovementGeneratorModule()
    );
    pluginRegistry.registerModule('AutoUpdateModule', new AutoUpdateModule());

    console.log('✅ All components registered\n');

    // Step 2: Create main pipeline
    console.log('🔧 Creating main agent-building pipeline...');
    const mainPipeline = new Pipeline();

    const orderStage = StageFactory.create(
      'order-stage',
      StageType.ORDER,
      'OrderModel',
      'OrderModule'
    );
    const specStage = StageFactory.create(
      'spec-stage',
      StageType.SPECIFICATION,
      'SpecificationModel',
      'SpecificationModule'
    );

    mainPipeline.addStage(orderStage);
    mainPipeline.addStage(specStage);
    console.log('✅ Main pipeline created\n');

    // Step 3: Create an agent order
    console.log('📝 Creating agent order...');
    const agentOrder = {
      name: 'ResearchAgent',
      description: 'An AI agent that performs web research and analysis',
      type: 'research',
      capabilities: [
        'search',
        'analysis',
        'document_analysis',
        'data_processing',
      ],
      llmConfig: {
        provider: 'openai',
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 2048,
      },
      customInstructions:
        'Focus on accuracy and comprehensive research. Always cite sources.',
    };

    console.log(`Created order: ${agentOrder.name}\n`);

    // Step 4: Execute main pipeline
    console.log('🚀 Executing main pipeline...');
    const specification = await mainPipeline.execute(agentOrder);
    console.log('✅ Agent specification generated\n');

    // Step 5: Create self-improvement pipeline
    console.log('🔄 Creating self-improvement pipeline...');
    const improvementPipeline = new Pipeline();

    const feedbackStage = StageFactory.create(
      'feedback-stage',
      StageType.ORDER,
      'FeedbackModel',
      'FeedbackAnalyzerModule'
    );
    const improvementStage = StageFactory.create(
      'improvement-stage',
      StageType.SPECIFICATION,
      'ImprovementSuggestionModel',
      'ImprovementGeneratorModule'
    );

    improvementPipeline.addStage(feedbackStage);
    improvementPipeline.addStage(improvementStage);
    console.log('✅ Self-improvement pipeline created\n');

    // Step 6: Run self-improvement
    console.log('🤖 Running self-improvement cycle...');
    const improvements = await improvementPipeline.execute(specification);
    console.log(`✅ Generated ${improvements.length} improvements\n`);

    // Step 7: Display results
    console.log('📊 \n=== RESULTS ===\n');

    console.log('Main Pipeline Stats:');
    const mainStats = mainPipeline.getStats();
    console.log(`  - Stages: ${mainStats.totalStages}`);
    console.log(`  - Executions: ${mainStats.executionCount}`);
    console.log(
      `  - Total Time: ${mainStats.totalExecutionTime.toFixed(2)}ms\n`
    );

    console.log('Improvement Pipeline Stats:');
    const improvementStats = improvementPipeline.getStats();
    console.log(`  - Stages: ${improvementStats.totalStages}`);
    console.log(`  - Executions: ${improvementStats.executionCount}`);
    console.log(
      `  - Total Time: ${improvementStats.totalExecutionTime.toFixed(2)}ms\n`
    );

    console.log('Generated Improvements:');
    for (let i = 0; i < Math.min(3, improvements.length); i++) {
      console.log(`\n  ${i + 1}. ${improvements[i].targetComponent}`);
      console.log(
        `     Type: ${improvements[i].type}, Priority: ${improvements[i].priority}`
      );
      console.log(
        `     Validation Score: ${(improvements[i].validationScore * 100).toFixed(1)}%`
      );
    }

    console.log('\n\n🎉 Self-improvement example completed successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the example
runSelfImprovementExample();
