# CI/CD Setup Guide

This guide explains how to configure your GitHub repository for automated publishing and versioning.

## Required GitHub Secrets

You need to configure these secrets in your GitHub repository:

### 1. NPM_TOKEN

This token allows GitHub Actions to publish to npm.

**Steps:**
1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Click your profile → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type (allows publishing)
5. Copy the generated token
6. In your GitHub repo, go to **Settings** → **Secrets and variables** → **Actions**
7. Click **New repository secret**
8. Name: `NPM_TOKEN`
9. Value: Paste your npm token
10. Click **Add secret**

### 2. GITHUB_TOKEN

This is automatically provided by GitHub Actions, no setup needed!

## Verifying Setup

### Test the Pipeline

1. **Make a change** to your code
2. **Commit using conventional commits**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```
3. **Check GitHub Actions** tab to see the pipeline running
4. **Verify npm publish** at https://www.npmjs.com/package/allyson-mcp
5. **Check GitHub Releases** for the auto-created release

### Example Commit Messages

```bash
# Patch version (1.0.4 → 1.0.5)
git commit -m "fix: resolve memory leak in animation processing"

# Minor version (1.0.4 → 1.1.0)  
git commit -m "feat: add support for GIF animations"

# Major version (1.0.4 → 2.0.0)
git commit -m "feat!: change API response format

BREAKING CHANGE: All API responses now use camelCase instead of snake_case"
```

## Troubleshooting

### Common Issues

**❌ "npm publish failed - 403 Forbidden"**
- Check your `NPM_TOKEN` is correctly set
- Verify the token has "Automation" permissions
- Make sure you're the owner/maintainer of the npm package

**❌ "Version already exists"**
- The version wasn't bumped properly
- Check if the commit message follows conventional commits format
- Look at the GitHub Actions logs for version detection

**❌ "Git push failed"**
- The workflow needs push permissions
- Go to **Settings** → **Actions** → **General**
- Under "Workflow permissions", select "Read and write permissions"

**❌ "Tests failed"**
- Fix the failing tests before the publish step will run
- Check the "test" job logs in GitHub Actions

### Manual Version Override

If you need to manually set a version:

```bash
npm version 1.2.3 --no-git-tag-version
git add package.json package-lock.json
git commit -m "chore: bump version to 1.2.3"
git push origin main
```

## Workflow Summary

Here's what happens on each push to `main`:

1. 🧪 **Test Job**: Runs `npm test` and lint checks
2. 📋 **Version Analysis**: Reads commit message to determine bump type
3. 🔢 **Version Bump**: Updates `package.json` with new version
4. 📝 **Git Commit**: Commits the version bump with `[skip ci]`
5. 🏷️ **Git Tag**: Creates a git tag for the new version  
6. 📤 **NPM Publish**: Publishes the package to npm
7. 🎉 **GitHub Release**: Creates a release with changelog

## Security Notes

- Never commit npm tokens to your repository
- Use GitHub Secrets for all sensitive information
- The `GITHUB_TOKEN` is scoped only to your repository
- Tokens can be revoked anytime from npm/GitHub settings

---

🎉 **You're all set!** Your package will now automatically publish with proper semantic versioning on every push to main. 