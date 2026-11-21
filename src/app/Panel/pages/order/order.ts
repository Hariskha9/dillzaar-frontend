
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Orderservice } from '../../../core/services/order/orderservice';
import { Router } from '@angular/router';

interface Orderdata {
  id: number;
  order_number: string;
  customer_name: string;
  email: string;
  phone: string;
  total: number;
  status: string;
  created_at: string;
  items?: any[];
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order implements OnInit {

  private orderService = inject(Orderservice);

  orders: Orderdata[] = [];

  loading = false;
  errorMessage = '';
  searchTerm = '';

  statusOptions = [
    'pending',
    'processing',
    'shipped',
    'completed',
    'cancelled'
  ];

  constructor(private cdr:ChangeDetectorRef){}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.errorMessage = '';

    this.orderService.getAdminOrders().subscribe({
      next: (response: any) => {
        this.orders = response.data || [];
        this.loading = false;
this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to load orders.';
        this.loading = false;
      }
    });
  }

  updateStatus(order: Orderdata, event: Event): void {
    const status = (event.target as HTMLSelectElement).value;

    this.orderService.updateOrderStatus(order.id, status).subscribe({
      next: () => {
        order.status = status;
      },
      error: (error) => {
        console.error(error);
        alert('Unable to update order status.');
        this.loadOrders();
      }
    });
  }

  get filteredOrders(): Orderdata[] {
    const term = this.searchTerm.toLowerCase().trim();

    if (!term) return this.orders;

    return this.orders.filter(order =>
      order.order_number?.toLowerCase().includes(term) ||
      order.customer_name?.toLowerCase().includes(term) ||
      order.email?.toLowerCase().includes(term) ||
      order.phone?.toLowerCase().includes(term)
    );
  }

  formatPrice(price: number): string {
    return 'PKR ' + Number(price || 0).toLocaleString('en-PK');
  }

  // onView(order: Orderdata): void {
  //   console.log('View order:', order);

  //   // We can connect this to an order detail page.
  // }

  private router = inject(Router);

onView(order: any): void {
  this.router.navigate(['/panel/orders', order.id]);
}
}
