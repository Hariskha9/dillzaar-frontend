import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TypeData } from '../type/typeservice';
import { FabricData } from '../fabric/fabricservice';
import { CollectionData } from '../collection/collectionservice';
import { SeasonData } from '../season/seasonservice';
import { ProductFilterStatedata } from '../../../Pages/shared-compnent/product-filter-state/product-filter-state';

export interface Productdata {
  id?: number;
  name: string;
  slug?: string;
  sku: string;
  description?: string;
  category_id?: number | null;
  regular_price: number;
  sale_price?: number | null;
  stock_quantity: number;
  featured_image?: string | null;
  gallery_images?: string[];
  is_active: boolean;
  category?: any;
  type_id?: number | null;
fabric_id?: number | null;
collection_id?: number | null;
season_id?: number | null;
short_description?: string | null;

type?: TypeData | null;
fabric?: FabricData | null;
collection?: CollectionData | null;
season?: SeasonData | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}


export interface ProductFilters {
  category: string;
  fabric: string;
  max_price: number;
  sort: string;
  page: number;
  per_page: number;
}


@Injectable({
  providedIn: 'root',
})
export class Product {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/admin/products`;

  // Get all products
getProducts(page: number = 1, perPage: number = 15): Observable<any> {
  const params = new HttpParams()
    .set('page', page)
    .set('per_page', perPage);

  return this.http.get<any>(this.apiUrl, { params });
}

  // Get single product by ID (Admin)
  getProduct(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<Product>>(
      `${this.apiUrl}/${id}`
    );
  }

  // Get single product by slug (Public)
  getProductBySlug(slug: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<Product>>(
      `${environment.apiUrl}/store/products/${slug}`
    );
  }

  // Get active products (Public)
  // getPublicProducts(page: number = 1): Observable<any> {
  //   const params = new HttpParams()
  //     .set('page', page);

  //   return this.http.get<any>(
  //     `${environment.apiUrl}/store/products`,
  //     { params }
  //   );
  // }

  getPublicProducts(
  page: number = 1,
  filters?: ProductFilterStatedata
) {
  let params = new HttpParams()
    .set('page', page)
    .set('per_page', 16);

  if (filters) {
    params = params
      .set('category', filters.category)
      .set('type', filters.type)
      .set('fabric', filters.fabric)
      .set('collection', filters.collection)
      .set('season', filters.season)
      .set('max_price', filters.maxPrice);
  }

  return this.http.get<any>(
    `${environment.apiUrl}/store/products`,
    { params }
  );
}

  // Create product
  createProduct(formData: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(
      this.apiUrl,
      formData
    );
  }

  // Update product
  updateProduct(
    id: number,
    formData: FormData
  ): Observable<ApiResponse<Product>> {

    return this.http.post<ApiResponse<Product>>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  // Delete product
  deleteProduct(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(
      `${this.apiUrl}/${id}`
    );
  }


  getPublicProductsfilter(filters: ProductFilters) {
  let params = new HttpParams()
    .set('page', filters.page)
    .set('per_page', filters.per_page)
    .set('sort', filters.sort);

  if (filters.category !== 'all') {
    params = params.set('category', filters.category);
  }

  if (filters.fabric !== 'all') {
    params = params.set('fabric', filters.fabric);
  }

  params = params.set('max_price', filters.max_price);

  return this.http.get<any>(
    `${environment.apiUrl}/admin/products`,
    { params }
  );
}

}
