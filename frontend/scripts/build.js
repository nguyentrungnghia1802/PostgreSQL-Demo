/**
 * Build workaround for paths containing '#' character.
 * Vite/Rollup cannot resolve modules in paths with '#' because it treats '#' as a URL fragment separator.
 * This script copies the frontend source to a temp dir and builds from there.
 */
const { execSync } = require('child_process');
const { cpSync, mkdirSync, rmSync, existsSync } = require('fs');
const path = require('path');
const os = require('os');

const frontendDir = path.resolve(__dirname, '..');
const tempDir = path.join(os.homedir(), 'pg_showcase_frontend_build');

console.log('Build workaround: copying source to temp dir...');
console.log('  Source:', frontendDir);
console.log('  Temp:  ', tempDir);

// Clean temp dir
if (existsSync(tempDir)) rmSync(tempDir, { recursive: true, force: true });
mkdirSync(tempDir, { recursive: true });

// Copy files (exclude node_modules, dist, .git)
cpSync(frontendDir, tempDir, {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(frontendDir, src);
    if (!rel) return true; // include root
    const parts = rel.split(path.sep);
    return parts[0] !== 'node_modules' && parts[0] !== 'dist' && parts[0] !== '.git' && parts[0] !== 'scripts';
  }
});

// Create junction to node_modules (avoids copying ~hundreds of MB)
const nmSrc = path.join(frontendDir, 'node_modules');
const nmDst = path.join(tempDir, 'node_modules');
try {
  execSync(`cmd /c mklink /J "${nmDst}" "${nmSrc}"`, { stdio: 'pipe' });
} catch (_) {
  // If junction creation fails, fall back to copying node_modules
  console.log('  Junction failed, symlinking node_modules...');
  cpSync(nmSrc, nmDst, { recursive: true });
}

try {
  // TypeScript check from original dir
  console.log('Running TypeScript check...');
  execSync('npx tsc --noEmit', { cwd: frontendDir, stdio: 'inherit' });

  // Run vite build from temp dir (no '#' in path)
  console.log('Running Vite build from temp dir...');
  execSync('npx vite build', { cwd: tempDir, stdio: 'inherit' });

  // Copy dist output back to original frontend dir
  const distSrc = path.join(tempDir, 'dist');
  const distDst = path.join(frontendDir, 'dist');
  if (existsSync(distDst)) rmSync(distDst, { recursive: true, force: true });
  cpSync(distSrc, distDst, { recursive: true });

  console.log('\nBuild successful! Output:', distDst);
} finally {
  // Clean up temp dir
  rmSync(tempDir, { recursive: true, force: true });
  console.log('Cleaned up temp build dir.');
}
