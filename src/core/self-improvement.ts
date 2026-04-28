import { PipelineStage, Pipeline } from './pipeline';
import { StageFactory } from './factory';
import { pluginRegistry } from './registry';
import { StageType } from './types';
import logger from './logger';
import { FeedbackAnalyzerModule } from '../modules/feedback-analyzer.module';
import { ImprovementGeneratorModule } from '../modules/improvement-generator.module';
import { AutoUpdateModule } from '../modules/auto-update.module';
import { FeedbackModel } from '../models/feedback.model';
import { ImprovementSuggestionModel } from '../models/improvement-suggestion.model';

/**
 * SelfImprovementPipeline - Enables the builder to improve itself
 * Stages:
 * 1. FEEDBACK - Analyze agent execution
 * 2. LEARNING - Generate improvement suggestions
 * 3. AUTO-UPDATE - Create code change proposals
 */
export class SelfImprovementPipeline {
  private pipeline: Pipeline;
  private initialized: boolean = false;

  constructor() {
    this.pipeline = new Pipeline();
  }

  /**
   * Initialize the self-improvement pipeline
   */
  async init(): Promise<void> {
    if (this.initialized) {
      return;
    }

    logger.info('Initializing Self-Improvement Pipeline');

    try {
      // Register models
      const feedbackModel = new FeedbackModel();
      const improvementModel = new ImprovementSuggestionModel();

      pluginRegistry.registerModel('FeedbackModel', feedbackModel);
      pluginRegistry.registerModel('ImprovementSuggestionModel', improvementModel);

      // Register modules
      const feedbackModule = new FeedbackAnalyzerModule();
      const improvementModule = new ImprovementGeneratorModule();
      const autoUpdateModule = new AutoUpdateModule();

      pluginRegistry.registerModule('FeedbackAnalyzerModule', feedbackModule);
      pluginRegistry.registerModule(
        'ImprovementGeneratorModule',
        improvementModule
      );
      pluginRegistry.registerModule('AutoUpdateModule', autoUpdateModule);

      // Create and add stages
      const feedbackStage = StageFactory.createCustom(
        'feedback-analysis',
        StageType.ORDER, // Reusing for now, should be FEEDBACK
        feedbackModel,
        feedbackModule
      );

      const improvementStage = StageFactory.createCustom(
        'improvement-generation',
        StageType.SPECIFICATION, // Reusing for now, should be LEARNING
        improvementModel,
        improvementModule
      );

      this.pipeline.addStage(feedbackStage);
      this.pipeline.addStage(improvementStage);

      this.initialized = true;
      logger.info('Self-Improvement Pipeline initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize Self-Improvement Pipeline: ${error}`);
      throw error;
    }
  }

  /**
   * Run self-improvement cycle
   */
  async improveSelf(specification: any): Promise<any> {
    if (!this.initialized) {
      await this.init();
    }

    try {
      logger.info('Starting self-improvement cycle');
      const result = await this.pipeline.execute(specification);
      logger.info('Self-improvement cycle completed');
      return result;
    } catch (error) {
      logger.error(`Self-improvement cycle failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get pipeline for monitoring
   */
  getPipeline(): Pipeline {
    return this.pipeline;
  }

  /**
   * Get statistics
   */
  getStats() {
    return this.pipeline.getStats();
  }
}

// Global singleton
export const selfImprovementPipeline = new SelfImprovementPipeline();
