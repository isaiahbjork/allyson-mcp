# Allyson MCP Server

[![npm version](https://badge.fury.io/js/allyson-mcp.svg)](https://badge.fury.io/js/allyson-mcp)
[![Node.js Version](https://img.shields.io/node/v/allyson-mcp.svg)](https://nodejs.org)

**Allyson MCP Server** - AI-powered animation generator that transforms static files into animated SVG components using the Model Context Protocol (MCP).

## 🚀 Quick Start
[![Install MCP Server](https://cursor.com/deeplink/mcp-install-light.svg)](https://cursor.com/install-mcp?name=allyson&config=eyJjb21tYW5kIjoibnB4IGFsbHlzb24tbWNwIC0tYXBpLWtleSBZT1VSX0FQSV9LRVkifQ%3D%3D)

### Install and Run with npx

```bash
npx allyson-mcp --api-key YOUR_API_KEY
```

## 🔧 Configuration

### Command Line Options

```bash
allyson-mcp [options]

Options:
  --api-key <key>     Your Allyson API key (required)
  --help              Show help message

Examples:
  allyson-mcp --api-key your-api-key-here
  API_KEY=your-key allyson-mcp
```

### Environment Variables

You can also set your API key as an environment variable:

```bash
export API_KEY=your-api-key-here
allyson-mcp
```

## 🎯 Features

- **AI-Powered Animation Generation**: Transform static images into animated SVG components
- **MCP Protocol Compatible**: Works with any MCP-compatible AI assistant or tool
- **File Upload Support**: Supports various image formats (PNG, JPG, SVG, etc.)
- **Custom Animation Prompts**: Describe exactly what animation you want
- **Local File Processing**: Reads files from your local filesystem
- **Automatic Output Generation**: Saves animated components to specified paths

## 🛠 Available Tools

### `generate_svg_animation`

Generates an animated SVG component from a source file and animation prompt.

**Parameters:**
- `prompt` (string, required): Description of the animation to generate
  - Example: "Make the character wave their hand"
  - Example: "Add bouncing motion to the ball"
  - Example: "Create a spinning effect for the logo"
- `svg_path` (string, required): Absolute path to the source file
  - Example: "/Users/username/image.png"
  - Example: "/path/to/my-icon.svg"
- `output_path` (string, required): Absolute path where to save the animated component
  - Example: "/path/to/animated-component.tsx"

**Example Usage in MCP Client:**
```json
{
  "tool": "generate_svg_animation",
  "arguments": {
    "prompt": "Make the logo glow and pulse gently",
    "svg_path": "/Users/john/Desktop/company-logo.svg",
    "output_path": "/Users/john/project/src/components/AnimatedLogo.tsx"
  }
}
```

## 🔌 Integration with AI Assistants

This MCP server is designed to work with AI assistants that support the Model Context Protocol, such as:

- **Claude Desktop** (with MCP configuration)
- **Cursor IDE** (with MCP integration)
- **Custom AI Applications** (using MCP SDK)

### MCP Configuration

```json
{
  "mcpServers": {
    "allyson": {
      "command": "npx",
      "args": ["allyson-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

## 📝 Examples

### Basic Animation Generation

```bash
# Start the server
allyson-mcp --api-key your-api-key

# The AI assistant can now use the tool:
# "Please animate this logo to have a subtle glow effect"
# File: /Users/john/logo.png → /Users/john/animated-logo.tsx
```

## 🔐 Security

- **API Key Protection**: Your API key is securely transmitted to the Allyson service
- **Local File Access**: Only reads files you explicitly specify
- **No Data Storage**: Files are processed and not stored on external servers
- **HTTPS Communication**: All API communications use secure HTTPS

## 🐛 Troubleshooting

### Common Issues

**"API key is required" Error**
```bash
# Solution: Provide API key via flag or environment variable
allyson-mcp --api-key YOUR_KEY
# or
export API_KEY=YOUR_KEY && allyson-mcp
```

**"File not found" Error**
```bash
# Make sure to use absolute paths
❌ Wrong: ./image.svg
✅ Correct: /Users/username/project/image.svg
```

**"Cannot connect to animation API server" Error**
- Check your internet connection
- Verify your API key is valid
- Ensure the Allyson service is accessible

**Permission Issues**
```bash
# Make the file executable if needed
chmod +x node_modules/allyson-mcp/index.js
```

### Debug Mode

For debugging, you can check the server logs which are output to stderr:

```bash
allyson-mcp --api-key YOUR_KEY 2> debug.log
```

## 📋 Requirements

- **Node.js**: Version 18.0.0 or higher
- **API Key**: Valid Allyson API key
- **Internet Connection**: Required for API communication

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for more details.

## 📄 License

Apache-2.0 License - see LICENSE file for details.

## 🔗 Links

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Allyson Website](https://allyson.ai)
- [Issue Tracker](https://github.com/allyson/mcp/issues)

## 📞 Support

- **Documentation**: Check this README and inline help (`--help`)
- **Issues**: Report bugs on our [GitHub Issues](https://github.com/allyson/mcp/issues)
- **API Support**: Contact Allyson support for API-related questions