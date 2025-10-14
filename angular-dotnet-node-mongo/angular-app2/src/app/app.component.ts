import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  data: any;   // holds the response
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Optionally, you can fetch something by default
  }

  // Fetch data based on type: 'students' or 'weather'
  fetchData(type: string) {
    this.loading = true;
    this.data = null;

    let url = '';
    if (type === 'students') {
      url = 'http://localhost:4000/students'; // Node.js
    } else if (type === 'weather') {
      url = 'http://localhost:5258/weatherforecast'; // .NET
    }

    this.http.get(url).subscribe(
      res => {
        this.data = res;
        this.loading = false;
      },
      err => {
        console.error(err);
        this.data = { error: 'Failed to fetch data' };
        this.loading = false;
      }
    );
  }
}
