import { z } from 'zod';

/**
 * Feedback schemas for agent self-improvement
 */

export enum FeedbackType {
  PERFORMANCE = 'performance',
  ERROR = 'error',
  OPTIMIZATION = 'optimization',
  FEATURE_REQUEST = 'feature_request',
  BUG_REPORT = 'bug_report',
  CODE_IMPROVEMENT = 'code_improvement',
}

export enum ImprovementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export const FeedbackSchema = z.object({
  id: z.string().optional(),
  agentId: z.string(),
  type: z.nativeEnum(FeedbackType),
  title: z.string(),
  description: z.string(),
  metrics: z.record(z.any()).optional(),
  suggestions: z.array(z.string()).optional(),
  createdAt: z.date().optional(),
});

export const PerformanceMetricSchema = z.object({
  agentId: z.string(),
  executionTime: z.number(),
  successRate: z.number().min(0).max(1),
  errorRate: z.number().min(0).max(1),
  throughput: z.number(),
  memoryUsage: z.number(),
  cpuUsage: z.number(),
  timestamp: z.date().optional(),
});

export const ImprovementSuggestionSchema = z.object({
  id: z.string().optional(),
  feedbackId: z.string(),
  type: z.enum([
    'code_refactor',
    'performance_optimization',
    'error_handling',
    'feature_addition',
    'documentation',
  ]),
  priority: z.nativeEnum(ImprovementPriority),
  targetComponent: z.string(),
  currentCode: z.string(),
  proposedCode: z.string(),
  reasoning: z.string(),
  estimatedImpact: z.object({
    performanceGain: z.number().optional(),
    reliabilityGain: z.number().optional(),
    featureGain: z.string().optional(),
  }).optional(),
  validationScore: z.number().min(0).max(1).default(0.5),
  createdAt: z.date().optional(),
});

export const CodeChangeProposalSchema = z.object({
  id: z.string().optional(),
  suggestionId: z.string(),
  filePath: z.string(),
  fileContent: z.string(),
  changeDescription: z.string(),
  tests: z.array(z.string()).optional(),
  breaking: z.boolean().default(false),
  requiresReview: z.boolean().default(true),
  createdAt: z.date().optional(),
});

export type Feedback = z.infer<typeof FeedbackSchema>;
export type PerformanceMetric = z.infer<typeof PerformanceMetricSchema>;
export type ImprovementSuggestion = z.infer<typeof ImprovementSuggestionSchema>;
export type CodeChangeProposal = z.infer<typeof CodeChangeProposalSchema>;
