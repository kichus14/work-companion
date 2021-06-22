import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {LocalStorageService} from 'ngx-store';
import {MessageService} from 'primeng/api';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {USER_AUTH_STORAGE_KEY} from '../constants/localstorage.constant';
import {Path} from '../constants/routes.constant';

const BASE_URL = '/api/';
const AUTHORIZATION_EXCEPTION = 'com.atlassian.bitbucket.AuthorisationException';

export interface RequestError {
  message: string;
  exceptionName: string;
  context: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private readonly http: HttpClient,
    private readonly localStorage: LocalStorageService,
    private readonly router: Router,
    private readonly messageService: MessageService,
  ) { }

  get(path: string): Observable<any> {
    const auth = this.localStorage.get(USER_AUTH_STORAGE_KEY);
    if (auth == null) {
      this.router.navigate([Path.login]);
    }
    const headers = new HttpHeaders({
      authorization: `Basic ${auth}`,
    });
    const url = [
      BASE_URL,
      path,
    ].join('');
    return this.http.get(url, {headers}).pipe(
      catchError(({error}: any) => {
        const responseError: RequestError = error.errors != null && error.errors.length > 0 ? error.errors[0] : {
          message: error
        };
        if (responseError.exceptionName === AUTHORIZATION_EXCEPTION) {
          this.localStorage.remove(USER_AUTH_STORAGE_KEY);
        }
        this.messageService.add({severity: 'error', summary: 'Error', detail: responseError.message});
        return throwError(responseError);
      }),
    );
  }

  getTest(path: string): Observable<any> {
    return this.http.get(path);
  }
}
