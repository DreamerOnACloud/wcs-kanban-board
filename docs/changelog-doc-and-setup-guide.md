# Changelog Setup Guide

This guide explains how to set up and use the automated changelog generation system for the WCS Kanban Board project.

## Overview

The changelog system automatically generates `CHANGELOG.md` based on your git commit messages using the [Conventional Commits](https://www.conventionalcommits.org/) format.

## Setup Instructions

### 1. Create the scripts directory

```bash
mkdir -p scripts
```

### 2. Save the changelog script

Save the `changelog.js` script in `scripts/changelog.js` and make it executable:

```bash
chmod +x scripts/changelog.js
```

### 3. Update package.json

Replace your `package.json` with the updated version that includes the new scripts and configuration.

### 4. Create GitHub workflow (optional)

If using GitHub, create `.github/workflows/changelog.yml` with the workflow configuration.

## Usage

### Initialize the changelog

```bash
npm run changelog:init
```

This creates an empty `CHANGELOG.md` file with the proper header.

### Commit Current Changes
```bash
# Stage all the new files
git add .

# Commit using conventional commit format
git commit -m "<type>[optional scope]: <description>"
```

### Generate First Changelog Entry
```bash
# Preview what the changelog will look like
npm run changelog:dry

# Generate the actual changelog
npm run changelog
```

### Create First Release
Now create your first tagged release:
```bash
# Option A: Use the automated release script (recommended)
npm run release

# Option B: Manual version bump and tag
npm version patch
git push origin main
git push origin --tags
```

### Verify Everything Works
Check that everything was created correctly:
```bash
# Verify changelog was generated
cat CHANGELOG.md

# Check git status
git status

# View recent commits
git log --oneline -5
```

## Future Workflow

For future changes, follow this pattern:

### Making Changes with Conventional Commits

```bash
# Example: Adding a new feature
git add .
git commit -m "feat(board): add drag and drop for cards"

# Example: Fixing a bug  
git add .
git commit -m "fix(modal): resolve modal close button issue"

# Example: Documentation update
git add .
git commit -m "docs(readme): update installation instructions"

# Example: Breaking change
git add .
git commit -m "feat(api)!: redesign card component interface

BREAKING CHANGE: Card component now requires 'data' prop instead of 'title' and 'content' props"
```

## Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Supported Types

- `feat`: ✨ A new feature
- `fix`: 🐛 A bug fix
- `docs`: 📚 Documentation only changes
- `style`: 💄 Code style changes (formatting, etc.)
- `refactor`: ♻️ Code refactoring
- `perf`: ⚡ Performance improvements
- `test`: ✅ Adding or updating tests
- `build`: 🔧 Build system changes
- `ci`: 👷 CI configuration changes
- `chore`: 🔨 Other changes (maintenance, etc.)

### Examples

```bash
# Feature
git commit -m "feat(board): add drag and drop functionality"

# Bug fix
git commit -m "fix(card): resolve title display issue"

# Breaking change
git commit -m "feat(api)!: redesign component interface

BREAKING CHANGE: The card component now requires a 'data' prop instead of individual props"

# With scope
git commit -m "docs(readme): update installation instructions"
```

### Breaking Changes

Mark breaking changes by:

1. Adding `!` after the type: `feat!: breaking change`
2. Adding `BREAKING CHANGE:` in the footer
3. Using `BREAKING CHANGES:` in the footer

## Configuration

Customize the changelog behavior in `package.json` under the `changelog` key:

```json
{
  "changelog": {
    "types": {
      "feat": { "label": "✨ Features", "section": "Added" }
    },
    "skipTypes": ["build", "ci", "chore"],
    "breakingChangeKeywords": ["BREAKING CHANGE", "BREAKING CHANGES"]
  }
}
```

## Sample Changelog Output

```markdown
# Changelog

## [1.2.0] - 2024-01-15

### 💥 BREAKING CHANGES

- **api:** redesign component interface ([a1b2c3d](../../commit/a1b2c3d))

### ✨ Added

- **board:** add drag and drop functionality ([e4f5g6h](../../commit/e4f5g6h))
- **modal:** implement card editing modal ([i7j8k9l](../../commit/i7j8k9l))

### 🐛 Fixed

- **card:** resolve title display issue ([m0n1o2p](../../commit/m0n1o2p))
- **list:** fix card ordering bug ([q3r4s5t](../../commit/q3r4s5t))

### 🔄 Changed

- **style:** update card hover animations ([u6v7w8x](../../commit/u6v7w8x))
```

## GitHub Integration

The GitHub Actions workflow will:

1. **Automatically generate changelog** when you push a version tag
2. **Create GitHub releases** with changelog content
3. **Update the main branch** with the new changelog

To trigger manually:
- Go to Actions tab in your GitHub repository
- Select "Update Changelog" workflow
- Click "Run workflow"

## Best Practices

1. **Use conventional commits consistently** for automatic categorization
2. **Write descriptive commit messages** that explain what changed
3. **Use scopes** to group related changes (e.g., `feat(board):`, `fix(modal):`)
4. **Document breaking changes** clearly in commit footers
5. **Review generated changelog** before releasing
6. **Keep commits focused** - one logical change per commit

## Troubleshooting

### No commits found
- Ensure you have git tags for previous releases
- Check that commits exist since the last tag

### Wrong categorization
- Verify commit message format follows conventional commits
- Check the `types` configuration in `package.json`

### Missing changes
- Ensure commit types aren't in the `skipTypes` array
- Verify git repository has the expected commit history

### Script permissions
```bash
chmod +x scripts/changelog.js
```

## Manual Changelog Editing

You can always manually edit `CHANGELOG.md` if needed. The script will preserve manual entries and add new sections appropriately.


## ✅ Verification Checklist

After setup, verify:
- [ ] `scripts/changelog.js` exists and is executable
- [ ] `package.json` has the new scripts
- [ ] `CHANGELOG.md` was created with proper header
- [ ] Git commits use conventional format
- [ ] Changelog generates correctly with `npm run changelog:dry`
- [ ] Release process works with `npm run release`



### Creating Releases

```bash
# For patch releases (1.0.0 → 1.0.1)
npm run release

# For minor releases (1.0.0 → 1.1.0) 
npm run release:minor

# For major releases (1.0.0 → 2.0.0)
npm run release:major
```

### Manual Changelog Generation

```bash
# Preview changelog without writing
npm run changelog:dry

# Generate for current version
npm run changelog

# Generate for specific version
npm run changelog -- --version 2.1.0
```

## 🔧 Quick Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run changelog:init` | Initialize changelog file |
| `npm run changelog` | Generate changelog for current version |
| `npm run changelog:dry` | Preview changelog without writing |
| `npm run release` | Bump patch version + build + update changelog |
| `npm run release:minor` | Bump minor version + build + update changelog |
| `npm run release:major` | Bump major version + build + update changelog |

## 🎯 Complete Example Workflow

Here's a complete example of adding a new feature and releasing it:

```bash
# 1. Make your changes to the code
# (edit your component files...)

# 2. Test your changes
npm run dev

# 3. Commit with conventional format
git add .
git commit -m "feat(card): add delete functionality to cards"

# 4. Update changelog and create release
npm run release

# 5. Push to remote
git push origin main
git push origin --tags
```

## 🚨 Important Notes

### Commit Message Format
Always use the conventional commit format:
```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

