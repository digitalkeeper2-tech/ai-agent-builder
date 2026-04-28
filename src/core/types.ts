import { z } from 'zod';

// ============================================================================
// ENUMS
// ============================================================================

export enum AgentType {
  RESEARCH = 'research',
  ANALYSIS = 'analysis',
  AUTOMATION = 'automation',
  CUSTOMER_SERVICE = 'customer_service',
  DATA_PROCESSING = 'data_processing',
  CUSTOM = 'custom',
}

export enum LLMProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  OLLAMA = 'ollama',
  HUGGINGFACE = 'huggingface',
  CUSTOM = 'custom',
}

export enum StageType {
  ORDER = 'order',
  SPECIFICATION = 'specification',
  CODE_GENERATION = 'code_generation',
  COMPILATION = 'compilation',
  DEPLOYMENT = 'deployment',
  ORCHESTRATION = 'orchestration',
}

export enum ComponentType {
  MODEL = 'model',
  MODULE = 'module',
  ADAPTER = 'adapter',
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const LLMConfigSchema = z.object({
  provider: z.nativeEnum(LLMProvider),
  model: z.string(),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().positive().default(2048),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  customEndpoint: z.string().url().optional(),
  apiKey: z.string().optional(),
});

export const ToolSchemaDefinition = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.any()),
  required: z.array(z.string()).optional(),
});

export const OrderSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  type: z.nativeEnum(AgentType),
  capabilities: z.array(z.string()),
  llmConfig: LLMConfigSchema,
  customInstructions: z.string().optional(),
  constraints: z.record(z.any()).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  schema: ToolSchemaDefinition,
  enabled: z.boolean().default(true),
  version: z.string().default('1.0.0'),
});

