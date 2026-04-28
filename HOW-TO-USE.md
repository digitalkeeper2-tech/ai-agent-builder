# How to Use the AI Agent System 🤖

## Table of Contents

1. [Quick Start](#quick-start)
2. [Creating Your First Agent](#creating-your-first-agent)
3. [Agent Capabilities](#agent-capabilities)
4. [Advanced Usage](#advanced-usage)
5. [Self-Improvement System](#self-improvement-system)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Installation

```bash
git clone https://github.com/digitalkeeper2-tech/ai-agent-builder.git
cd ai-agent-builder
npm install
npm run build
```

### 2. Create Your First Agent (5 minutes)

Create a file `my-first-agent.ts`:

```typescript
import {
  Pipeline,
  StageFactory,
  StageType,
  pluginRegistry,
  OrderModel,
  OrderModule,
  SpecificationModel,
  SpecificationModule,
} from './src/index';

async function createMyFirstAgent() {
  // Step 1: Register components
  pluginRegistry.registerModel('OrderModel', new OrderModel());
  pluginRegistry.registerModule('OrderModule', new OrderModule());
  pluginRegistry.registerModel('SpecificationModel', new SpecificationModel());
  pluginRegistry.registerModule('SpecificationModule', new SpecificationModule());

  // Step 2: Create pipeline
  const pipeline = new Pipeline();
  pipeline.addStage(
    StageFactory.create(
      'order-stage',
      StageType.ORDER,
      'OrderModel',
      'OrderModule'
    )
  );
  pipeline.addStage(
    StageFactory.create(
      'spec-stage',
      StageType.SPECIFICATION,
      'SpecificationModel',
      'SpecificationModule'
    )
  );

  // Step 3: Define your agent
  const myAgent = {
    name: 'My Research Assistant',
    description: 'Helps me research topics and summarize findings',
    type: 'research',
    capabilities: ['search', 'analysis', 'document_analysis'],
    llmConfig: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
    },
  };

  // Step 4: Build the agent
  const agentSpec = await pipeline.execute(myAgent);

  // Step 5: Use the agent
  console.log('✅ Agent Created:', agentSpec.name);
  console.log('📝 System Prompt:', agentSpec.systemPrompt);
  console.log('🛠️ Tools Available:', agentSpec.tools.map((t) => t.name));
}

createMyFirstAgent().catch(console.error);
```

Run it:
```bash
npx ts-node my-first-agent.ts
```

---

## Creating Your First Agent

### Agent Types Available

```typescript
enum AgentType {
  RESEARCH = 'research',           // Web search, analysis
  ANALYSIS = 'analysis',           // Data analysis
  AUTOMATION = 'automation',       // Task automation
  CUSTOMER_SERVICE = 'customer_service',  // Customer support
  DATA_PROCESSING = 'data_processing',    // ETL, data ops
  CUSTOM = 'custom',               // Your own type
}
```

### Agent Capabilities

Available capabilities that map to tools:

```typescript
// Available capabilities
const capabilities = [
  'search',              // → web_search tool
  'analysis',            // → document_analysis tool
  'document_analysis',   // → document_analysis tool
  'data',                // → data_processing tool
  'data_processing',     // → data_processing tool
  'api',                 // → api_call tool
  'api_call',            // → api_call tool
  'code',                // → code_execution tool
  'code_execution',      // → code_execution tool
];
```

### Complete Agent Definition

```typescript
const agentDefinition = {
  // Required
  name: 'MyAgent',
  description: 'What this agent does',
  type: 'research', // or 'analysis', 'automation', etc.
  capabilities: ['search', 'analysis'],
  llmConfig: {
    provider: 'openai',              // or 'anthropic', 'ollama'
    model: 'gpt-4',                  // model name
    temperature: 0.7,                // 0.0 = precise, 1.0+ = creative
    maxTokens: 2048,                 // max response length
    topP: 0.9,                       // optional: nucleus sampling
    frequencyPenalty: 0.0,           // optional: reduce repetition
    presencePenalty: 0.0,            // optional: encourage new topics
  },
  
  // Optional
  customInstructions: 'Special behavior for this agent',
  constraints: {
    maxRetries: 3,
    timeout: 30000,
  },
};
```

---

## Agent Capabilities

### Built-in Tools

Every agent can access these tools based on capabilities:

#### 1. **web_search** 🔍
```typescript
// Automatically included if you add 'search' capability
const result = await agent.tools.web_search({
  query: 'Node.js best practices',
  maxResults: 10,
});
```

#### 2. **document_analysis** 📄
```typescript
// Included with 'analysis' or 'document_analysis' capability
const result = await agent.tools.document_analysis({
  documentUrl: 'https://example.com/report.pdf',
  analysisType: 'summary',
});
```

#### 3. **data_processing** 📊
```typescript
// Included with 'data' or 'data_processing' capability
const result = await agent.tools.data_processing({
  data: { items: [1, 2, 3] },
  transformation: 'aggregate',
});
```

#### 4. **api_call** 🌐
```typescript
// Included with 'api' or 'api_call' capability
const result = await agent.tools.api_call({
  url: 'https://api.example.com/data',
  method: 'GET',
});
```

#### 5. **code_execution** ⚙️
```typescript
// Included with 'code' or 'code_execution' capability
const result = await agent.tools.code_execution({
  code: 'const sum = 1 + 2; return sum;',
  language: 'javascript',
});
```

---

## Advanced Usage

### Example 1: Research Agent

```typescript
import {
  Pipeline,
  StageFactory,
  StageType,
  pluginRegistry,
  OrderModel,
  OrderModule,
  SpecificationModel,
  SpecificationModule,
} from './src/index';

async function createResearchAgent() {
  // Register components
  pluginRegistry.registerModel('OrderModel', new OrderModel());
  pluginRegistry.registerModule('OrderModule', new OrderModule());
  pluginRegistry.registerModel('SpecificationModel', new SpecificationModel());
  pluginRegistry.registerModule('SpecificationModule', new SpecificationModule());

  // Create pipeline
  const pipeline = new Pipeline();
  pipeline.addStage(
    StageFactory.create(
      'order',
      StageType.ORDER,
      'OrderModel',
      'OrderModule'
    )
  );
  pipeline.addStage(
    StageFactory.create(
      'specification',
      StageType.SPECIFICATION,
      'SpecificationModel',
      'SpecificationModule'
    )
  );

  // Define research agent
  const researchAgent = {
    name: 'DeepResearcher',
    description: 'Performs comprehensive research on any topic',
    type: 'research',
    capabilities: ['search', 'analysis', 'document_analysis', 'data_processing'],
    llmConfig: {
      provider: 'openai',
      model: 'gpt-4',
      temperature: 0.5,  // More focused
      maxTokens: 4096,   // Larger responses
    },
    customInstructions: 'Always cite sources. Be thorough and accurate.',
  };

  // Build agent
  const spec = await pipeline.execute(researchAgent);
  
  console.log('✅ Research Agent Created');
  console.log('Tools:', spec.tools.map((t) => t.name));
  console.log('System Prompt:', spec.systemPrompt);
  
  return spec;
}

createResearchAgent().catch(console.error);
```

### Example 2: Data Analysis Agent

```typescript
const dataAnalysisAgent = {
  name: 'DataAnalyzer',
  description: 'Analyzes data and provides insights',
  type: 'analysis',
  capabilities: ['data_processing', 'analysis', 'code_execution'],
  llmConfig: {
    provider: 'anthropic',
    model: 'claude-3-opus',
    temperature: 0.3,  // Very precise
    maxTokens: 2048,
  },
  customInstructions: 'Focus on statistical accuracy and clear visualizations.',
};
```

### Example 3: Automation Agent

```typescript
const automationAgent = {
  name: 'TaskAutomator',
  description: 'Automates repetitive tasks',
  type: 'automation',
  capabilities: ['api_call', 'code_execution', 'data_processing'],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.2,  // Very deterministic
    maxTokens: 1024,
  },
  constraints: {
    maxRetries: 5,
    timeout: 60000,  // 60 seconds
  },
};
```

### Example 4: Runtime Component Swapping

```typescript
import { OrderModel, OrderModule } from './src/index';

async function swapComponents() {
  const pipeline = new Pipeline();
  const stage = StageFactory.create(
    'order',
    StageType.ORDER,
    'OrderModel',
    'OrderModule'
  );

  pipeline.addStage(stage);

  // Create custom implementation
  class CustomOrderModel extends OrderModel {
    async validate(data) {
      console.log('🔧 Custom validation logic');
      return super.validate(data);
    }
  }

  // Swap at runtime
  await stage.swapModel(new CustomOrderModel());

  // Now uses custom model
  const result = await pipeline.execute(orderData);
}
```

### Example 5: Monitoring Agent Performance

```typescript
import { pipeline } from './src/index';

async function monitorPerformance() {
  // Execute agent multiple times
  for (let i = 0; i < 5; i++) {
    await pipeline.execute(agentOrder);
  }

  // Get statistics
  const stats = pipeline.getStats();
  
  console.log('Pipeline Statistics:');
  console.log(`  Stages: ${stats.totalStages}`);
  console.log(`  Total Executions: ${stats.executionCount}`);
  console.log(`  Total Time: ${stats.totalExecutionTime}ms`);
  
  // Per-stage stats
  for (const [name, stageStats] of stats.stages) {
    console.log(`\n${name}:`);
    console.log(`  Success Rate: ${(stageStats.successCount / stageStats.executionCount * 100).toFixed(1)}%`);
    console.log(`  Avg Time: ${stageStats.averageExecutionTime.toFixed(2)}ms`);
  }
}
```

---

## Self-Improvement System

### How It Works

```
1. Agent Executes
   ↓
2. Feedback Collected (metrics, errors, performance)
   ↓
3. Improvements Generated (optimization suggestions)
   ↓
4. Code Changes Proposed (with tests and validation)
   ↓
5. Applied (after review or auto-approval)
```

### Using Self-Improvement

```typescript
import { selfImprovementPipeline } from './src/core/self-improvement';

async function improveAgent() {
  // Initialize
  await selfImprovementPipeline.init();

  // Run improvement cycle on your agent specification
  const improvements = await selfImprovementPipeline.improveSelf(
    agentSpecification
  );

  console.log(`Generated ${improvements.length} improvements:`);

  for (const improvement of improvements) {
    console.log(`\n- ${improvement.targetComponent}`);
    console.log(`  Type: ${improvement.type}`);
    console.log(`  Priority: ${improvement.priority}`);
    console.log(`  Confidence: ${(improvement.validationScore * 100).toFixed(1)}%`);
    console.log(`  Expected Gain: ${improvement.estimatedImpact?.performanceGain?.toFixed(1)}%`);
  }
}
```

---

## Troubleshooting

### Problem: Agent not executing

**Solution**:
```typescript
// Make sure all components are registered
pluginRegistry.registerModel('OrderModel', new OrderModel());
pluginRegistry.registerModule('OrderModule', new OrderModule());

// Check registry
const stats = pluginRegistry.getStats();
console.log('Registered:', stats.registered);
```

### Problem: "Model not found in registry"

**Solution**:
```typescript
try {
  const spec = await pipeline.execute(agentOrder);
} catch (error) {
  console.log('Available models:', pluginRegistry.getStats().registered.models);
  console.log('Available modules:', pluginRegistry.getStats().registered.modules);
}
```

### Problem: TypeScript errors

**Solution**:
```bash
npm run build
# or
npm run lint
```

### Problem: Memory issues

**Solution**:
```bash
# Increase Node memory
node --max-old-space-size=4096 my-agent.ts
```

### Problem: Need LLM API keys

**Solution**: Create `.env` file:
```env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_BASE_URL=http://localhost:11434
```

Then in code:
```typescript
require('dotenv').config();

const agentOrder = {
  // ...
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY,
  },
};
```

---

## Next Steps

1. ✅ Install & setup (see WINDOWS-SETUP.md)
2. ✅ Create your first agent (copy examples above)
3. ✅ Add custom capabilities (modify agent definition)
4. ✅ Monitor performance (use statistics)
5. ✅ Enable self-improvement (use selfImprovementPipeline)
6. ✅ Deploy (ready for next stages)

---

## Quick Reference

```typescript
// 1. Import
import { Pipeline, StageFactory, StageType, pluginRegistry, ... } from './src/index';

// 2. Register
pluginRegistry.registerModel('name', model);
pluginRegistry.registerModule('name', module);

// 3. Create Pipeline
const pipeline = new Pipeline();

// 4. Add Stages
pipeline.addStage(StageFactory.create(...));

// 5. Execute
const result = await pipeline.execute(input);

// 6. Monitor
const stats = pipeline.getStats();
```

---

**Happy Agent Building! 🚀**
