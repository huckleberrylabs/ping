import axios from "axios";
import { Config } from "../../config";
import { CurrentWeatherModel } from "./models";

export class WeatherService {
  private apiKey: string;
  constructor(config: Config) {
    this.apiKey = config.weather.apiKey;
  }
  async getByCityName(cityName: string): Promise<CurrentWeatherModel> {
    const res = await axios.get<CurrentWeatherModel>(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=${
        this.apiKey
      }`
    );
    return res.data;
  }
}
