import {Injectable} from '@angular/core';
import {LocalStorageService} from 'ngx-store';
import {Observable} from 'rxjs';
import {USER_AUTH_STORAGE_KEY, USER_DETAIL_STORAGE_KEY} from '../constants/localstorage.constant';
import {UserDetail, UserDetailInput} from '../interfaces/user.interface';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private readonly localStorage: LocalStorageService,
    private readonly apiService: ApiService,
  ) { }

  public getUser(): UserDetail {
    return this.localStorage.get(USER_DETAIL_STORAGE_KEY);
  }

  login(user: UserDetailInput): Observable<UserDetail> {
    this.removeUser();
    const basicToken = window.btoa(`${user.username}:${user.password}`);
    this.localStorage.set(USER_AUTH_STORAGE_KEY, basicToken);
    return this.apiService.get(`users/${user.username}`);
  }

  public setUser(user: UserDetail): void {
    this.localStorage.set(USER_DETAIL_STORAGE_KEY, user);
  }

  public removeUser(): void {
    this.localStorage.remove(USER_DETAIL_STORAGE_KEY);
  }
}
