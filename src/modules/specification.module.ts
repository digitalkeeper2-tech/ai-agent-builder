import {
  Order,
  Specification,
  IModule,
  Tool,
  LLMProvider,
} from '../core/types';
import { SpecificationModel } from '../models/specification.model';
import logger from '../core/logger';
import crypto from 'crypto';

/**
 * Tool Registry - Pre-defined tools available to agents
 */
const AVAILABLE_TOOLS: Record<string, Tool> = {
  web_search: {
    id: 'web_search',
    name: 'web_search',
    description: 'Search the web for information',
    schema: {
      name: 'web_search',
      description: 'Search the web',
      parameters: {
        query: { type: 'string' },
        maxResults: { type: 'number' },
      },
      required: ['query'],
    },
    enabled: true,
    version: '1.0.0',
  },
  document_analysis: {
    id: 'document_analysis',
    name: 'document_analysis',
    description: 'Analyze and extract information from documents',
    schema: {
      name: 'document_analysis',
      description: 'Analyze documents',
      parameters: {
        documentUrl: { type: 'string' },
        analysisType: { type: 'string' },
      },
      required: ['documentUrl'],
    },
    enabled: true,
    version: '1.0.0',
  },
  data_processing: {
    id: 'data_processing',
    name: 'data_processing',
    description: 'Process and transform data',
    schema: {
      name: 'data_processing',
      description: 'Process data',
      parameters: {
        data: { type: 'object' },
        transformation: { type: 'string' },
      },
      required: ['data'],
    },
    enabled: true,
    version: '1.0.0',
  },
  api_call: {
    id: 'api_call',
    name: 'api_call',
    description: 'Make HTTP API calls',
    schema: {
      name: 'api_call',
      description: 'Call APIs',
      parameters: {
        url: { type: 'string' },
        method: { type: 'string' },
        body: { type: 'object' },
      },
      required: ['url', 'method'],
    },
    enabled: true,
    version: '1.0.0',
  },
  code_execution: {
    id: 'code_execution',
    name: 'code_execution',
    description: 'Execute code snippets safely',
    schema: {
      name: 'code_execution',
      description: 'Execute code',
      parameters: {
        code: { type: 'string' },
        language: { type: 'string' },
      },
      required: ['code', 'language'],
    },
    enabled: true,
    version: '1.0.0',
  },
};

/**
 * LLM Model Selector
 */
const LLM_MODEL_SELECTION: Record<LLMProvider, string> = {
  [LLMProvider.OPENAI]: 'gpt-4',
  [LLMProvider.ANTHROPIC]: 'claude-3-opus',
  [LLMProvider.OLLAMA]: 'mistral',
  [LLMProvider.HUGGINGFACE]: 'meta-llama/Llama-2-70b-hf',
  [LLMProvider.CUSTOM]: 'custom-model',
};

/**
 * SpecificationModule - Converts orders to specifications
 */
export class SpecificationModule
  implements IModule<Order, Specification>
{
  private model: SpecificationModel;

  constructor() {
    this.model = new SpecificationModel();
  }

  /**
   * Generate system prompt from order
   */
  private generateSystemPrompt(order: Order): string {
    const basePrompt = `You are an AI agent with the following characteristics:
- Name: ${order.name}
- Type: ${order.type}
- Description: ${order.description}
- Capabilities: ${order.capabilities.join(', ')}`;

    const customInstructions = order.customInstructions
      ? `\n- Custom Instructions: ${order.customInstructions}`
      : '';

    return basePrompt + customInstructions;
  }

  /**
   * Resolve tools based on capabilities
   */
  private resolvTools(capabilities: string[]): Tool[] {
    const tools: Tool[] = [];
    const capabilitySet = new Set(capabilities.map((c) => c.toLowerCase()));

    // Map capabilities to available tools
    if (
      capabilitySet.has('search') ||
      capabilitySet.has('research') ||
      capabilitySet.has('web')
    ) {
      tools.push(AVAILABLE_TOOLS.web_search);
    }

    if (
      capabilitySet.has('analysis') ||
      capabilitySet.has('document') ||
      capabilitySet.has('document_analysis')
    ) {
      tools.push(AVAILABLE_TOOLS.document_analysis);
    }

    if (
      capabilitySet.has('data') ||
      capabilitySet.has('processing') ||
      capabilitySet.has('data_processing')
    ) {
      tools.push(AVAILABLE_TOOLS.data_processing);
    }

    if (
      capabilitySet.has('api') ||
      capabilitySet.has('integration') ||
      capabilitySet.has('api_call')
    ) {
      tools.push(AVAILABLE_TOOLS.api_call);
    }

    if (
      capabilitySet.has('code') ||
      capabilitySet.has('execution') ||
      capabilitySet.has('code_execution')
    ) {
      tools.push(AVAILABLE_TOOLS.code_execution);
    }

    // If no tools matched, include web_search as default
    if (tools.length === 0) {
      tools.push(AVAILABLE_TOOLS.web_search);
    }

    return tools;
  }

  /**
   * Select optimal LLM model
   */
  private selectLLMModel(provider: LLMProvider): string {
    return LLM_MODEL_SELECTION[provider] || 'gpt-4';
  }

  /**
   * Process order into specification
   */
  async process(order: Order): Promise<Specification> {
    try {
      logger.info(`Processing specification for order: ${order.id}`);

      const model = this.selectLLMModel(order.llmConfig.provider);

      const specification: Specification = {
        id: crypto.randomUUID(),
        orderId: order.id || '',
        name: order.name,
        description: order.description,
        type: order.type,
        systemPrompt: this.generateSystemPrompt(order),
        capabilities: order.capabilities,
        tools: this.resolvTools(order.capabilities),
        llmConfig: {
          ...order.llmConfig,
          model,
        },
        memory: {
          type: 'buffer',
          maxMessages: 50,
        },
        errorHandling: {
          retryAttempts: 3,
          retryDelay: 1000,
          fallbackStrategy: 'error',
        },
        constraints: order.constraints,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Validate specification
      await this.model.validate(specification);

      logger.info(
        `Specification generated successfully: ${specification.id}`
      );
      return specification;
    } catch (error) {
      logger.error(`Specification processing failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get module name
   */
  getName(): string {
    return 'SpecificationModule';
  }

  /**
   * Get module version
   */
  getVersion(): string {
    return '1.0.0';
  }
}
