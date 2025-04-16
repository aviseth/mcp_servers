// This file exports types and interfaces for the MCP server implementation.

export interface WeatherRequest {
    zipCode: string;
    countryCode?: string; // Default is "US"
}

export interface WeatherResponse {
    temperature: number;
    description: string;
    error?: string;
}