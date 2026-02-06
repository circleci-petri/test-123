import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface TestResults {
  security: {
    sqlInjectionTests: { passed: number; total: number };
    xssTests: { passed: number; total: number };
    authTests: { passed: number; total: number };
    secretsScan: { issuesFixed: number; totalIssues: number };
  };
  performance: {
    responseTime: number;
    memoryUsage: number;
    bundleSize: number;
    lighthouseScore: number;
  };
  quality: {
    eslintErrors: number;
    typeErrors: number;
    testCoverage: number;
    duplicateCode: number;
  };
  logic: {
    unitTests: { passed: number; total: number };
    integrationTests: { passed: number; total: number };
    e2eTests: { passed: number; total: number };
  };
}

// --- Baseline fallback values ---
const BASELINE = {
  backendUnit: { passed: 5, total: 17 },
  backendIntegration: { passed: 6, total: 9 },
  frontendUnit: { passed: 4, total: 6 },
  e2e: { passed: 0, total: 2 },
  sqlInjection: { passed: 0, total: 2 },
  auth: { passed: 2, total: 9 },
  xss: { passed: 0, total: 2 },
  eslintErrors: 2,
  typeErrors: 1,
  testCoverage: 71,
  duplicateCode: 18,
  bundleSize: 174,
  responseTime: 850,
  memoryUsage: 145,
  lighthouseScore: 55,
};

// --- Helpers ---

