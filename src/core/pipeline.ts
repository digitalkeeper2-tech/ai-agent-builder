import {
  IPipelineStage,
  IModel,
  IModule,
  StageType,
  StageStats,
  PipelineStats,
} from './types';
import logger from './logger';

/**
 * PipelineStage - A generic pipeline stage with model + module
 */
export class PipelineStage<I, O> implements IPipelineStage<I, O> {
  private model: IModel<any>;
  private module: IModule<I, O>;
  private name: string;
  private type: StageType;
  private stats: StageStats;

  constructor(
    name: string,
    type: StageType,
    model: IModel<any>,
    module: IModule<I, O>
  ) {
    this.name = name;
    this.type = type;
    this.model = model;
    this.module = module;
    this.stats = {
      name,
      type,
      executionCount: 0,
      successCount: 0,
      failureCount: 0,
      totalExecutionTime: 0,
      averageExecutionTime: 0,
    };
    logger.info(`Created pipeline stage: ${name} (${type})`);
  }

  /**
   * Execute the stage
   */
  async execute(input: I): Promise<O> {
    const startTime = Date.now();
    this.stats.executionCount++;

    try {
      logger.debug(`Executing stage: ${this.name}`);
      const output = await this.module.process(input);
      this.stats.successCount++;
      logger.debug(`Stage ${this.name} executed successfully`);
      return output;
    } catch (error) {
      this.stats.failureCount++;
      logger.error(`Stage ${this.name} failed: ${error}`);
      throw error;
    } finally {
      const executionTime = Date.now() - startTime;
      this.stats.totalExecutionTime += executionTime;
      this.stats.lastExecutionTime = executionTime;
      this.stats.lastExecutedAt = new Date();
      this.stats.averageExecutionTime =
        this.stats.totalExecutionTime / this.stats.executionCount;
    }
  }

  /**
   * Get stage name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get stage type
   */
  getType(): StageType {
    return this.type;
  }

  /**
   * Get the model being used
   */
  getModel(): IModel<any> {
    return this.model;
  }

  /**
   * Get the module being used
   */
  getModule(): IModule<I, O> {
    return this.module;
  }

  /**
   * Swap model at runtime
   */
  async swapModel(model: IModel<any>): Promise<void> {
    logger.info(`Swapping model in stage ${this.name}`);
    this.model = model;
  }

  /**
   * Swap module at runtime
   */
  async swapModule(module: IModule<I, O>): Promise<void> {
    logger.info(`Swapping module in stage ${this.name}`);
    this.module = module;
  }

  /**
   * Get execution statistics
   */
  getStats(): StageStats {
    return { ...this.stats };
  }
}

/**
 * Pipeline - Chains multiple stages together
 */
export class Pipeline {
  private stages: Map<string, IPipelineStage<any, any>> = new Map();
  private stagesToExecute: string[] = [];
  private stats: PipelineStats = {
    totalStages: 0,
    stages: new Map(),
    totalExecutionTime: 0,
    executionCount: 0,
  };

  /**
   * Add a stage to the pipeline
   */
  addStage(stage: IPipelineStage<any, any>): void {
    const stageName = stage.getName();
    this.stages.set(stageName, stage);
    this.stagesToExecute.push(stageName);
    this.stats.totalStages++;
    logger.info(`Added stage to pipeline: ${stageName}`);
  }

  /**
   * Remove a stage from the pipeline
   */
  removeStage(stageName: string): boolean {
    const found = this.stages.delete(stageName);
    if (found) {
      this.stagesToExecute = this.stagesToExecute.filter((s) => s !== stageName);
      this.stats.totalStages--;
      logger.info(`Removed stage from pipeline: ${stageName}`);
    }
    return found;
  }

  /**
   * Get a stage by name
   */
  getStage(stageName: string): IPipelineStage<any, any> | null {
    return this.stages.get(stageName) || null;
  }

  /**
   * Execute the entire pipeline
   */
  async execute(initialInput: any): Promise<any> {
    const pipelineStartTime = Date.now();
    this.stats.executionCount++;

    let currentOutput = initialInput;

    try {
      logger.info(
        `Starting pipeline execution with ${this.stagesToExecute.length} stages`
      );

      for (const stageName of this.stagesToExecute) {
        const stage = this.stages.get(stageName)!;
        logger.debug(`Executing pipeline stage: ${stageName}`);
        currentOutput = await stage.execute(currentOutput);
      }

      logger.info('Pipeline execution completed successfully');
      return currentOutput;
    } catch (error) {
      logger.error(`Pipeline execution failed: ${error}`);
      throw error;
    } finally {
      const pipelineExecutionTime = Date.now() - pipelineStartTime;
      this.stats.totalExecutionTime += pipelineExecutionTime;
    }
  }

  /**
   * Get pipeline statistics
   */
  getStats(): PipelineStats {
    const stats: PipelineStats = {
      totalStages: this.stats.totalStages,
      stages: new Map(),
      totalExecutionTime: this.stats.totalExecutionTime,
      executionCount: this.stats.executionCount,
    };

    for (const [stageName, stage] of this.stages) {
      stats.stages.set(stageName, stage.getStats());
    }

    return stats;
  }
}
