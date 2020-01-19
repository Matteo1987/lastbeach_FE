import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CurrentWeather, ForecastWeather} from '../models/Meteo';

@Injectable()

export class WeatherService {
  private baseUrl = 'https://api.weatherbit.io/v2.0';
  private apiKey = '4bac35b6ae394eef916d583250a87c1e';

  constructor(
    private http: HttpClient
  ) {
  }

  getCurrent = (city: string, latitude?: number, longitude?: number) =>
    this.http.get<CurrentWeather>(`${this.baseUrl}/current`, {params: this.getParams(city, latitude, longitude)});

  getForecast = (city: string, latitude?: number, longitude?: number) =>
    this.http.get<ForecastWeather>(`${this.baseUrl}/forecast/daily`, {params: this.getParams(city, latitude, longitude)});

  private getParams = (city: string, latitude?: number, longitude?: number) => {
    const params: any = {city: city, key: this.apiKey};

    if (latitude && longitude) {
      params.lat = latitude;
      params.lon = longitude;
    }

    return params;
  };

}
