# AI Agent Program Builder 🤖

Build AI agents with custom orders. Every stage as a **Model** and **Module** with full **interchangeability** and **extensibility**.

## 🎯 Overview

This is a production-ready, modular architecture for building, deploying, and orchestrating custom AI agents. Each pipeline stage is composed of:

- **Model** - Validates and serializes data (Zod schemas)
- **Module** - Implements business logic (processing, transformation)
- **Pipeline** - Chains stages together with full runtime swapping capabilities

## ✨ Key Features

✅ **True Component Interchangeability** - Swap models and modules at runtime
✅ **Plugin Registry System** - Register/unregister components dynamically
✅ **Factory Patterns** - Create stages, models, modules with dependency injection
✅ **Observable Pipeline** - Per-stage execution statistics and metrics
✅ **Type-Safe** - Full TypeScript and Zod validation
✅ **Extensible** - Easy to add new stages and components
✅ **Comprehensive Logging** - Winston logger throughout

## 🏗️ Architecture

### Pipeline Stages

```
Order Input
    ↓
[Stage 1: ORDER] ← OrderModel + OrderModule
    ↓
[Stage 2: SPECIFICATION] ← SpecificationModel + SpecificationModule
    ↓
[Stage 3: CODE_GENERATION] ← CodeGenModel + CodeGenModule (ready to add)
    ↓
[Stage 4: COMPILATION] ← CompileModel + CompileModule (ready to add)
    ↓
[Stage 5: DEPLOYMENT] ← DeployModel + DeployModule (ready to add)
    ↓
[Stage 6: ORCHESTRATION] ← OrchestraModel + OrchestraModule (ready to add)
    ↓
Agent Deployed & Running
```

### Component Structure

**Models** (Data Layer)
- Validate input data against Zod schemas
- Serialize/deserialize to JSON
- Ensure type safety

**Modules** (Business Logic Layer)
- Process validated data
- Implement stage-specific logic
- Transform input → output

**Adapters** (Format Conversion Layer)
- Convert between different data formats
- Enable bidirectional transformation
- Decouple stages

## 📦 Project Structure

```
ai-agent-builder/
├── src/
│   ├── core/
│   │   ├── types.ts          # All schemas, interfaces, enums
│   │   ├── registry.ts       # Plugin registry system
│   │   ├── pipeline.ts       # Pipeline engine
│   │   ├── factory.ts        # Component factories
│   │   └── logger.ts         # Winston logging
│   ├── models/
│   │   ├── order.model.ts          # Order validation
│   │   └── specification.model.ts  # Specification validation
│   ├── modules/
│   │   ├── order.module.ts          # Order processing
│   │   └── specification.module.ts  # Spec generation
│   ├── adapters/
│   │   └── order-to-specification.adapter.ts
│   └── index.ts              # Main exports
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Development

```bash
npm run dev
```

## 💡 Usage Examples

### Example 1: Register Components

```typescript
import {
  pluginRegistry,
  OrderModel,
  OrderModule,
  SpecificationModel,
  SpecificationModule,
} from './index';

// Register models
const orderModel = new OrderModel();
const specModel = new SpecificationModel();

pluginRegistry.registerModel('OrderModel', orderModel);
pluginRegistry.registerModel('SpecificationModel', specModel);

// Register modules
const orderModule = new OrderModule();
const specModule = new SpecificationModule();

pluginRegistry.registerModule('OrderModule', orderModule);
pluginRegistry.registerModule('SpecificationModule', specModule);
```

### Example 2: Create Pipeline

```typescript
import {
  Pipeline,
  StageFactory,
  StageType,
} from './index';

const pipeline = new Pipeline();

// Create stages
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

// Add to pipeline
pipeline.addStage(orderStage);
pipeline.addStage(specStage);
```

### Example 3: Execute Pipeline

```typescript
const orderInput = {
  name: 'ResearchAgent',
  description: 'An AI agent that performs research',
  type: 'research',
  capabilities: ['search', 'analysis', 'document_analysis'],
  llmConfig: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
  },
};

const result = await pipeline.execute(orderInput);
console.log('Generated Specification:', result);
```

### Example 4: Runtime Component Swapping

```typescript
// Swap model at runtime
await orderStage.swapModel(newCustomOrderModel);

// Swap module at runtime
await orderStage.swapModule(newCustomOrderModule);

// Re-execute with new components
const newResult = await pipeline.execute(orderInput);
```

### Example 5: Get Statistics

```typescript
// Stage statistics
const stageStats = orderStage.getStats();
console.log('Stage Stats:', stageStats);

// Pipeline statistics
const pipelineStats = pipeline.getStats();
console.log('Pipeline Stats:', pipelineStats);

// Registry statistics
const registryStats = pluginRegistry.getStats();
console.log('Registry Stats:', registryStats);
```

## 🔌 Adding New Stages

Create a new stage (e.g., Code Generation):

### 1. Create Model

```typescript
// src/models/code-generation.model.ts
import { CodeGeneration, CodeGenerationSchema, IModel } from '../core/types';

