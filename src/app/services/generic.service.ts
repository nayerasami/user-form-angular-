import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  baseURL: string;

  constructor(private httpClient: HttpClient) {
    this.baseURL = 'http://localhost:7000/api/v1'
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getAll(endPoint: string): Observable<any> {

    return this.httpClient.get(`${this.baseURL}/${endPoint}`).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }
  getOne(endPoint: string): Observable<any> {
    return this.httpClient.get(`${this.baseURL}/${endPoint}`).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  create(endPoint: string, data: any): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/${endPoint}`, data).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  update(endPoint: string, updatedData: any): Observable<any> {
    return this.httpClient.put(`${this.baseURL}/${endPoint}`, updatedData).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  delete(endPoint: string): Observable<any> {
    return this.httpClient.delete(`${this.baseURL}/${endPoint}`).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  checkValidity(endPoint: any) {
    return this.httpClient.get(`${this.baseURL}/${endPoint}`).pipe(
      retry(2),
      catchError(this.handleError)
    )
  }

  // checkPhoneValidity(endPoint: any) {
  //   return this.httpClient.get(`${this.baseURL}/${endPoint}`).pipe(
  //     retry(2),
  //     catchError(this.handleError)
  //   )
  // }
  // checkNationalIDValidity(endPoint: any) {
  //   return this.httpClient.get(`${this.baseURL}/${endPoint}`).pipe(
  //     retry(2),
  //     catchError(this.handleError)
  //   )
  // }
}