export const SpecificationSchema = z.object({
  id: z.string().optional(),
  orderId: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.nativeEnum(AgentType),
  systemPrompt: z.string(),
  capabilities: z.array(z.string()),
  tools: z.array(ToolSchema),
  llmConfig: LLMConfigSchema,
  memory: z.object({
    type: z.enum(['buffer', 'summary', 'entity']).default('buffer'),
    maxMessages: z.number().positive().default(50),
    ttl: z.number().positive().optional(),
  }).optional(),
  constraints: z.record(z.any()).optional(),
  errorHandling: z.object({
    retryAttempts: z.number().nonnegative().default(3),
    retryDelay: z.number().positive().default(1000),
    fallbackStrategy: z.enum(['error', 'silent', 'custom']).default('error'),
  }).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CodeGenerationSchema = z.object({
  id: z.string().optional(),
  specificationId: z.string(),
  language: z.enum(['typescript', 'python', 'javascript', 'go']).default('typescript'),
  code: z.string(),
  dependencies: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
});

export const CompilationSchema = z.object({
  id: z.string().optional(),
  codeGenerationId: z.string(),
  status: z.enum(['pending', 'success', 'failed']),
  artifacts: z.array(z.object({
    name: z.string(),
    path: z.string(),
    type: z.string(),
  })).optional(),
  errors: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
});

export const DeploymentSchema = z.object({
  id: z.string().optional(),
  compilationId: z.string(),
  environment: z.enum(['dev', 'staging', 'production']).default('dev'),
  status: z.enum(['pending', 'deployed', 'failed', 'rollback']),
  endpoint: z.string().url().optional(),
  version: z.string(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  deployedAt: z.date().optional(),
});

export const OrchestrationSchema = z.object({
  id: z.string().optional(),
  agentIds: z.array(z.string()),
  orchestrationStrategy: z.enum(['sequential', 'parallel', 'conditional', 'custom']),
  workflowDefinition: z.record(z.any()),
  status: z.enum(['active', 'paused', 'stopped']),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type LLMConfig = z.infer<typeof LLMConfigSchema>;
export type ToolSchemaDefinition = z.infer<typeof ToolSchemaDefinition>;
export type Tool = z.infer<typeof ToolSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Specification = z.infer<typeof SpecificationSchema>;
export type CodeGeneration = z.infer<typeof CodeGenerationSchema>;
export type Compilation = z.infer<typeof CompilationSchema>;
export type Deployment = z.infer<typeof DeploymentSchema>;
export type Orchestration = z.infer<typeof OrchestrationSchema>;

// ============================================================================
// CORE INTERFACES
// ============================================================================

/**
 * IModel<T> - Base model interface for validation and serialization
 */
export interface IModel<T> {
  /**
   * Validate data against the model's schema
   */
  validate(data: unknown): Promise<T>;

  /**
   * Serialize model to JSON
   */
  serialize(data: T): string;

  /**
   * Deserialize JSON to model
   */
  deserialize(json: string): Promise<T>;

  /**
   * Get the Zod schema for this model
   */
  getSchema(): z.ZodSchema;

  /**
   * Get model name/identifier
   */
  getName(): string;
}

/**
 * IModule<I, O> - Base module interface for business logic
 */
export interface IModule<I, O> {
  /**
   * Process input and produce output
   */
  process(input: I): Promise<O>;

  /**
   * Get module name/identifier
   */
  getName(): string;

  /**
   * Get module version
   */
  getVersion(): string;

  /**
   * Initialize module with configuration
   */
  init?(config: Record<string, any>): Promise<void>;

  /**
   * Cleanup/shutdown module
   */
  destroy?(): Promise<void>;
}

/**
 * IPipelineStage<I, O> - Represents a stage in the pipeline
 */
export interface IPipelineStage<I, O> {
  /**
   * Execute the stage
   */
  execute(input: I): Promise<O>;

  /**
   * Get stage name
   */
  getName(): string;

  /**
   * Get stage type
   */
  getType(): StageType;

  /**
   * Get the model being used
   */
  getModel(): IModel<any>;

  /**
   * Get the module being used
   */
  getModule(): IModule<I, O>;

  /**
   * Swap model at runtime
   */
  swapModel(model: IModel<any>): Promise<void>;

  /**
   * Swap module at runtime
   */
  swapModule(module: IModule<I, O>): Promise<void>;

  /**
   * Get execution statistics
   */
  getStats(): StageStats;
}

/**
 * IAdapter<From, To> - Converts between data formats
 */
export interface IAdapter<From, To> {
  /**
   * Adapt from one format to another
   */
  adapt(data: From): Promise<To>;

  /**
   * Reverse adaptation
   */
  reverse(data: To): Promise<From>;

  /**
   * Get adapter name
   */
  getName(): string;
}

/**
 * IPluginRegistry - Manages all registered components
 */
export interface IPluginRegistry {
  /**
   * Register a model
   */
  registerModel(key: string, model: IModel<any>): void;

  /**
   * Unregister a model
   */
  unregisterModel(key: string): boolean;

  /**
   * Get a registered model
   */
  getModel(key: string): IModel<any> | null;

  /**
   * Register a module
   */
  registerModule(key: string, module: IModule<any, any>): void;

  /**
   * Unregister a module
   */
  unregisterModule(key: string): boolean;

  /**
   * Get a registered module
   */
  getModule(key: string): IModule<any, any> | null;

  /**
   * Register an adapter
   */
  registerAdapter(key: string, adapter: IAdapter<any, any>): void;

  /**
   * Get a registered adapter
   */
  getAdapter(key: string): IAdapter<any, any> | null;

  /**
   * Get all registered components of a type
   */
  getAll(type: ComponentType): Map<string, any>;

  /**
   * Get statistics
   */
  getStats(): RegistryStats;
}

// ============================================================================
// STATISTICS INTERFACES
// ============================================================================

export interface StageStats {
  name: string;
  type: StageType;
  executionCount: number;
  successCount: number;
  failureCount: number;
  totalExecutionTime: number;
  averageExecutionTime: number;
  lastExecutionTime?: number;
  lastExecutedAt?: Date;
}

export interface PipelineStats {
  totalStages: number;
  stages: Map<string, StageStats>;
  totalExecutionTime: number;
  executionCount: number;
}

export interface RegistryStats {
  models: number;
  modules: number;
  adapters: number;
  total: number;
  registered: {
    models: string[];
    modules: string[];
    adapters: string[];
  };
}
