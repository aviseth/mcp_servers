import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import axios from "axios";
import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const server = new McpServer({
  name: "Real Weather Server",
  version: "1.0.0"
});

// Define the 'getWeather' tool
server.tool(
    "getWeather",
    {
        zip_code: z.string(),
        country_code: z.string().optional().default("US"),
    },
    async ({ zip_code, country_code }) => {
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: OPENWEATHER_API_KEY not found in .env file",
                    },
                ],
            };
        }

        const baseUrl = "http://api.openweathermap.org/data/2.5/weather";
        const params = {
            zip: `${zip_code},${country_code}`,
            appid: apiKey,
            units: "imperial", // Use Fahrenheit
        };

        try {
            const response = await axios.get(baseUrl, { params });
            const data = response.data as {
                main: { temp: number };
                weather: { description: string }[];
            };

            if (response.status === 200) {
                const temp = data.main.temp;
                const description = data.weather[0].description;
                return {
                    content: [
                        {
                            type: "text",
                            text: `The current temperature is ${temp}°F with ${description}`,
                        },
                    ],
                };
            } else {
                return {
                    content: [
                        {
                            type: "text",
                            text: `Error: ${response.statusText || "Unknown error"}`,
                        },
                    ],
                };
            }
        } catch (error) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Error fetching weather: ${error instanceof Error ? error.message : "Unknown error"}`,
                    },
                ],
            };
        }
    }
);

const app = express();

// to support multiple simultaneous connections we have a lookup object from
// sessionId to transport
const transports: {[sessionId: string]: SSEServerTransport} = {};

app.get("/sse", async (_: Request, res: Response) => {
  const transport = new SSEServerTransport('/messages', res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req: Request, res: Response) => {
  const sessionId = req.query.sessionId as string;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send('No transport found for sessionId');
  }
});

app.listen(3001);