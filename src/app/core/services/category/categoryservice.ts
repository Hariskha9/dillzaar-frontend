
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryPayload {
  name: string;
  slug?: string;
  description?: string;
    image: string;
  is_active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {}

  // Get all categories with pagination
  getCategories(page: number = 1, perPage: number = 15): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Get active categories (public)
  getActiveCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/active`);
  }

  // Get single category
  getCategory(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Create category
  createCategory(data: CategoryPayload): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  // Update category
  updateCategory(id: number, data: CategoryPayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  // Delete category
  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
