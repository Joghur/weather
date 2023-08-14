import { number, object, string, union, z } from 'zod';

import { WEATHER_URL } from '../settings';

/**
 * Defining zod schema for validating and infering type for needed properties
 * Note this a copy of the server's schema. This could be added to a shared library.
 */
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

export const fetchAndPrepareWeatherData = async (city: string) => {
  try {
    const response = await fetch(`${WEATHER_URL}?city=${city}`);
    const data = await response.json();

    // Evaluating data from endpoint using Zod
    const validatedData = weatherSchema.parse(data);

    return validatedData;
  } catch (error) {
    // There can be several error types - eg. ZodError or response error from weather API
    // This should be handled by a log server, but is beyond scope of this assignment
    return null;
  }
};