function runCommand(cmd: string, cwd: string): string {
  try {
    return execSync(cmd, {
      cwd,
      timeout: 120_000,
      encoding: 'utf8',
      env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (err: any) {
    // Jest/ESLint exit non-zero on failures but still produce JSON on stdout
    if (err.stdout) return err.stdout;
    return '';
  }
}

function parseJestJson(output: string): { numPassedTests: number; numTotalTests: number } | null {
  try {
    // Jest/Vitest JSON output may be preceded by non-JSON text; find the start
    const idx = output.indexOf('{"num');
    if (idx === -1) {
      // Try alternate start patterns
      const idx2 = output.indexOf('{"testResults');
      if (idx2 === -1) return null;
      const parsed = JSON.parse(output.slice(idx2));
      return {
        numPassedTests: parsed.numPassedTests ?? 0,
        numTotalTests: parsed.numTotalTests ?? 0,
      };
    }
    const parsed = JSON.parse(output.slice(idx));
    return {
      numPassedTests: parsed.numPassedTests ?? 0,
      numTotalTests: parsed.numTotalTests ?? 0,
    };
  } catch {
    return null;
  }
}

interface JestTestResult {
  ancestorTitles: string[];
  title: string;
  status: string;
  fullName: string;
}

function parseJestTestCases(output: string): JestTestResult[] | null {
  try {
    const idx = output.indexOf('{"num');
    const idx2 = output.indexOf('{"testResults');
    const start = idx !== -1 ? idx : idx2;
    if (start === -1) return null;
    const parsed = JSON.parse(output.slice(start));
    const cases: JestTestResult[] = [];
    for (const suite of parsed.testResults ?? []) {
      for (const tc of suite.testResults ?? []) {
        cases.push({
          ancestorTitles: tc.ancestorTitles ?? [],
          title: tc.title ?? '',
          status: tc.status ?? '',
          fullName: tc.fullName ?? '',
        });
      }
    }
    return cases;
  } catch {
    return null;
  }
}

// --- Collectors ---

async function collectBackendTests(rootDir: string) {
  const backendDir = path.join(rootDir, 'packages/backend');

  // Unit tests
  let unitTests = { ...BASELINE.backendUnit };
  try {
    const unitOut = runCommand('npx jest tests/unit --json --forceExit --no-coverage', backendDir);
    const parsed = parseJestJson(unitOut);
    if (parsed && parsed.numTotalTests > 0) {
      unitTests = { passed: parsed.numPassedTests, total: parsed.numTotalTests };
    }
  } catch {
    console.error('Failed to collect backend unit tests, using baseline');
  }

  // Integration tests
  let integrationTests = { ...BASELINE.backendIntegration };
  try {
    const intOut = runCommand('npx jest tests/integration --json --forceExit --no-coverage', backendDir);
    const parsed = parseJestJson(intOut);
    if (parsed && parsed.numTotalTests > 0) {
      integrationTests = { passed: parsed.numPassedTests, total: parsed.numTotalTests };
    }
  } catch {
    console.error('Failed to collect backend integration tests, using baseline');
  }

  return { unitTests, integrationTests };
}

interface VitestResult {
  numPassedTests: number;
  numTotalTests: number;
  testCases: JestTestResult[];
}

async function runFrontendVitest(rootDir: string): Promise<VitestResult | null> {
  const frontendDir = path.join(rootDir, 'packages/frontend');
  try {
    const out = runCommand('npx vitest run --reporter=json', frontendDir);
    const parsed = parseJestJson(out);
    const cases = parseJestTestCases(out);
    if (parsed && parsed.numTotalTests > 0) {
      return {
        numPassedTests: parsed.numPassedTests,
        numTotalTests: parsed.numTotalTests,
        testCases: cases ?? [],
      };
    }
  } catch {
    console.error('Failed to run frontend vitest');
  }
  return null;
}

async function collectFrontendTests(rootDir: string, vitestResult: VitestResult | null) {
  // Frontend unit tests from vitest
  let unitTests = { ...BASELINE.frontendUnit };
  if (vitestResult) {
    unitTests = { passed: vitestResult.numPassedTests, total: vitestResult.numTotalTests };
  }

  // E2E (Playwright) - requires running servers, so fallback expected
  let e2eTests = { ...BASELINE.e2e };
  try {
    const frontendDir = path.join(rootDir, 'packages/frontend');
    const out = runCommand('npx playwright test --reporter=json', frontendDir);
    const parsed = JSON.parse(out);
    if (parsed.stats) {
      const total = (parsed.stats.expected ?? 0) + (parsed.stats.unexpected ?? 0) + (parsed.stats.skipped ?? 0);
      if (total > 0) {
        e2eTests = { passed: parsed.stats.expected ?? 0, total };
      }
    }
  } catch {
    // Playwright needs running servers; fallback is expected
  }

  return { unitTests, e2eTests };
}

async function collectSecurityTests(rootDir: string, vitestResult: VitestResult | null) {
  const backendDir = path.join(rootDir, 'packages/backend');

  // Run security tests with JSON output
  let sqlInjectionTests = { ...BASELINE.sqlInjection };
  let authTests = { ...BASELINE.auth };

  try {
    const secOut = runCommand('npx jest tests/security --json --forceExit --no-coverage', backendDir);
    const cases = parseJestTestCases(secOut);
    if (cases && cases.length > 0) {
      // Categorize tests by name
      const sqlCases = cases.filter(
        (tc) => {
          const name = tc.fullName.toLowerCase();
          return name.includes('sql injection') || name.includes('union');
        }
      );
      const authCases = cases.filter(
        (tc) => {
          const name = tc.fullName.toLowerCase();
          return !(name.includes('sql injection') || name.includes('union'));
        }
      );

      if (sqlCases.length > 0) {
        sqlInjectionTests = {
          passed: sqlCases.filter((t) => t.status === 'passed').length,
          total: sqlCases.length,
        };
      }
      if (authCases.length > 0) {
        authTests = {
          passed: authCases.filter((t) => t.status === 'passed').length,
          total: authCases.length,
        };
      }
    }
  } catch {
    console.error('Failed to collect security tests, using baseline');
  }

  // XSS tests from vitest frontend results
  let xssTests = { ...BASELINE.xss };
  if (vitestResult && vitestResult.testCases.length > 0) {
    const xssCases = vitestResult.testCases.filter((tc) => {
      const name = tc.fullName.toLowerCase();
      return (
        name.includes('html') ||
        name.includes('script') ||
        name.includes('escape') ||
        name.includes('dangerous') ||
        name.includes('xss')
      );
    });
    if (xssCases.length > 0) {
      xssTests = {
        passed: xssCases.filter((t) => t.status === 'passed').length,
        total: xssCases.length,
      };
    }
  }

  // Secrets scan - already works, keep existing logic
  const secretsFile = path.join(rootDir, 'packages/backend/src/config/secrets.ts');
  let secretsScan = { issuesFixed: 0, totalIssues: 6 };
  try {
    const secretsContent = fs.readFileSync(secretsFile, 'utf8');
    const hasHardcodedSecrets =
      secretsContent.includes('super-secret-key') ||
      secretsContent.includes('sk_live_') ||
      secretsContent.includes('sk_test_');
    secretsScan = { issuesFixed: hasHardcodedSecrets ? 0 : 6, totalIssues: 6 };
  } catch {
    console.error('Failed to read secrets file, using baseline');
  }

  return {
    sqlInjectionTests,
    xssTests,
    authTests,
    secretsScan,
  };
}

async function collectQualityMetrics(rootDir: string) {
  // ESLint errors
  let eslintErrors = BASELINE.eslintErrors;
  try {
    const out = runCommand(
      'npx eslint packages/backend/src packages/frontend/src --ext .ts,.tsx -f json',
      rootDir
    );
    const parsed = JSON.parse(out);
    if (Array.isArray(parsed)) {
      eslintErrors = parsed.reduce((sum: number, file: any) => sum + (file.errorCount ?? 0), 0);
    }
  } catch {
    console.error('Failed to collect eslint errors, using baseline');
  }

  // TypeScript errors
  let typeErrors = BASELINE.typeErrors;
  try {
    let totalErrors = 0;
    // Backend
    const backendOut = runCommand(
      'npx tsc --noEmit --pretty false -p packages/backend/tsconfig.json',
      rootDir
    );
    totalErrors += (backendOut.match(/error TS\d+/g) ?? []).length;

    // Frontend
    const frontendOut = runCommand(
      'npx tsc --noEmit --pretty false -p packages/frontend/tsconfig.json',
      rootDir
    );
    totalErrors += (frontendOut.match(/error TS\d+/g) ?? []).length;

    typeErrors = totalErrors;
  } catch {
    console.error('Failed to collect type errors, using baseline');
  }

  // Test coverage
  let testCoverage = BASELINE.testCoverage;
  try {
    const backendDir = path.join(rootDir, 'packages/backend');
    runCommand(
      'npx jest --coverage --coverageReporters=json-summary --forceExit',
      backendDir
    );
    const coveragePath = path.join(backendDir, 'coverage/coverage-summary.json');
    if (fs.existsSync(coveragePath)) {
      const coverageData = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      if (coverageData.total?.lines?.pct !== undefined) {
        testCoverage = Math.round(coverageData.total.lines.pct);
      }
    }
  } catch {
    console.error('Failed to collect test coverage, using baseline');
  }

  // Duplicate code - no tool in project deps, keep hardcoded
  const duplicateCode = BASELINE.duplicateCode;

  return {
    eslintErrors,
    typeErrors,
    testCoverage,
    duplicateCode,
  };
}

async function collectPerformanceMetrics(rootDir: string) {
  // Bundle size - measure actual dist assets
  let bundleSize = BASELINE.bundleSize;
  try {
    const assetsDir = path.join(rootDir, 'packages/frontend/dist/assets');
    if (fs.existsSync(assetsDir)) {
      const files = fs.readdirSync(assetsDir);
      let totalBytes = 0;
      for (const file of files) {
        // Skip source maps
        if (file.endsWith('.map')) continue;
        const stat = fs.statSync(path.join(assetsDir, file));
        totalBytes += stat.size;
      }
      if (totalBytes > 0) {
        bundleSize = Math.round(totalBytes / 1024);
      }
    }
  } catch {
    console.error('Failed to measure bundle size, using baseline');
  }

  // These require a running server to measure, keep baseline defaults
  return {
    responseTime: BASELINE.responseTime,
    memoryUsage: BASELINE.memoryUsage,
    bundleSize,
    lighthouseScore: BASELINE.lighthouseScore,
  };
}

// --- Orchestrator ---

export async function collectTestResults(): Promise<TestResults> {
  const rootDir = path.join(__dirname, '../../../..');

  // Run frontend vitest once, share results between collectors
  const vitestResult = await runFrontendVitest(rootDir);

  const backendTestResults = await collectBackendTests(rootDir);
  const frontendTestResults = await collectFrontendTests(rootDir, vitestResult);
  const securityResults = await collectSecurityTests(rootDir, vitestResult);
  const qualityResults = await collectQualityMetrics(rootDir);
  const performanceResults = await collectPerformanceMetrics(rootDir);

  // Merge frontend unit tests into logic.unitTests alongside backend unit tests
  const backendUnit = backendTestResults.unitTests;
  const frontendUnit = frontendTestResults.unitTests;
  const mergedUnitTests = {
    passed: backendUnit.passed + frontendUnit.passed,
    total: backendUnit.total + frontendUnit.total,
  };

  return {
    security: securityResults,
    performance: performanceResults,
    quality: qualityResults,
    logic: {
      unitTests: mergedUnitTests,
      integrationTests: backendTestResults.integrationTests,
      e2eTests: frontendTestResults.e2eTests,
    },
  };
}
