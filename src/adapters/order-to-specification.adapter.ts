import {
  Order,
  Specification,
  IAdapter,
} from '../core/types';
import logger from '../core/logger';

/**
 * OrderToSpecificationAdapter - Bidirectional conversion
 */
export class OrderToSpecificationAdapter
  implements IAdapter<Order, Specification>
{
  /**
   * Adapt Order to Specification
   */
  async adapt(order: Order): Promise<Specification> {
    try {
      logger.debug(`Adapting order to specification: ${order.id}`);

      const specification: Specification = {
        orderId: order.id || '',
        name: order.name,
        description: order.description,
        type: order.type,
        systemPrompt: `You are a ${order.type} AI agent named ${order.name}. ${order.description} ${order.customInstructions ? `Additional instructions: ${order.customInstructions}` : ''}`,
        capabilities: order.capabilities,
        tools: [],
        llmConfig: order.llmConfig,
        constraints: order.constraints,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };

      logger.debug(`Order adapted to specification`);
      return specification;
    } catch (error) {
      logger.error(`Order to specification adaptation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Reverse adaptation (Specification back to Order)
   */
  async reverse(specification: Specification): Promise<Order> {
    try {
      logger.debug(`Reversing specification to order: ${specification.id}`);

      const order: Order = {
        id: specification.orderId,
        name: specification.name,
        description: specification.description,
        type: specification.type,
        capabilities: specification.capabilities,
        llmConfig: specification.llmConfig,
        constraints: specification.constraints,
        createdAt: specification.createdAt,
        updatedAt: specification.updatedAt,
      };

      logger.debug(`Specification reversed to order`);
      return order;
    } catch (error) {
      logger.error(`Specification to order reversal failed: ${error}`);
      throw error;
    }
  }

  /**
   * Get adapter name
   */
  getName(): string {
    return 'OrderToSpecificationAdapter';
  }
}
