import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private apiUrl = 'http://localhost:5000/';


  constructor(private http: HttpClient) {}

  getBoxInformation(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
