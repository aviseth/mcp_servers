from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp import Context
import requests
import os
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the MCP server
mcp = FastMCP("Real Weather Server")

# Define the 'get_weather' tool
@mcp.tool()
async def get_weather(ctx: Context, zip_code: str, country_code: str = "US") -> str:
    """
    Returns the current weather for a given zip code.
    
    Args:
        zip_code: The zip code to get weather for
        country_code: The country code (default: US)
    """
    # Get API key from environment variable
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key:
        return "Error: OPENWEATHER_API_KEY not found in .env file"
    
    # Construct the API URL
    base_url = "http://api.openweathermap.org/data/2.5/weather"
    params = {
        "zip": f"{zip_code},{country_code}",
        "appid": api_key,
        "units": "imperial"  # Use Fahrenheit
    }
    
    try:
        response = requests.get(base_url, params=params)
        data = response.json()
        
        if response.status_code == 200:
            temp = data["main"]["temp"]
            description = data["weather"][0]["description"]
            return f"The current temperature is {temp}°F with {description}"
        else:
            return f"Error: {data.get('message', 'Unknown error')}"
            
    except Exception as e:
        return f"Error fetching weather: {str(e)}"

# Start the server
if __name__ == "__main__":
    mcp.run() 