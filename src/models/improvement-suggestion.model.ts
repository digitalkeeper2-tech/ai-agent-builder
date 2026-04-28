import { z } from 'zod';
import {
  ImprovementSuggestion,
  ImprovementSuggestionSchema,
  IModel,
} from '../core/feedback';
import logger from '../core/logger';

/**
 * ImprovementSuggestionModel - Handles improvement suggestion validation
 */
export class ImprovementSuggestionModel
  implements IModel<ImprovementSuggestion>
{
  private schema = ImprovementSuggestionSchema;

  /**
   * Validate improvement suggestion data
   */
  async validate(data: unknown): Promise<ImprovementSuggestion> {
    try {
      const validated = this.schema.parse(data);
      logger.debug(
        `Improvement suggestion validated: ${validated.targetComponent}`
      );
      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = `Improvement suggestion validation failed: ${error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ')}`;
        logger.error(message);
        throw new Error(message);
      }
      throw error;
    }
  }

  /**
   * Serialize to JSON string
   */
  serialize(data: ImprovementSuggestion): string {
    try {
      const serialized = JSON.stringify(data, null, 2);
      logger.debug(
        `Improvement suggestion serialized: ${data.targetComponent}`
      );
      return serialized;
    } catch (error) {
      logger.error(`Improvement suggestion serialization failed: ${error}`);
      throw error;
    }
  }

  /**
   * Deserialize JSON string
   */
  async deserialize(json: string): Promise<ImprovementSuggestion> {
    try {
      const parsed = JSON.parse(json);
      const suggestion = await this.validate(parsed);
      logger.debug(
        `Improvement suggestion deserialized: ${suggestion.targetComponent}`
      );
      return suggestion;
    } catch (error) {
      logger.error(`Improvement suggestion deserialization failed: ${error}`);
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
    return 'ImprovementSuggestionModel';
  }
}
