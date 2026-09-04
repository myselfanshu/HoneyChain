import { WeatherData } from './types';

export const weather: WeatherData = {
  current: {
    timestamp: '2026-09-04T14:33:22Z',
    temperature: 28,
    humidity: 46,
    windSpeed: 12,
    rainProbability: 0,
    condition: 'Clear'
  },
  forecast: [
    {
      timestamp: '2026-09-05T12:00:00Z',
      temperature: 29,
      humidity: 45,
      windSpeed: 10,
      rainProbability: 5,
      condition: 'Sunny'
    },
    {
      timestamp: '2026-09-06T12:00:00Z',
      temperature: 27,
      humidity: 50,
      windSpeed: 14,
      rainProbability: 15,
      condition: 'Partly Cloudy'
    },
    {
      timestamp: '2026-09-07T12:00:00Z',
      temperature: 26,
      humidity: 60,
      windSpeed: 8,
      rainProbability: 40,
      condition: 'Light Rain'
    }
  ],
  summary: 'Favorable for foraging'
};
