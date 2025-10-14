import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Weather {
  date: string;
  temperatureC: number;
  summary: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiUrl = 'http://localhost:5258/weatherforecast';  // Backend URL

  constructor(private http: HttpClient) { }

  getWeather(): Observable<Weather[]> {
    return this.http.get<Weather[]>(this.apiUrl);
  }
}

