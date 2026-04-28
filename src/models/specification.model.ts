import { z } from 'zod';
import {
  Specification,
  SpecificationSchema,
  IModel,
} from '../core/types';
import logger from '../core/logger';

/**
 * SpecificationModel - Handles Specification validation and serialization
 */
export class SpecificationModel implements IModel<Specification> {
  private schema = SpecificationSchema;

  /**
   * Validate specification data
   */
  async validate(data: unknown): Promise<Specification> {
    try {
      const validated = this.schema.parse(data);
      logger.debug(`Specification validated: ${validated.name}`);
      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = `Specification validation failed: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
        logger.error(message);
        throw new Error(message);
      }
      throw error;
    }
  }

  /**
   * Serialize specification to JSON string
   */
  serialize(spec: Specification): string {
    try {
      const serialized = JSON.stringify(spec, null, 2);
      logger.debug(`Specification serialized: ${spec.name}`);
      return serialized;
    } catch (error) {
      logger.error(`Specification serialization failed: ${error}`);
      throw error;
    }
  }

  /**
   * Deserialize JSON string to Specification
   */
  async deserialize(json: string): Promise<Specification> {
    try {
      const parsed = JSON.parse(json);
      const spec = await this.validate(parsed);
      logger.debug(`Specification deserialized: ${spec.name}`);
      return spec;
    } catch (error) {
      logger.error(`Specification deserialization failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get the Zod schema
   */
  getSchema(): z.ZodSchema {
    return this.schema;
  }

  /**
   * Get model name
   */
  getName(): string {
    return 'SpecificationModel';
  }
}
