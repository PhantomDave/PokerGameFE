import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: any) {
    return this.request<T>('GET', url, undefined, options);
  }

  post<T>(url: string, body: any, options?: any) {
    return this.request<T>('POST', url, body, options);
  }

  put<T>(url: string, body: any, options?: any) {
    return this.request<T>('PUT', url, body, options);
  }

  delete<T>(url: string, options?: any) {
    return this.request<T>('DELETE', url, undefined, options);
  }

  patch<T>(url: string, body: any, options?: any) {
    return this.request<T>('PATCH', url, body, options);
  }

  request<T>(
    method: string,
    url: string,
    body?: any,
    options?: any,
    withCredentials?: boolean,
  ) {
    method = method.toUpperCase();

    if (method === 'GET' || method === 'DELETE') {
      if (body) {
        throw new Error('GET and DELETE requests cannot have a body');
      }
    } else {
      if (!body) {
        throw new Error('POST and PUT requests must have a body');
      }
    }

    if (!options) {
      options = {};
    }

    if (!options?.params) {
      options.params = {};
    }

    withCredentials = false;

    let header = new HttpHeaders();
    header = header.set('Content-Type', 'application/json');

    options.headers = header;
    options.body = body;

    options.observe = 'body';
    return this.http.request<T>(method, url, options).pipe(
      catchError((err) => {
        if (err.status === 401) {
          localStorage.removeItem('token');
        }
        return throwError(() => err);
      }),
    ) as Observable<T>;
  }
}
