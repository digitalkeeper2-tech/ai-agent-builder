import {
  IModel,
  IModule,
  IAdapter,
  IPluginRegistry,
  ComponentType,
  RegistryStats,
} from './types';
import logger from './logger';

/**
 * PluginRegistry - Centralized plugin management system
 * Allows runtime registration/unregistration of components
 */
export class PluginRegistry implements IPluginRegistry {
  private models: Map<string, IModel<any>> = new Map();
  private modules: Map<string, IModule<any, any>> = new Map();
  private adapters: Map<string, IAdapter<any, any>> = new Map();

  /**
   * Register a model
   */
  registerModel(key: string, model: IModel<any>): void {
    if (this.models.has(key)) {
      logger.warn(`Model '${key}' already registered, overwriting`);
    }
    this.models.set(key, model);
    logger.info(`Registered model: ${key}`);
  }

  /**
   * Unregister a model
   */
  unregisterModel(key: string): boolean {
    const result = this.models.delete(key);
    if (result) {
      logger.info(`Unregistered model: ${key}`);
    }
    return result;
  }

  /**
   * Get a registered model
   */
  getModel(key: string): IModel<any> | null {
    const model = this.models.get(key);
    if (!model) {
      logger.warn(`Model '${key}' not found in registry`);
      return null;
    }
    return model;
  }

  /**
   * Register a module
   */
  registerModule(key: string, module: IModule<any, any>): void {
    if (this.modules.has(key)) {
      logger.warn(`Module '${key}' already registered, overwriting`);
    }
    this.modules.set(key, module);
    logger.info(`Registered module: ${key}`);
  }

  /**
   * Unregister a module
   */
  unregisterModule(key: string): boolean {
    const result = this.modules.delete(key);
    if (result) {
      logger.info(`Unregistered module: ${key}`);
    }
    return result;
  }

  /**
   * Get a registered module
   */
  getModule(key: string): IModule<any, any> | null {
    const module = this.modules.get(key);
    if (!module) {
      logger.warn(`Module '${key}' not found in registry`);
      return null;
    }
    return module;
  }

  /**
   * Register an adapter
   */
  registerAdapter(key: string, adapter: IAdapter<any, any>): void {
    if (this.adapters.has(key)) {
      logger.warn(`Adapter '${key}' already registered, overwriting`);
    }
    this.adapters.set(key, adapter);
    logger.info(`Registered adapter: ${key}`);
  }

  /**
   * Get a registered adapter
   */
  getAdapter(key: string): IAdapter<any, any> | null {
    const adapter = this.adapters.get(key);
    if (!adapter) {
      logger.warn(`Adapter '${key}' not found in registry`);
      return null;
    }
    return adapter;
  }

  /**
   * Get all registered components of a type
   */
  getAll(type: ComponentType): Map<string, any> {
    switch (type) {
      case ComponentType.MODEL:
        return new Map(this.models);
      case ComponentType.MODULE:
        return new Map(this.modules);
      case ComponentType.ADAPTER:
        return new Map(this.adapters);
      default:
        return new Map();
    }
  }

  /**
   * Get statistics
   */
  getStats(): RegistryStats {
    return {
      models: this.models.size,
      modules: this.modules.size,
      adapters: this.adapters.size,
      total: this.models.size + this.modules.size + this.adapters.size,
      registered: {
        models: Array.from(this.models.keys()),
        modules: Array.from(this.modules.keys()),
        adapters: Array.from(this.adapters.keys()),
      },
    };
  }
}

// Global singleton instance
export const pluginRegistry = new PluginRegistry();
