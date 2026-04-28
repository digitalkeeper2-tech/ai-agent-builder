import { Order, IModule } from '../core/types';
import { OrderModel } from '../models/order.model';
import logger from '../core/logger';
import crypto from 'crypto';

/**
 * OrderModule - Processes and enriches orders
 */
export class OrderModule implements IModule<unknown, Order> {
  private model: OrderModel;

  constructor() {
    this.model = new OrderModel();
  }

  /**
   * Process raw order input
   */
  async process(input: unknown): Promise<Order> {
    try {
      logger.info('Processing order input');

      // Validate input
      let order = await this.model.validate(input);

      // Enrich with metadata if not present
      if (!order.id) {
        order = {
          ...order,
          id: crypto.randomUUID(),
        };
      }

      if (!order.createdAt) {
        order = {
          ...order,
          createdAt: new Date(),
        };
      }

      order = {
        ...order,
        updatedAt: new Date(),
      };

      logger.info(`Order processed successfully: ${order.id}`);
      return order;
    } catch (error) {
      logger.error(`Order processing failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get module name
   */
  getName(): string {
    return 'OrderModule';
  }

  /**
   * Get module version
   */
  getVersion(): string {
    return '1.0.0';
  }
}
