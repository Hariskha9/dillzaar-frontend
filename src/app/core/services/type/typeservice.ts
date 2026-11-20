
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TypeData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Typeservice {
   private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/types`;

  getTypes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getType(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createType(data: Partial<TypeData>): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateType(id: number, data: Partial<TypeData>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteType(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
