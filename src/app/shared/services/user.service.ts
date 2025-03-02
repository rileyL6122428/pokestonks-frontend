import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

export class User {
  constructor(public username: string) {}
}

const CURRENT_USER = new User('red');

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser$: ReplaySubject<User> = new ReplaySubject<User>(1);
  private currentUserLoaded = false;

  constructor() {}

  getCurrentUser(): Observable<User> {
    if (!this.currentUserLoaded) {
      this.currentUserLoaded = true;
      setTimeout(() => this.currentUser$.next(CURRENT_USER), 1000);
    }
    return this.currentUser$.asObservable();
  }
}
