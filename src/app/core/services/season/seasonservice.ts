
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface SeasonData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Seasonservice {
   private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/seasons`;

  getSeasons(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getSeason(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createSeason(data: Partial<SeasonData>): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateSeason(id: number, data: Partial<SeasonData>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteSeason(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
