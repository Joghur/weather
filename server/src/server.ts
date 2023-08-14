import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

import { fetchAndPrepareWeatherData, WeatherSchemaType } from './utils/weather.js';

dotenv.config();

const app = express();

// Use Helmet middleware to add security http headers
app.use(helmet());

const PORT = process.env.PORT || 4000;
export const API_KEY = process.env.API_KEY;
export const WEATHER_API_URL = process.env.WEATHER_URL;
const CLIENT = process.env.CLIENT || "http://localhost:5173";

/**
 * Regular endpoint
 */
app.get("/weather", async (req, res) => {
  const city = (req.query.city as string) || "Copenhagen";

  const validatedData: WeatherSchemaType | null =
    await fetchAndPrepareWeatherData(city);

  if (!validatedData || !API_KEY || !WEATHER_API_URL) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching weather data." });
  } else {
    //Bypass browser CORS
    res.setHeader("Access-Control-Allow-Origin", CLIENT);
    res.json(validatedData);
  }
});

/**
 * Endpoint when JavaScript has been turned off
 */
app.get("/weather_nojs", async (req, res) => {
  const city = (req.query.city as string) || "Copenhagen";
  const protocol = req.protocol;
  const host = req.get("host");
  const completeUrl = `${protocol}://${host}`;

  const validatedData: WeatherSchemaType | null =
    await fetchAndPrepareWeatherData(city);

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
  <meta http-equiv="content-type" content="text/html; charset=utf-8">
  <title>Weather widget</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
  </head>
  <body>
    <div class="widget" style="margin: 10px; width: 300px;">
      <div class="panel panel-info">
        <div class="panel-heading">Weather in <b>${
          validatedData ? validatedData?.name : "City not found"
        }</b></div>
        <ul class="list-group">
          <li class="list-group-item">Temperature: <b>${
            validatedData?.main.temp ? validatedData.main.temp : ""
          }°C</b></li>
          <li class="list-group-item">Humidity: <b>${
            validatedData?.main.humidity ? validatedData.main.humidity : ""
          }</b></li>
          <li class="list-group-item">Wind: <b>${
            validatedData?.wind.speed ? validatedData.wind.speed : ""
          } m/s ${
    validatedData?.wind.deg ? validatedData.wind.deg : ""
  }</b></li>
          <li class="list-group-item">
            <form action="${completeUrl}/weather_nojs" method="get">
              <label for="cityInput">Enter City:</label>
              <input type="text" id="cityInput" name="city" required>
              <button type="submit">Search</button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  </body>
  </html>`;

  res.send(html);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
