
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CollectionData {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Collectionservice {
   private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/collections`;

  getCollections(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getCollection(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCollection(data: Partial<CollectionData>): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateCollection(id: number, data: Partial<CollectionData>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteCollection(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
