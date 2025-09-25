#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

class ChangelogGenerator {
  constructor() {
    this.changelogPath = 'CHANGELOG.md';
    this.packageJsonPath = 'package.json';
  }

  getCurrentVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      return packageJson.version;
    } catch (error) {
      return '1.0.0';
    }
  }

  getGitCommits(since = null) {
    try {
      let command = 'git log --oneline';
      if (since) {
        command += ` ${since}..HEAD`;
      }
      
      const output = execSync(command, { encoding: 'utf8' });
      return output.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const match = line.match(/^([a-f0-9]+)\s+(.+)$/);
          if (!match) return null;
          
          const [, hash, subject] = match;
          return { 
            hash: hash.trim(), 
            subject: subject.trim()
          };
        })
        .filter(commit => commit !== null);
    } catch (error) {
      console.warn('Could not get git commits:', error.message);
      return [];
    }
  }

  getLastReleaseTag() {
    try {
      const tags = execSync('git tag -l --sort=-version:refname', { encoding: 'utf8' })
        .split('\n')
        .filter(tag => tag.trim() && /^v?\d+\.\d+\.\d+/.test(tag));
      
      return tags[0] || null;
    } catch (error) {
      return null;
    }
  }

  parseCommit(commit) {
    const { subject, hash } = commit;
    
    // Parse conventional commit format
    const match = subject.match(/^(\w*)(?:\(([^)]*)\))?: (.*)$/);
    if (!match) {
      return {
        type: 'other',
        scope: null,
        description: subject,
        hash,
        skip: false
      };
    }

    const [, type, scope, description] = match;

    return {
      type: type.toLowerCase(),
      scope,
      description,
      hash,
      skip: ['build', 'ci', 'chore'].includes(type.toLowerCase())
    };
  }

  groupCommits(commits) {
    const groups = {
      features: [],
      fixes: [],
      other: []
    };

    commits.forEach(commit => {
      const parsed = this.parseCommit(commit);
      
      if (parsed.skip) return;

      if (parsed.type === 'feat') {
        groups.features.push(parsed);
      } else if (parsed.type === 'fix') {
        groups.fixes.push(parsed);
      } else {
        groups.other.push(parsed);
      }
    });

    return groups;
  }

  formatCommit(commit) {
    const scope = commit.scope ? `**${commit.scope}:** ` : '';
    const shortHash = commit.hash.substring(0, 7);
    
    return `- ${scope}${commit.description} ([${shortHash}](../../commit/${commit.hash}))`;
  }

  generateChangelogSection(version, date, groups) {
    let content = `## [${version}] - ${date}\n\n`;

    if (groups.features.length > 0) {
      content += `### ✨ Added\n\n`;
      groups.features.forEach(commit => {
        content += this.formatCommit(commit) + '\n';
      });
      content += '\n';
    }

    if (groups.fixes.length > 0) {
      content += `### 🐛 Fixed\n\n`;
      groups.fixes.forEach(commit => {
        content += this.formatCommit(commit) + '\n';
      });
      content += '\n';
    }

    if (groups.other.length > 0) {
      content += `### 🔄 Changed\n\n`;
      groups.other.forEach(commit => {
        content += this.formatCommit(commit) + '\n';
      });
      content += '\n';
    }

    return content;
  }

  readExistingChangelog() {
    try {
      return fs.readFileSync(this.changelogPath, 'utf8');
    } catch (error) {
      return '';
    }
  }

  writeChangelog(content) {
    fs.writeFileSync(this.changelogPath, content, 'utf8');
  }

  initializeChangelog() {
    const header = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;

    if (!fs.existsSync(this.changelogPath)) {
      this.writeChangelog(header);
      console.log('✅ Created CHANGELOG.md');
    }

    return header;
  }

  generate(options = {}) {
    const { version = this.getCurrentVersion(), dry = false, debug = false } = options;
    
    console.log(`📝 Generating changelog for version ${version}...`);

    // Initialize changelog if it doesn't exist
    this.initializeChangelog();
    const existingChangelog = this.readExistingChangelog();

    // Get commits since last release
    const lastTag = this.getLastReleaseTag();
    const commits = this.getGitCommits(lastTag);
    
    if (debug) {
      console.log('\n🔍 Debug: Raw commits:');
      commits.forEach((commit, index) => {
        console.log(`${index + 1}. Hash: ${commit.hash}`);
        console.log(`   Subject: "${commit.subject}"`);
        console.log('---');
      });
    }
    
    if (commits.length === 0) {
      console.log('ℹ️ No commits found since last release');
      return;
    }

    console.log(`📊 Found ${commits.length} commits since ${lastTag || 'start'}`);

    // Group and process commits
    const groups = this.groupCommits(commits);
    const totalChanges = groups.features.length + groups.fixes.length + groups.other.length;

    if (totalChanges === 0) {
      console.log('ℹ️ No significant changes found');
      return;
    }

    // Generate new changelog section
    const date = new Date().toISOString().split('T')[0];
    const newSection = this.generateChangelogSection(version, date, groups);

    if (dry) {
      console.log('\n🔍 Preview of changelog section:\n');
      console.log(newSection);
      return;
    }

    // Insert new section after header
    const lines = existingChangelog.split('\n');
    const headerEndIndex = lines.findIndex(line => line.trim() === '') + 1;
    
    lines.splice(headerEndIndex, 0, newSection);
    const newChangelog = lines.join('\n');

    // Write updated changelog
    this.writeChangelog(newChangelog);
    
    console.log('✅ Changelog updated successfully!');
    console.log(`📈 Added ${totalChanges} changes:`);
    console.log(`   ✨ ${groups.features.length} features`);
    console.log(`   🐛 ${groups.fixes.length} fixes`);
    console.log(`   🔄 ${groups.other.length} other changes`);
  }
}

// CLI interface
const args = process.argv.slice(2);
const generator = new ChangelogGenerator();

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
📝 Changelog Generator

Usage:
  node scripts/changelog.js [options]

Options:
  --version, -v <version>  Specify version (default: from package.json)
  --dry-run, -d           Preview changes without writing
  --debug                 Show debug information about commits
  --init                  Initialize changelog file
  --help, -h              Show this help message

Examples:
  node scripts/changelog.js                    # Generate for current version
  node scripts/changelog.js -v 1.2.0          # Generate for specific version
  node scripts/changelog.js --dry-run         # Preview changes
  node scripts/changelog.js --debug           # Debug commit parsing
  node scripts/changelog.js --init            # Initialize changelog
`);
  process.exit(0);
}

if (args.includes('--init')) {
  generator.initializeChangelog();
  process.exit(0);
}

const version = args.includes('-v') ? args[args.indexOf('-v') + 1] : 
               args.includes('--version') ? args[args.indexOf('--version') + 1] : 
               undefined;

const dryRun = args.includes('--dry-run') || args.includes('-d');
const debug = args.includes('--debug');

try {
  generator.generate({ version, dry: dryRun, debug });
} catch (error) {
  console.error('❌ Error generating changelog:', error.message);
  if (debug) {
    console.error('Stack trace:', error.stack);
  }
  process.exit(1);
}