# Contributing to Allyson MCP Server

Thank you for your interest in contributing! This project uses automated versioning and publishing based on conventional commits.

## Conventional Commits

This project follows the [Conventional Commits](https://conventionalcommits.org/) specification for automatic semantic versioning. Your commit messages should follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

- `feat`: A new feature (triggers a **minor** version bump)
- `fix`: A bug fix (triggers a **patch** version bump)  
- `feat!`: A breaking change (triggers a **major** version bump)
- `fix!`: A breaking bug fix (triggers a **major** version bump)
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
# Minor version bump (1.0.0 → 1.1.0)
git commit -m "feat: add support for WebP image format"

# Patch version bump (1.0.0 → 1.0.1)
git commit -m "fix: resolve animation timing issue with large files"

# Major version bump (1.0.0 → 2.0.0)
git commit -m "feat!: change API response format

BREAKING CHANGE: The animation API now returns a different response structure"

# No version bump
git commit -m "docs: update README with new examples"
```

## Automatic Publishing

When you push to the `main` branch:

1. **CI/CD Pipeline**: Runs tests and linting
2. **Version Detection**: Analyzes your commit message to determine version bump
3. **Auto-increment**: Updates version in `package.json` 
4. **Publish**: Publishes to npm automatically
5. **Release**: Creates a GitHub release with changelog

## Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Make** your changes
4. **Test** your changes: `npm test`
5. **Commit** using conventional commits: `git commit -m "feat: add my feature"`
6. **Push** to your fork: `git push origin feature/my-feature`
7. **Create** a Pull Request

## Local Development

```bash
# Clone the repository
git clone https://github.com/allyson/mcp.git
cd mcp

# Install dependencies
npm install

# Test the server
npm test

# Run in development mode
npm run dev -- --api-key YOUR_API_KEY
```

## Release Process

Releases are **fully automated**:

- Push to `main` → automatic version bump & publish
- No manual `npm version` or `npm publish` needed
- GitHub releases are created automatically
- Version numbers follow semantic versioning

## Questions?

- Check existing [Issues](https://github.com/allyson/mcp/issues)
- Create a new issue for bugs or feature requests
- Contact the maintainers for questions

Happy contributing! 🚀 