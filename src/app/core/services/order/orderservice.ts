import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Orderservice {

  private http = inject(HttpClient);

  private apiUrl = environment.apiUrl;

  createOrder(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, data);
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders`);
  }

  getOrder(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/${id}`);
  }

    getAdminOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/orders`);
  }

  getAdminOrder(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/orders/${id}`);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/admin/orders/${id}/status`,
      { status }
    );
  }


sendOrderConfirmation(id: number): Observable<any> {
  return this.http.post(
    `${this.apiUrl}/admin/orders/${id}/send-confirmation`,
    {}
  );
}

}
