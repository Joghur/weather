var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from 'node-fetch';
import { number, object, string, union } from 'zod';
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
export const windDirectionToText = (degrees) => {
    const compassDegrees = degrees % 360; // making sure degrees are between 0 and 359
    const directionsDegreePart = 360 / directions.length;
    const directionsIndex = Math.round(compassDegrees / directionsDegreePart);
    return directions[directionsIndex];
};
export const kelvinToCelsius = (kelvinTemp) => {
    const celsius = kelvinTemp - 273.15;
    return Number(celsius.toFixed(1));
};
export const fetchAndPrepareWeatherData = (city) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${WEATHER_API_URL}?q=${city},dk&appid=${API_KEY}`);
        const data = yield response.json();
        // Evaluating data from endpoint using Zod
        const validatedData = weatherSchema.parse(data);
        // Convert degree property to text
        if (typeof validatedData.wind.deg === "number") {
            validatedData.wind.deg = windDirectionToText(validatedData.wind.deg);
        }
        validatedData.main.temp = kelvinToCelsius(validatedData.main.temp);
        return validatedData;
    }
    catch (error) {
        // There can be several error types - eg. ZodError or response error from weather API
        // This should be handled by a log server, but is beyond scope of this assignment
        return null;
    }
});
