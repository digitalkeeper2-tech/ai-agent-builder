import { z } from 'zod';
import { Order, OrderSchema, IModel } from '../core/types';
import logger from '../core/logger';

/**
 * OrderModel - Handles Order validation and serialization
 */
export class OrderModel implements IModel<Order> {
  private schema = OrderSchema;

  /**
   * Validate order data
   */
  async validate(data: unknown): Promise<Order> {
    try {
      const validated = this.schema.parse(data);
      logger.debug(`Order validated: ${validated.name}`);
      return validated;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = `Order validation failed: ${error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')}`;
        logger.error(message);
        throw new Error(message);
      }
      throw error;
    }
  }

  /**
   * Serialize order to JSON string
   */
  serialize(order: Order): string {
    try {
      const serialized = JSON.stringify(order, null, 2);
      logger.debug(`Order serialized: ${order.name}`);
      return serialized;
    } catch (error) {
      logger.error(`Order serialization failed: ${error}`);
      throw error;
    }
  }

  /**
   * Deserialize JSON string to Order
   */
  async deserialize(json: string): Promise<Order> {
    try {
      const parsed = JSON.parse(json);
      const order = await this.validate(parsed);
      logger.debug(`Order deserialized: ${order.name}`);
      return order;
    } catch (error) {
      logger.error(`Order deserialization failed: ${error}`);
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
    return 'OrderModel';
  }
}
