
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface FabricData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Fabricservice {
   private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/fabrics`;

  getFabrics(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getFabric(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createFabric(data: Partial<FabricData>): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateFabric(id: number, data: Partial<FabricData>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteFabric(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
