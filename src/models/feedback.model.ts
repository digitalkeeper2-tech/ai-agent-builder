import { z } from 'zod';
import {
  Feedback,
  FeedbackSchema,
  IModel,
} from '../core/types';
import logger from '../core/logger';

/**
 * FeedbackModel - Handles feedback validation and serialization
 */
export class FeedbackModel implements IModel<Feedback> {
  private schema = FeedbackSchema;

  /**
   * Validate feedback data
   */
  async validate(data: unknown): Promise<Feedback> {
    try {
      const validated = this.schema.parse(data);
      logger.debug(`Feedback validated: ${validated.title}`);
      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = `Feedback validation failed: ${error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ')}`;
        logger.error(message);
        throw new Error(message);
      }
      throw error;
    }
  }

  /**
   * Serialize feedback to JSON string
   */
  serialize(feedback: Feedback): string {
    try {
      const serialized = JSON.stringify(feedback, null, 2);
      logger.debug(`Feedback serialized: ${feedback.title}`);
      return serialized;
    } catch (error) {
      logger.error(`Feedback serialization failed: ${error}`);
      throw error;
    }
  }

  /**
   * Deserialize JSON string to Feedback
   */
  async deserialize(json: string): Promise<Feedback> {
    try {
      const parsed = JSON.parse(json);
      const feedback = await this.validate(parsed);
      logger.debug(`Feedback deserialized: ${feedback.title}`);
      return feedback;
    } catch (error) {
      logger.error(`Feedback deserialization failed: ${error}`);
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
    return 'FeedbackModel';
  }
}
