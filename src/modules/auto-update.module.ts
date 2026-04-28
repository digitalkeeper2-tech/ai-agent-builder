import {
  ImprovementSuggestion,
  CodeChangeProposal,
  IModule,
} from '../core/feedback';
import logger from '../core/logger';
import crypto from 'crypto';

/**
 * AutoUpdateModule - Automatically applies approved code improvements
 */
export class AutoUpdateModule
  implements IModule<ImprovementSuggestion[], CodeChangeProposal[]>
{
  /**
   * Process improvements and generate code change proposals
   */
  async process(
    suggestions: ImprovementSuggestion[]
  ): Promise<CodeChangeProposal[]> {
    try {
      logger.info(
        `Processing ${suggestions.length} improvement suggestions for auto-update`
      );

      const proposals: CodeChangeProposal[] = [];

      for (const suggestion of suggestions) {
        // Only process high-confidence suggestions
        if (suggestion.validationScore > 0.8) {
          const proposal = await this.createChangeProposal(suggestion);
          proposals.push(proposal);
        }
      }

      logger.info(`Generated ${proposals.length} code change proposals`);
      return proposals;
    } catch (error) {
      logger.error(`Auto-update processing failed: ${error}`);
      throw error;
    }
  }

  /**
   * Create code change proposal from improvement suggestion
   */
  private async createChangeProposal(
    suggestion: ImprovementSuggestion
  ): Promise<CodeChangeProposal> {
    const proposal: CodeChangeProposal = {
      id: crypto.randomUUID(),
      suggestionId: suggestion.id || '',
      filePath: this.getFilePath(suggestion.targetComponent),
      fileContent: suggestion.proposedCode,
      changeDescription: this.generateChangeDescription(suggestion),
      tests: this.generateTests(suggestion),
      breaking: this.isBreakingChange(suggestion),
      requiresReview: suggestion.priority === 'critical',
      createdAt: new Date(),
    };

    return proposal;
  }

  /**
   * Get file path for component
   */
  private getFilePath(component: string): string {
    const componentMap: Record<string, string> = {
      'pipeline': 'src/core/pipeline.ts',
      'registry': 'src/core/registry.ts',
      'factory': 'src/core/factory.ts',
      'order.module': 'src/modules/order.module.ts',
      'specification.module': 'src/modules/specification.module.ts',
      'logger': 'src/core/logger.ts',
      'general': 'src/core/types.ts',
    };

    return componentMap[component] || 'src/index.ts';
  }

  /**
   * Generate change description
   */
  private generateChangeDescription(suggestion: ImprovementSuggestion): string {
    const impact = suggestion.estimatedImpact;
    return `[${suggestion.type.toUpperCase()}] ${suggestion.reasoning}\n\nEstimated Impact:\n- Performance Gain: ${(impact?.performanceGain || 0).toFixed(1)}%\n- Reliability Gain: ${(impact?.reliabilityGain || 0).toFixed(1)}%\n- Validation Score: ${(suggestion.validationScore * 100).toFixed(1)}%`;
  }

  /**
   * Generate tests for the change
   */
  private generateTests(suggestion: ImprovementSuggestion): string[] {
    return [
      `Test for ${suggestion.targetComponent} - Unit Test`,
      `Test for ${suggestion.targetComponent} - Integration Test`,
      `Test for ${suggestion.targetComponent} - Performance Test`,
    ];
  }

  /**
   * Check if this is a breaking change
   */
  private isBreakingChange(suggestion: ImprovementSuggestion): boolean {
    return suggestion.type === 'code_refactor' && suggestion.priority === 'critical';
  }

  /**
   * Get module name
   */
  getName(): string {
    return 'AutoUpdateModule';
  }

  /**
   * Get module version
   */
  getVersion(): string {
    return '1.0.0';
  }
}
