import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { environment, backend } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private backend = backend.config.url;
  private spotifyURL = environment.config.spotifyURL;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };

  constructor(private httpClient: HttpClient) { }

  backendGet(endpoint: string) {
    return this.httpClient.get(this.backend + endpoint)
      .pipe(
        catchError(this.handleError)
      );
  }

  sendGet(endpoint: string, token: string) {
    return this.httpClient.get(this.spotifyURL + endpoint, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  sendPost(endpoint: string, token: string, body) {
    return this.httpClient.post(this.spotifyURL + endpoint, body, {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let userMessage;
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      const spotifyError = error.error.error;
      if (spotifyError.message.toLowerCase() === 'the access token expired') {
        userMessage = 'Your token has expired, please return to the login page';
      } else {
        console.error(
          `Backend returned code ${error.status}, ` +
          `body was: ${error.error}`);
      }
    }
    return throwError(userMessage);
  }


}
