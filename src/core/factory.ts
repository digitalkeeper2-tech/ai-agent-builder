import {
  IModel,
  IModule,
  StageType,
  IPipelineStage,
} from './types';
import { PipelineStage } from './pipeline';
import { pluginRegistry } from './registry';
import logger from './logger';

/**
 * ModelFactory - Creates model instances
 */
export class ModelFactory {
  /**
   * Create a model by key from registry
   */
  static create(key: string): IModel<any> {
    const model = pluginRegistry.getModel(key);
    if (!model) {
      throw new Error(`Model '${key}' not found in registry`);
    }
    logger.info(`Created model instance: ${key}`);
    return model;
  }

  /**
   * Create a custom model
   */
  static createCustom(model: IModel<any>): IModel<any> {
    logger.info(`Created custom model: ${model.getName()}`);
    return model;
  }
}

/**
 * ModuleFactory - Creates module instances
 */
export class ModuleFactory {
  /**
   * Create a module by key from registry
   */
  static create(key: string): IModule<any, any> {
    const module = pluginRegistry.getModule(key);
    if (!module) {
      throw new Error(`Module '${key}' not found in registry`);
    }
    logger.info(`Created module instance: ${key}`);
    return module;
  }

  /**
   * Create a custom module
   */
  static createCustom(module: IModule<any, any>): IModule<any, any> {
    logger.info(`Created custom module: ${module.getName()}`);
    return module;
  }
}

/**
 * StageFactory - Creates pipeline stages
 */
export class StageFactory {
  /**
   * Create a stage with model and module
   */
  static create<I, O>(
    stageName: string,
    stageType: StageType,
    modelKey: string,
    moduleKey: string
  ): IPipelineStage<I, O> {
    const model = ModelFactory.create(modelKey);
    const module = ModuleFactory.create(moduleKey);
    return new PipelineStage(stageName, stageType, model, module);
  }

  /**
   * Create a stage with custom model and module
   */
  static createCustom<I, O>(
    stageName: string,
    stageType: StageType,
    model: IModel<any>,
    module: IModule<I, O>
  ): IPipelineStage<I, O> {
    return new PipelineStage(stageName, stageType, model, module);
  }

  /**
   * Create a stage from registry keys
   */
  static createFromRegistry<I, O>(
    stageName: string,
    stageType: StageType,
    modelKey: string,
    moduleKey: string
  ): IPipelineStage<I, O> {
    return StageFactory.create(stageName, stageType, modelKey, moduleKey);
  }
}

/**
 * ComponentFactory - Unified factory for all components
 */
export const ComponentFactory = {
  Model: ModelFactory,
  Module: ModuleFactory,
  Stage: StageFactory,
};
