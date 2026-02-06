export function getBaseline() {
  return {
    security: {
      score: 15,
      sqlInjectionTests: { passed: 0, total: 8 },
      xssTests: { passed: 0, total: 5 },
      authTests: { passed: 2, total: 9 },
      secretsScan: { issuesFixed: 0, totalIssues: 6 },
    },
    performance: {
      responseTime: 850,
      memoryUsage: 145,
      bundleSize: 174,
      lighthouseScore: 55,
    },
    quality: {
      eslintErrors: 2,
      typeErrors: 1,
      testCoverage: 71,
      duplicateCode: 18,
    },
    logic: {
      unitTests: { passed: 9, total: 23 },
      integrationTests: { passed: 6, total: 9 },
      e2eTests: { passed: 0, total: 2 },
    },
  };
}
