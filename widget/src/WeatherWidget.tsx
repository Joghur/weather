import './widget.css';

import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { fetchAndPrepareWeatherData, WeatherSchemaType } from './utils/weather';

const CitySchema = z.object({
  city: z.string().min(2).max(20),
});

type CitySchemaType = z.infer<typeof CitySchema>;

const WeatherWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherSchemaType | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue, // Add the setValue function from useForm
    formState: { errors },
  } = useForm<CitySchemaType>({ resolver: zodResolver(CitySchema) });

  const defaultCity = 'Copenhagen'; // Define the default city

  const urlParams = new URLSearchParams(window.location.search);
  const initialCity = urlParams.get('city') || defaultCity;

  const [city, setCity] = useState(initialCity);

  useEffect(() => {
    fetchAndPrepareWeatherData(city)
      .then((weatherData) => {
        setWeatherData(() => weatherData);
      })
      .catch((error) => {
        console.log("Error fetching weather data:", error);
      });
  }, [city]);

  const onSubmit: SubmitHandler<CitySchemaType> = (data) => setCity(data.city);

  useEffect(() => {
    setValue('city', city); // Update the input value when the city changes
  }, [city, setValue]);
  
  return (
    <div className="widget mx-4 my-4 w-72">
      <div className="panel border rounded-lg overflow-hidden">
        <div className="panel-heading bg-blue-500 text-white">
          <span className="m-2">
            Weather in{" "}
            <b>{weatherData ? weatherData.name : "City not found"}</b>
          </span>
        </div>
        <ul className="list-group">
          <li className="list-group-item m-2">
            Temperature:{" "}
            <b>{weatherData?.main.temp ? `${weatherData.main.temp}°C` : ""}</b>
          </li>
          <div className="border-t border-gray-300"></div>
          <li className="list-group-item m-2">
            Humidity:{" "}
            <b>{weatherData?.main.humidity ? weatherData.main.humidity : ""}</b>
          </li>
          <div className="border-t border-gray-300"></div>
          <li className="list-group-item m-2">
            Wind:{" "}
            <b>{`${
              weatherData?.wind.speed ? `${weatherData.wind.speed} m/s` : ""
            } ${weatherData?.wind.deg ? weatherData.wind.deg : ""}`}</b>
          </li>
          <div className="border-t border-gray-300"></div>
          <li className="list-group-item m-2">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-row">
                <input
                  className="w-full px-4 py-2 mr-1 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="City"
                  {...register("city")}
                />
                <button
                  type="submit"
                  className="btn px-3 py-2 rounded-lg border">
                  Search
                </button>
              </div>
              {errors.city && <span>{errors.city.message}</span>}
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WeatherWidget;

// {"main":{"temp":20.9,"humidity":57},"wind":{"speed":4.12,"deg":"South-Southwest"},"name":"Hobro"}