import axios from "axios";

export const getWeatherByCityName = (apiKey: string) => async (
  input: string
): Promise<CurrentWeatherModel> =>
  (await axios.get<CurrentWeatherModel>(
    `https://api.openweathermap.org/data/2.5/weather?q=${input}&APPID=${apiKey}`
  )).data;

type WeatherCondition = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

type CurrentWeatherModel = {
  id: number; // City ID
  name: string; // City Name
  cod: number; // internal parameter
  dt: number; // timestamp
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string; // internal parameter
  main: {
    temp: number; // In Kelvin
    pressure: number; // hPa
    humidity: number; // %
    sea_level: number; // hPa
    grnd_level: number; // hPa
    temp_min: number; // In Kelvin This is deviation from current temp that is possible for large cities and megalopolises geographically expanded
    temp_max: number; // In Kelvin This is deviation from current temp that is possible for large cities and megalopolises geographically expanded
  };
  wind: {
    speed: number; // meters/sec
    deg: number; // direction in meteorological degrees
  };
  clouds: {
    all: number; // Cloudcover 0-100%
  };
  rain: {
    "1h": number; // Rainfall in mm
    "3h": number; // Rainfall in mm
  };
  snow: {
    "1h": number; // Snowfall in mm
    "3h": number; // Snowfall in mm
  };
  sys: {
    type: number; // Internal Parameter
    id: number; // Internal Parameter
    message: number; // Internal Parameter
    country: string; // Country Code
    sunrise: number; //timestamp
    sunset: number; //timestamp
  };
};
