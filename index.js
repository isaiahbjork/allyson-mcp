#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from 'node-fetch';
import { readFileSync, writeFileSync } from 'fs';
import { basename } from 'path';

class AllysonMCPServer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    // Use localhost for development, production domain otherwise
    this.baseUrl = process.env.NODE_ENV === 'development' 
      ? "http://localhost:3001/api" 
      : "https://allyson.ai/api";
    this.server = new Server(
      {
        name: "allyson-mcp-server",
        version: "1.0.2",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error("[MCP Error]", error);
    };

    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // Handle tool listing
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: "generate_svg_animation",
            description: "Generate an SVG animation from a source file and prompt",
            inputSchema: {
              type: "object",
              properties: {
                prompt: {
                  type: "string",
                  description: "Description of what animation to generate (e.g., 'Make the character wave their hand', 'Add bouncing motion to the ball')"
                },
                svg_path: {
                  type: "string",
                  description: "Local file path to the source file to animate, must be the absolute path (e.g., '/Users/username/image.svg')"
                },
                output_path: {
                    type: "string",
                    description: "Local file path to the output file, must be the absolute path (e.g., '/path/to/animated-svg.tsx')"
                }
              },
              required: ["prompt", "svg_path", "output_path"]
            }
          }
        ]
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "generate_svg_animation":
            return await this.handleGenerateAnimation(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        console.error(`Error executing tool ${name}:`, error);
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error.message}`
        );
      }
    });
  }

  async handleGenerateAnimation(args) {
    const { prompt, svg_path, output_path } = args;

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    if (!svg_path) {
      throw new Error("SVG file path is required");
    }

    if (!output_path) {
      throw new Error("Output file path is required");
    }

    try {
      // Read the file from the local path
      console.error(`[Allyson] Reading file from: ${svg_path}`);
      const fileBuffer = readFileSync(svg_path);
      const fileName = basename(svg_path);
      
      // Create form data for file upload
      const FormData = (await import('form-data')).default;
      const formData = new FormData();
      
      formData.append('file', fileBuffer, fileName);
      formData.append('prompt', prompt);

      const url = `${this.baseUrl}/mcp`;
      
      console.error(`[Allyson] Uploading ${fileName} with prompt: "${prompt}"`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'Allyson-MCP-Server/1.0.0',
          ...formData.getHeaders()
        },
        body: formData
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      const result = {
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
        message: "Animation file generated successfully",
        outputFile: output_path
      };

      if (!response.ok) {
        console.error(`[Allyson] Error ${response.status}:`, responseData);
        result.message = `API Error ${response.status}: ${response.statusText}`;
        result.error = responseData;
        result.data = null;
      } else {
        console.error(`[Allyson] Success! Animation generated for "${prompt}"`);
        result.message = "Animation file generated successfully";
        result.data = responseData;
        
        // Write the successful result to the output file
        try {
          writeFileSync(output_path, responseData);
        } catch (writeError) {
          console.error(`[Allyson] Failed to write output file:`, writeError);
          result.success = false;
          result.message = `Failed to write output file: ${writeError.message}`;
          result.error = writeError.message;
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(`[Allyson] Request failed:`, error);
      
      // Create error result object to return detailed error info to AI
      const errorResult = {
        status: 500,
        statusText: 'Internal Error',
        success: false,
        outputFile: output_path,
        prompt: prompt,
        sourceFile: svg_path ? basename(svg_path) : 'unknown',
        message: '',
        error: error.message,
        data: null
      };
        
      // Handle specific file errors
      if (error.code === 'ENOENT') {
        errorResult.message = `File not found: ${svg_path}`;
        errorResult.error = `The specified file path does not exist: ${svg_path}`;
      } else if (error.code === 'EACCES') {
        errorResult.message = `Permission denied accessing file: ${svg_path}`;
        errorResult.error = `No permission to read the file: ${svg_path}`;
      } else if (error.code === 'ECONNREFUSED') {
        errorResult.message = 'Cannot connect to animation API server';
        errorResult.error = `Connection refused to ${this.baseUrl}/mcp - make sure the server is running`;
      } else if (error.name === 'FetchError') {
        errorResult.message = 'Network error connecting to animation API';
        errorResult.error = error.message;
      } else {
        errorResult.message = `Animation generation failed: ${error.message}`;
        errorResult.error = error.message;
      }
      
      // Return the error result instead of throwing, so AI gets the details
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(errorResult, null, 2)
          }
        ]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Allyson MCP server running on stdio");
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    apiKey: process.env.API_KEY,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--api-key':
        config.apiKey = args[++i];
        break;
      case '--help':
        console.error(`
Allyson MCP Server - Animation Generator

Usage: node index.js [options]

Options:
  --api-key <key>     Your Allyson API key (can also use API_KEY env var)
  --help              Show this help message

Environment Variables:
  API_KEY             Your Allyson API key

Examples:
  node index.js --api-key your-api-key-here
  API_KEY=your-key node index.js

Tool Available:
  generate_animation  - Upload a file and generate an animation with a prompt
                       Requires: prompt (what to animate) and path (local file path)
        `);
        process.exit(0);
        break;
    }
  }

  return config;
}

// Start the server
const config = parseArgs();

if (!config.apiKey) {
  console.error("Error: API key is required. Use --api-key flag or API_KEY environment variable.");
  console.error("Run 'node index.js --help' for usage information.");
  process.exit(1);
}

const server = new AllysonMCPServer(config.apiKey);
server.run().catch(console.error);