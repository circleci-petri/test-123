import { calculateScore } from './scoring/calculator';
import { collectTestResults } from './collectors/testCollector';
import { generateMarkdownReport } from './reporting/markdown';
import { getBaseline } from './scoring/baseline';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const command = process.argv[2] || 'calculate';
  const rootDir = path.join(__dirname, '../../..');

  if (command === 'calculate') {
    console.log('Collecting test results...');
    const results = await collectTestResults();

    console.log('Calculating score...');
    const baseline = getBaseline();
    const score = calculateScore(results, baseline);

    const output = {
      score,
      results,
      baseline,
      timestamp: new Date().toISOString(),
    };

    fs.writeFileSync(
      path.join(rootDir, 'score-results.json'),
      JSON.stringify(output, null, 2)
    );

    console.log(`\nFinal Score: ${score.total.toFixed(2)}/100`);
    console.log(`Security: ${score.security.toFixed(2)}/100`);
    console.log(`Performance: ${score.performance.toFixed(2)}/100`);
    console.log(`Quality: ${score.quality.toFixed(2)}/100`);
    console.log(`Logic: ${score.logic.toFixed(2)}/100`);
  } else if (command === 'report') {
    console.log('Generating report...');

    const resultsPath = path.join(rootDir, 'score-results.json');
    if (!fs.existsSync(resultsPath)) {
      console.error('No results found. Run "calculate" first.');
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    const markdown = generateMarkdownReport(data);

    fs.writeFileSync(path.join(rootDir, 'benchmark-report.md'), markdown);

    console.log('Report generated: benchmark-report.md');
  } else if (command === 'baseline') {
    console.log('Generating baseline metrics...');
    const results = await collectTestResults();
    const baseline = getBaseline();

    console.log('Baseline metrics:');
    console.log(JSON.stringify(baseline, null, 2));
  }
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