export class CodeGenerationModel implements IModel<CodeGeneration> {
  async validate(data: unknown): Promise<CodeGeneration> {
    return CodeGenerationSchema.parse(data);
  }

  serialize(data: CodeGeneration): string {
    return JSON.stringify(data);
  }

  async deserialize(json: string): Promise<CodeGeneration> {
    return this.validate(JSON.parse(json));
  }

  getSchema() {
    return CodeGenerationSchema;
  }

  getName(): string {
    return 'CodeGenerationModel';
  }
}
```

### 2. Create Module

```typescript
// src/modules/code-generation.module.ts
import {
  Specification,
  CodeGeneration,
  IModule,
} from '../core/types';

export class CodeGenerationModule
  implements IModule<Specification, CodeGeneration>
{
  async process(spec: Specification): Promise<CodeGeneration> {
    // Your code generation logic here
    return {
      specificationId: spec.id,
      language: 'typescript',
      code: '// Generated code here',
    };
  }

  getName(): string {
    return 'CodeGenerationModule';
  }

  getVersion(): string {
    return '1.0.0';
  }
}
```

### 3. Register & Use

```typescript
const codeGenModel = new CodeGenerationModel();
const codeGenModule = new CodeGenerationModule();

pluginRegistry.registerModel('CodeGenerationModel', codeGenModel);
pluginRegistry.registerModule('CodeGenerationModule', codeGenModule);

const codeGenStage = StageFactory.create(
  'code-gen-stage',
  StageType.CODE_GENERATION,
  'CodeGenerationModel',
  'CodeGenerationModule'
);

pipeline.addStage(codeGenStage);
```

## 🔄 Runtime Component Swapping

One of the most powerful features - swap components without stopping the pipeline:

```typescript
// Create alternative implementations
const customOrderModel = new CustomOrderModel();
const customOrderModule = new CustomOrderModule();

// Swap at runtime
await orderStage.swapModel(customOrderModel);
await orderStage.swapModule(customOrderModule);

// Pipeline continues with new components
const result = await pipeline.execute(orderInput);
```

## 📊 Monitoring & Statistics

### Per-Stage Statistics

```typescript
const stats = stage.getStats();
// {
//   name: 'order-stage',
//   type: 'order',
//   executionCount: 5,
//   successCount: 5,
//   failureCount: 0,
//   totalExecutionTime: 234,
//   averageExecutionTime: 46.8,
//   lastExecutionTime: 45,
//   lastExecutedAt: 2024-01-15T10:30:00Z
// }
```

### Pipeline Statistics

```typescript
const stats = pipeline.getStats();
// {
//   totalStages: 2,
//   stages: Map { ... },
//   totalExecutionTime: 456,
//   executionCount: 5
// }
```

### Registry Statistics

```typescript
const stats = pluginRegistry.getStats();
// {
//   models: 2,
//   modules: 2,
//   adapters: 1,
//   total: 5,
//   registered: {
//     models: ['OrderModel', 'SpecificationModel'],
//     modules: ['OrderModule', 'SpecificationModule'],
//     adapters: ['OrderToSpecificationAdapter']
//   }
// }
```

## 🛠️ Development

### Format Code

```bash
npm run format
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm run test
```

## 📚 API Reference

### PluginRegistry

- `registerModel(key, model)` - Register a model
- `unregisterModel(key)` - Unregister a model
- `getModel(key)` - Get a model
- `registerModule(key, module)` - Register a module
- `unregisterModule(key)` - Unregister a module
- `getModule(key)` - Get a module
- `registerAdapter(key, adapter)` - Register an adapter
- `getAdapter(key)` - Get an adapter
- `getAll(type)` - Get all components of a type
- `getStats()` - Get registry statistics

### Pipeline

- `addStage(stage)` - Add a stage
- `removeStage(name)` - Remove a stage
- `getStage(name)` - Get a stage
- `execute(input)` - Execute the pipeline
- `getStats()` - Get pipeline statistics

### PipelineStage

- `execute(input)` - Execute the stage
- `getName()` - Get stage name
- `getType()` - Get stage type
- `getModel()` - Get the model
- `getModule()` - Get the module
- `swapModel(model)` - Swap the model
- `swapModule(module)` - Swap the module
- `getStats()` - Get stage statistics

## 🔐 Error Handling

All components implement comprehensive error handling:

```typescript
try {
  const result = await pipeline.execute(input);
} catch (error) {
  // Error logged and handled
  console.error('Pipeline failed:', error.message);
}
```

## 📝 Logging

Winston logger configured for:
- Console output in development
- File logging in production
- Error tracking and monitoring

## 🚀 Ready to Build

The foundation is complete. Next stages ready to add:

- **Stage 3: Code Generation** - Generate agent code
- **Stage 4: Compilation** - Build artifacts
- **Stage 5: Deployment** - Deploy agents
- **Stage 6: Orchestration** - Manage interactions

## 📄 License

MIT

## 👤 Author

digitalkeeper2-tech

---

**Start building AI agents with full control and extensibility! 🚀**
