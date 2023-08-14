import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as weatherModule from './utils/weather'; // Import the module
import WeatherWidget from './WeatherWidget';

const mockWeatherData = {
  main: { temp: 20.9, humidity: 57 },
  wind: { speed: 4.12, deg: "South-Southwest" },
  name: "Hobro",
};

jest.mock("./utils/weather", () => ({
  fetchAndPrepareWeatherData: jest.fn(),
}));

describe("WeatherWidget", () => {
  beforeEach(() => {
    fetchAndPrepareWeatherDataSpy.mockClear();
  });

  const fetchAndPrepareWeatherDataSpy = jest.spyOn(
    weatherModule,
    "fetchAndPrepareWeatherData"
  );

  it("displays weather data for a Hobro city", async () => {
    fetchAndPrepareWeatherDataSpy.mockResolvedValue(mockWeatherData);

    render(<WeatherWidget />);

    // First render defaults to Copenhagen
    expect(fetchAndPrepareWeatherDataSpy).toHaveBeenCalledWith("Copenhagen");

    const input = screen.getByPlaceholderText("City");
    const submitButton = screen.getByText("Search");

    act(() => {
      userEvent.type(input, "Hobro");
      userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("Hobro")).toBeInTheDocument;
      expect(screen.getByText("20.9°C")).toBeInTheDocument;
      expect(screen.getByText("57")).toBeInTheDocument;
      expect(screen.getByText("4.12 m/s South-Southwest")).toBeInTheDocument;
    });
  });

  it("displays an error message for invalid input", async () => {
    fetchAndPrepareWeatherDataSpy.mockRejectedValue(null);
    render(<WeatherWidget />);

    const input = screen.getByPlaceholderText("City");
    const submitButton = screen.getByText("Search");

    act(() => {
      userEvent.type(input, "Oslo");
      userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("City not found")).toBeInTheDocument;
    });
  });

  it("displays an error message for too few characters", async () => {
    fetchAndPrepareWeatherDataSpy.mockResolvedValue(mockWeatherData);

    render(<WeatherWidget />);

    const input = screen.getByPlaceholderText("City");
    const submitButton = screen.getByText("Search");

    act(() => {
      userEvent.type(input, "A");
      userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText("City not found")).toBeInTheDocument;
    });
  });
});
