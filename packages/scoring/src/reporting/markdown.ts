export function generateMarkdownReport(data: any): string {
  const { score, results, baseline, timestamp } = data;

  return `# Coding Agent Benchmark Report

**Generated:** ${new Date(timestamp).toLocaleString()}

---

## Overall Score: ${score.total.toFixed(2)}/100

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|----------|-------|--------|----------------|
| Security | ${score.security.toFixed(2)}/100 | 3.0x | ${(score.security * 3.0).toFixed(2)} |
| Performance | ${score.performance.toFixed(2)}/100 | 2.0x | ${(score.performance * 2.0).toFixed(2)} |
| Code Quality | ${score.quality.toFixed(2)}/100 | 1.5x | ${(score.quality * 1.5).toFixed(2)} |
| Logic | ${score.logic.toFixed(2)}/100 | 2.5x | ${(score.logic * 2.5).toFixed(2)} |

${score.regressions > 0 ? `\n⚠️ **Regressions Detected:** ${score.regressions} tests failed that previously passed (-${score.regressions * 5} points)\n` : ''}

---

## 🔒 Security (${score.security.toFixed(2)}/100)

### Test Results

| Test Category | Passed | Total | Pass Rate |
|---------------|--------|-------|-----------|
| SQL Injection Prevention | ${results.security.sqlInjectionTests.passed} | ${results.security.sqlInjectionTests.total} | ${((results.security.sqlInjectionTests.passed / results.security.sqlInjectionTests.total) * 100).toFixed(1)}% |
| XSS Prevention | ${results.security.xssTests.passed} | ${results.security.xssTests.total} | ${((results.security.xssTests.passed / results.security.xssTests.total) * 100).toFixed(1)}% |
| Authentication & Authorization | ${results.security.authTests.passed} | ${results.security.authTests.total} | ${((results.security.authTests.passed / results.security.authTests.total) * 100).toFixed(1)}% |
| Secrets Management | ${results.security.secretsScan.issuesFixed} | ${results.security.secretsScan.totalIssues} | ${((results.security.secretsScan.issuesFixed / results.security.secretsScan.totalIssues) * 100).toFixed(1)}% |

---

## ⚡ Performance (${score.performance.toFixed(2)}/100)

### Metrics

| Metric | Current | Baseline | Change |
|--------|---------|----------|--------|
| Response Time | ${results.performance.responseTime}ms | ${baseline.performance.responseTime}ms | ${((results.performance.responseTime - baseline.performance.responseTime) / baseline.performance.responseTime * 100).toFixed(1)}% |
| Memory Usage | ${results.performance.memoryUsage}MB | ${baseline.performance.memoryUsage}MB | ${((results.performance.memoryUsage - baseline.performance.memoryUsage) / baseline.performance.memoryUsage * 100).toFixed(1)}% |
| Bundle Size | ${results.performance.bundleSize}KB | ${baseline.performance.bundleSize}KB | ${((results.performance.bundleSize - baseline.performance.bundleSize) / baseline.performance.bundleSize * 100).toFixed(1)}% |
| Lighthouse Score | ${results.performance.lighthouseScore} | ${baseline.performance.lighthouseScore} | ${(results.performance.lighthouseScore - baseline.performance.lighthouseScore).toFixed(0)} |

---

## 📊 Code Quality (${score.quality.toFixed(2)}/100)

### Metrics

| Metric | Current | Baseline | Change |
|--------|---------|----------|--------|
| ESLint Errors | ${results.quality.eslintErrors} | ${baseline.quality.eslintErrors} | ${results.quality.eslintErrors - baseline.quality.eslintErrors} |
| Type Errors | ${results.quality.typeErrors} | ${baseline.quality.typeErrors} | ${results.quality.typeErrors - baseline.quality.typeErrors} |
| Test Coverage | ${results.quality.testCoverage}% | ${baseline.quality.testCoverage}% | ${(results.quality.testCoverage - baseline.quality.testCoverage).toFixed(1)}% |
| Code Duplication | ${results.quality.duplicateCode}% | ${baseline.quality.duplicateCode}% | ${(results.quality.duplicateCode - baseline.quality.duplicateCode).toFixed(1)}% |

---

## 🧪 Logic Tests (${score.logic.toFixed(2)}/100)

### Test Results

| Test Suite | Passed | Total | Pass Rate |
|------------|--------|-------|-----------|
| Unit Tests | ${results.logic.unitTests.passed} | ${results.logic.unitTests.total} | ${((results.logic.unitTests.passed / results.logic.unitTests.total) * 100).toFixed(1)}% |
| Integration Tests | ${results.logic.integrationTests.passed} | ${results.logic.integrationTests.total} | ${((results.logic.integrationTests.passed / results.logic.integrationTests.total) * 100).toFixed(1)}% |
| E2E Tests | ${results.logic.e2eTests.passed} | ${results.logic.e2eTests.total} | ${((results.logic.e2eTests.passed / results.logic.e2eTests.total) * 100).toFixed(1)}% |

---

## 📈 Score Comparison

\`\`\`
Baseline Score: ~28/100
Current Score:  ${score.total.toFixed(2)}/100
Improvement:    ${(score.total - 28).toFixed(2)} points
\`\`\`

---

## 🎯 Next Steps

${generateRecommendations(score, results)}
`;
}

function generateRecommendations(score: any, results: any): string {
  const recommendations: string[] = [];

  if (score.security < 50) {
    recommendations.push('- **High Priority:** Fix SQL injection vulnerabilities and implement proper input validation');
    recommendations.push('- Remove hardcoded secrets and use environment variables');
    recommendations.push('- Implement proper authentication and authorization checks');
  }

  if (score.performance < 50) {
    recommendations.push('- Optimize database queries to prevent N+1 problems');
    recommendations.push('- Fix memory leaks in React components');
    recommendations.push('- Improve algorithm efficiency (replace O(n²) with O(n log n))');
  }

  if (score.quality < 50) {
    recommendations.push('- Reduce code duplication by extracting common functions');
    recommendations.push('- Add proper error handling to all async operations');
    recommendations.push('- Replace `any` types with proper TypeScript types');
  }

  if (score.logic < 50) {
    recommendations.push('- Fix off-by-one errors in pagination');
    recommendations.push('- Handle edge cases (empty arrays, zero quantities, etc.)');
    recommendations.push('- Fix race conditions in concurrent operations');
  }

  if (recommendations.length === 0) {
    recommendations.push('- Great work! Continue monitoring for regressions');
    recommendations.push('- Consider performance optimizations for scale');
  }

  return recommendations.join('\n');
}
