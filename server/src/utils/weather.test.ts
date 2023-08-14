import fetch from 'node-fetch';

import { directions } from './compassTerms.js';
import {
    fetchAndPrepareWeatherData, kelvinToCelsius, WeatherSchemaType, windDirectionToText
} from './weather.js';

jest.mock('node-fetch');

/**
 * These tests do not work as the imports throw several errors.
 * I have not found why they do not function, but as
 * to not waste any more time, they're just presented here as is.
 */
describe('fetchAndPrepareWeatherData', () => {
  it('fetches and prepares weather data successfully', async () => {
    // Mock the response data
    const mockResponseData = {
      main: { temp: 293.15, humidity: 57 },
      wind: { speed: 4.12, deg: 225 },
      name: 'Hobro',
    };

    // Mock the fetch function
    (fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponseData),
    });

    const city = 'Hobro';
    const result = await fetchAndPrepareWeatherData(city);

    // Assert the result
    const expectedData: WeatherSchemaType = {
      main: { temp: 20.0, humidity: 57 },
      wind: { speed: 4.12, deg: 'Southwest' },
      name: 'Hobro',
    };

    expect(result).toEqual(expectedData);
  });

  it('handles error and returns null when fetch fails', async () => {
    // Mock the fetch function to throw an error
    (fetch as jest.Mock).mockRejectedValue(new Error('Fetch error'));

    const city = 'NonexistentCity';
    const result = await fetchAndPrepareWeatherData(city);

    expect(result).toBeNull();
  });
});

describe('kelvinToCelsius', () => {
  it('converts Kelvin temperature to Celsius', () => {
    const kelvinTemp = 293.15;
    const celsiusTemp = kelvinToCelsius(kelvinTemp);
    expect(celsiusTemp).toBe(20.0);
  });
});

describe('windDirectionToText', () => {
  it('converts degrees to wind direction text', () => {
    const directionsDegreePart = 360 / directions.length;
    const degrees = directionsDegreePart * 2; // Angle corresponding to the second direction term
    const directionText = windDirectionToText(degrees);
    expect(directionText).toBe(directions[1]);
  });
});
