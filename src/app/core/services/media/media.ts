import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Media {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  alt: string | null;
  folder: string | null;
  tags: string[];
  url: string;
  created_at?: string;
}

export interface MediaResponse {
  success: boolean;
  message?: string;
  data: Media;
}

@Injectable({
  providedIn: 'root',
})
export class Media {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/admin/media`;

  // Get all media with search, folder, tag and pagination
  getMedia(
    page: number = 1,
    search: string = '',
    folder: string = '',
    tag: string = '',
    perPage: number = 20
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page)
      .set('per_page', perPage);

    if (search) {
      params = params.set('search', search);
    }

    if (folder) {
      params = params.set('folder', folder);
    }

    if (tag) {
      params = params.set('tag', tag);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  // Get single media
  getMediaById(id: number): Observable<MediaResponse> {
    return this.http.get<MediaResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  // Upload media
  uploadMedia(formData: FormData): Observable<MediaResponse> {
    return this.http.post<MediaResponse>(
      this.apiUrl,
      formData
    );
  }

  // Update media metadata or replace file
  updateMedia(
    id: number,
    formData: FormData
  ): Observable<MediaResponse> {

    return this.http.post<MediaResponse>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  // Delete media
  deleteMedia(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  // Get folders
  getFolders(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/folders`
    );
  }

  // Get tags
  getTags(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/tags`
    );
  }
}
