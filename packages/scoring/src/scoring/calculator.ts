import { TestResults } from '../collectors/testCollector';

export interface ScoreBreakdown {
  security: number;
  performance: number;
  quality: number;
  logic: number;
  total: number;
  regressions: number;
}

export function calculateScore(results: TestResults, baseline: any): ScoreBreakdown {
  const securityScore = calculateSecurityScore(results.security);
  const performanceScore = calculatePerformanceScore(results.performance, baseline.performance);
  const qualityScore = calculateQualityScore(results.quality, baseline.quality);
  const logicScore = calculateLogicScore(results.logic);

  const weightedTotal =
    (securityScore * 3.0 + performanceScore * 2.0 + qualityScore * 1.5 + logicScore * 2.5) / 9.0;

  const regressions = countRegressions(results, baseline);
  const total = Math.max(0, weightedTotal - regressions * 5);

  return {
    security: securityScore,
    performance: performanceScore,
    quality: qualityScore,
    logic: logicScore,
    total,
    regressions,
  };
}

function calculateSecurityScore(security: TestResults['security']): number {
  const sqlScore =
    (security.sqlInjectionTests.passed / security.sqlInjectionTests.total) * 30;
  const xssScore = (security.xssTests.passed / security.xssTests.total) * 30;
  const authScore = (security.authTests.passed / security.authTests.total) * 25;
  const secretsScore =
    (security.secretsScan.issuesFixed / security.secretsScan.totalIssues) * 15;

  return sqlScore + xssScore + authScore + secretsScore;
}

function calculatePerformanceScore(
  performance: TestResults['performance'],
  baseline: any
): number {
  const responseScore = Math.min(
    (baseline.responseTime / performance.responseTime) * 30,
    30
  );
  const memoryScore = Math.min(
    (baseline.memoryUsage / performance.memoryUsage) * 25,
    25
  );
  const lighthouseScore = performance.lighthouseScore * 0.25;
  const bundleScore = Math.min(
    (baseline.bundleSize / performance.bundleSize) * 20,
    20
  );

  return responseScore + memoryScore + lighthouseScore + bundleScore;
}

function calculateQualityScore(quality: TestResults['quality'], baseline: any): number {
  const eslintScore =
    Math.max(0, (1 - quality.eslintErrors / baseline.eslintErrors)) * 30;
  const typeScore =
    Math.max(0, (1 - quality.typeErrors / baseline.typeErrors)) * 25;
  const coverageScore = quality.testCoverage * 0.3;
  const duplicationScore = Math.max(0, (1 - quality.duplicateCode / 100)) * 15;

  return eslintScore + typeScore + coverageScore + duplicationScore;
}

function calculateLogicScore(logic: TestResults['logic']): number {
  const unitScore = (logic.unitTests.passed / logic.unitTests.total) * 40;
  const integrationScore =
    (logic.integrationTests.passed / logic.integrationTests.total) * 35;
  const e2eScore = (logic.e2eTests.passed / logic.e2eTests.total) * 25;

  return unitScore + integrationScore + e2eScore;
}

function countRegressions(results: TestResults, baseline: any): number {
  let count = 0;

  if (results.logic.unitTests.passed < baseline.logic.unitTests.passed) {
    count += baseline.logic.unitTests.passed - results.logic.unitTests.passed;
  }
  if (
    results.logic.integrationTests.passed <
    baseline.logic.integrationTests.passed
  ) {
    count +=
      baseline.logic.integrationTests.passed -
      results.logic.integrationTests.passed;
  }
  if (results.logic.e2eTests.passed < baseline.logic.e2eTests.passed) {
    count += baseline.logic.e2eTests.passed - results.logic.e2eTests.passed;
  }

  return count;
}
