import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'super-admin' | 'admin' | 'employee' | 'client';
}

interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = environment.apiUrl + '/auth';

  private userSubject = new BehaviorSubject<User | null>(null);

  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get token
  getToken(): string | null {
    return localStorage.getItem('dillzaar_token');
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  // Check login
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Login
  login(data: {
    email: string;
    password: string;
  }): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    ).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(
            'dillzaar_token',
            response.token
          );

          this.userSubject.next(response.user);
        }
      })
    );
  }

  // Register Client
  register(data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    password_confirmation: string;
  }): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      data
    ).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem(
            'dillzaar_token',
            response.token
          );

          this.userSubject.next(response.user);
        }
      })
    );
  }

  // Get logged-in user from Laravel
  me(): Observable<User> {

    return this.http.get<{success: boolean; user: User}>(
      `${this.apiUrl}/me`
    ).pipe(
      map(response => response.user),
      tap(user => this.userSubject.next(user))
    );
  }

  // Restore user after browser refresh
  ensureUser(): Observable<boolean> {

    if (this.userSubject.value) {
      return of(true);
    }

    if (!this.getToken()) {
      return of(false);
    }

    return this.me().pipe(
      map(() => true),
      catchError(() => {
        this.clearAuth();
        return of(false);
      })
    );
  }

  // Update Profile
  updateProfile(data: Partial<User>): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/update-profile`,
      data
    ).pipe(
      tap((response: any) => {
        if (response.user) {
          this.userSubject.next(response.user);
        }
      })
    );
  }

  // Logout
  logout(): Observable<any> {

    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      finalize(() => this.clearAuth())
    );
  }

  // Clear authentication
  clearAuth(): void {
    localStorage.removeItem('dillzaar_token');
    this.userSubject.next(null);
  }

  // Redirect according to role
  getDashboardUrl(role: string): string {

    switch (role) {

      case 'super_admin':
        return '/panel/';

      case 'admin':
        return '/panel/dashboard';

      case 'employee':
        return '/panel/dashboard';

      case 'client':
        return '/panel/dashboard';

      default:
        return '/login';
    }
  }
}
