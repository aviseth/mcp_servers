import { createServer } from '@modelcontextprotocol/sdk';
// Define the tool that returns "the weather is cool"
const weatherTool = {
    name: 'getWeather',
    description: 'Returns a weather message.',
    parameters: {},
    execute: async () => {
        return { result: 'the weather is cool' };
    },
};
// Create the MCP server with the defined tool
const server = createServer({
    tools: [weatherTool],
});
// Start the server on port 3000
server.listen(3000, () => {
    console.log('MCP server is running on port 3000');
});
