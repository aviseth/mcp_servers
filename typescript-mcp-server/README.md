# TypeScript MCP Weather Server

This project implements a Model Context Protocol (MCP) server using the TypeScript SDK. The server provides a tool to fetch current weather data based on a given zip code and country code.

## Project Structure

```
typescript-mcp-server
├── src
│   ├── server.ts          # Entry point of the MCP server
│   └── types
│       └── index.ts      # Type definitions and interfaces
├── package.json           # NPM configuration file
├── tsconfig.json          # TypeScript configuration file
├── .env                   # Environment variables
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd typescript-mcp-server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file:**
   Add your OpenWeather API key to the `.env` file:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

4. **Compile TypeScript files:**
   ```bash
   npx tsc
   ```

5. **Run the server:**
   ```bash
   node dist/server.js
   ```

## Usage

Once the server is running, you can use the `getWeather` tool by sending a request with the required parameters (zip code and optional country code). The server will respond with the current weather information.

## Example Request

```json
{
  "zip_code": "90210",
  "country_code": "US"
}
```

## License

This project is licensed under the MIT License.