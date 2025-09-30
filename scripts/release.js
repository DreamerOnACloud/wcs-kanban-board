#!/usr/bin/env node
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// Get package version
const pkg = JSON.parse(readFileSync('./package.json'));
const currentVersion = pkg.version;

// Calculate next version based on type (patch, minor, major)
function getNextVersion(current, type = 'patch') {
  const [major, minor, patch] = current.split('.').map(Number);
  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
    default:
      return `${major}.${minor}.${patch + 1}`;
  }
}

// Check if tag exists
function checkTagExists(tag) {
  try {
    execSync(`git rev-parse v${tag}`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

async function release() {
  try {
    // Determine release type from args (patch, minor, major)
    const type = process.argv[2] || 'patch';
    if (!['patch', 'minor', 'major'].includes(type)) {
      console.error('❌ Invalid release type. Use: patch, minor, or major');
      process.exit(1);
    }

    // Calculate next version
    const nextVersion = getNextVersion(currentVersion, type);
    console.log(`🔍 Planning ${type} release: ${currentVersion} → ${nextVersion}`);

    // Check if tag already exists
    if (checkTagExists(nextVersion)) {
      console.error(`❌ Error: Tag v${nextVersion} already exists`);
      process.exit(1);
    }

    // Check for uncommitted changes
    try {
      execSync('git diff --quiet && git diff --cached --quiet');
    } catch (e) {
      console.error('❌ Error: Working directory is not clean. Commit or stash changes first.');
      process.exit(1);
    }

    console.log(`✨ Creating ${type} release v${nextVersion}...`);

    // Run npm version without git tag
    execSync(`npm version ${type} --no-git-tag-version`, { stdio: 'inherit' });

    // Generate changelog
    execSync('npm run changelog', { stdio: 'inherit' });

    // Commit version bump and changelog
    execSync('git add package.json package-lock.json CHANGELOG.md', { stdio: 'inherit' });
    execSync(`git commit -m "chore: release v${nextVersion}"`, { stdio: 'inherit' });

    // Create tag
    execSync(`git tag -a "v${nextVersion}" -m "Release v${nextVersion}"`, { stdio: 'inherit' });

    // Build
    execSync('npm run build', { stdio: 'inherit' });

    console.log(`\n✅ Released v${nextVersion} successfully!`);
    console.log('\nNext steps:');
    console.log('  git push origin main        # Push commits');
    console.log('  git push origin --tags      # Push tags');

  } catch (error) {
    console.error('\n❌ Release failed:', error.message);
    
    // Cleanup on failure
    console.log('\n🧹 Cleaning up...');
    
    try {
      // Restore package files
      execSync('git checkout package.json package-lock.json');
      
      // Remove tag if it was created
      const nextVersion = getNextVersion(currentVersion, process.argv[2] || 'patch');
      execSync(`git tag -d "v${nextVersion}"`, { stdio: 'ignore' });
      
      console.log('✅ Cleanup complete');
    } catch (cleanupError) {
      console.error('⚠️ Cleanup failed:', cleanupError.message);
    }
    
    process.exit(1);
  }
}

release().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});