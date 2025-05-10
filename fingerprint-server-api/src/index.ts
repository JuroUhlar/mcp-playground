import { Region } from "@fingerprintjs/fingerprintjs-pro-server-api";
import { FingerprintJsServerApiClient } from "@fingerprintjs/fingerprintjs-pro-server-api";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
  name: "fp-server-api",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

const apiKey = process.env.FINGERPRINT_SERVER_API_KEY;
if (!apiKey) {
  throw new Error("FINGERPRINT_SERVER_API_KEY is not set");
}

const regionString = process.env.FINGERPRINT_SERVER_API_REGION;
let region: Region;
if (regionString === "eu") {
  region = Region.EU;
} else if (regionString === "ap") {
  region = Region.AP;
} else {
  region = Region.Global;
}

// Register tools based on the schema
server.tool(
  "get-fingerprint-event",
  "Get data about a single Fingerprint identification event using its request ID",
  {
    requestId: z.string().describe("Request ID of the event to get data for"),
  },
  async ({ requestId }) => {
    const client = new FingerprintJsServerApiClient({
      apiKey,
      region,
    });

    try {
      const response = await client.getEvent(requestId);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(response),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve event data: ${error}`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Fingerprint Server API MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
