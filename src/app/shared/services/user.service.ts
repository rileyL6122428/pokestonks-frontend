import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../model/user';
import { MockApi } from '../mock/api';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private currentUser$: ReplaySubject<User> = new ReplaySubject<User>(1);
  private currentUserLoaded = false;

  constructor(private api: MockApi) {}

  getCurrentUser(): Observable<User> {
    if (!this.currentUserLoaded) {
      this.api.call({ operationName: 'getCurrentUser' }).subscribe((currentUser) => {
        this.currentUser$.next(currentUser);
      });
      this.currentUserLoaded = true;
    }
    return this.currentUser$.asObservable();
  }
}
