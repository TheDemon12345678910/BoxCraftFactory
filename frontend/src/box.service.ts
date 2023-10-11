import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoxService {
  private apiUrl = 'http://localhost:5000/';


  constructor(private http: HttpClient) {}

  getBoxInformation(): Observable<BoxInformation> {
    return this.http.get<BoxInformation>(this.apiUrl);
  }
}

export interface BoxInformation {
  title: string;
  height: number;
  length: number;
  width: number;
  price: number;
  type: string;
  imageUrl: string;
}
