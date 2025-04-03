from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp import Context

# Initialize the MCP server
mcp = FastMCP("Weather Server")

# Define the 'get_weather' tool
@mcp.tool()
async def get_weather(ctx: Context) -> str:
    """Returns a weather message."""
    return "the weather is cool"

# Start the server
if __name__ == "__main__":
    mcp.run()