import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {environment} from '../../environments/environment';


const base64 = window.btoa(`${environment.paduser}:${environment.padpwd}`);
const httpOptions = {
  headers: new HttpHeaders({
    Authorization: `Basic ${base64}`
  })
};

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  currentErrorMsg: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private httpClient: HttpClient) { }

  getStories(): Observable<Story[]> {
    return this.httpClient.get<Story[]>('http://localhost:4200/api/stories', httpOptions)
      .pipe(
        tap(_ => this.log('fetched stories')),
        catchError(this.handleError('', []))
      );
  }
  private log(s: string) {
    console.log(s);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.currentErrorMsg.next(error.error.message); // log to console instead

      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
export class Story {
  createdAt: string;
  title: string;
  url: string;
  points: number;
}
