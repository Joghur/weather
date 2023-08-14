import fetch from 'node-fetch';
import { number, object, string, union, z } from 'zod';

import { API_KEY, WEATHER_API_URL } from '../server.js';
import { directions } from './compassTerms.js';

// Defining zod schema for validating and infering type for needed properties
export const weatherSchema = object({
  main: object({
    temp: number(),
    humidity: number(),
  }),
  wind: object({
    speed: number(),
    deg: union([number(), string()]),
  }),
  name: string(),
});

export type WeatherSchemaType = z.infer<typeof weatherSchema>;

export const windDirectionToText = (degrees: number): string => {
  const compassDegrees = degrees % 360; // making sure degrees are between 0 and 359
  const directionsDegreePart = 360 / directions.length;
  const directionsIndex = Math.round(compassDegrees / directionsDegreePart);
  return directions[directionsIndex];
};

export const kelvinToCelsius = (kelvinTemp: number): number => {
  const celsius = kelvinTemp - 273.15;
  return Number(celsius.toFixed(1));
};

export const fetchAndPrepareWeatherData = async (city: string) => {
  try {
    const response = await fetch(
      `${WEATHER_API_URL}?q=${city},dk&appid=${API_KEY}`
    );
    const data = await response.json();

    // Evaluating data from endpoint using Zod
    const validatedData = weatherSchema.parse(data);

    // Convert degree property to text
    if (typeof validatedData.wind.deg === "number") {
      validatedData.wind.deg = windDirectionToText(validatedData.wind.deg);
    }

    validatedData.main.temp = kelvinToCelsius(validatedData.main.temp);

    return validatedData;
  } catch (error) {
    // There can be several error types - eg. ZodError or response error from weather API
    // This should be handled by a log server, but is beyond scope of this assignment
    return null;
  }
};
