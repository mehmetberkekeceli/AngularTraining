import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApplicationUserCreate } from '../models/account/application-user-create.model';
import { ApplicationUserLogin } from '../models/account/application-user-login.model';
import { ApplicationUser } from '../models/account/application-user.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
    private currentUserSubject$: BehaviorSubject<ApplicationUser | null>;
  
    constructor(private http: HttpClient) {
      const currentUser = localStorage.getItem('blogLab-currentUser');
      const currentUserObject = currentUser ? JSON.parse(currentUser) : null;
      this.currentUserSubject$ = new BehaviorSubject<ApplicationUser | null>(currentUserObject);
    }

  login(model: ApplicationUserLogin): Observable<ApplicationUser> {
    return this.http
      .post<ApplicationUser>(`${environment.webApi}/Account/login`, model)
      .pipe(
        map((user: ApplicationUser) => {
          if (user) {
            localStorage.setItem('blogLab-currentUser', JSON.stringify(user));
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  register(model: ApplicationUserCreate): Observable<ApplicationUser> {
    return this.http
      .post<ApplicationUser>(`${environment.webApi}/Account/register`, model)
      .pipe(
        map((user: ApplicationUser) => {
          if (user) {
            localStorage.setItem('blogLab-currentUser', JSON.stringify(user));
            this.setCurrentUser(user);
          }
          return user;
        })
      );
  }

  setCurrentUser(user: ApplicationUser | null) {
    this.currentUserSubject$.next(user);
  }

  public get currentUserValue(): ApplicationUser | null {
    return this.currentUserSubject$.value;
  }

  public givenUserIsLoggedIn(username: string): boolean | null {
    if (this.isLoggedIn() && this.currentUserValue) {
      return this.currentUserValue.username === username;
    }
    return null;
  }

  public isLoggedIn(): boolean {
    const currentUser = this.currentUserValue;
    const isLoggedIn = !!currentUser && !!currentUser.token;
    return isLoggedIn;
  }

  logout() {
    localStorage.removeItem('blogLab-currentUser');
    this.currentUserSubject$.next(null);
  }
}
