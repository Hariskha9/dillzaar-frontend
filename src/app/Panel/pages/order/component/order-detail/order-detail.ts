
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Orderservice } from '../../../../../core/services/order/orderservice';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css'
})
export class OrderDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(Orderservice);

  order: any = null;

  loading = false;
  savingStatus = false;
  errorMessage = '';

  statusOptions = [
    'pending',
    'processing',
    'shipped',
    'completed',
    'cancelled'
  ];


  sendingEmail = false;

  constructor(private cdr:ChangeDetectorRef){}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.errorMessage = 'Invalid order ID.';
      return;
    }

    this.loadOrder(id);
  }

  loadOrder(id?: number): void {
    const orderId = id || Number(this.route.snapshot.paramMap.get('id'));

    this.loading = true;
    this.errorMessage = '';

    this.orderService.getAdminOrder(orderId).subscribe({
      next: (response: any) => {
        this.order = response.order || response.data || response;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Order loading error:', error);
        this.errorMessage =
          error.error?.message || 'Unable to load order details.';
        this.loading = false;
      }
    });
  }

  updateStatus(): void {
    if (!this.order?.id || !this.order?.status) {
      return;
    }

    this.savingStatus = true;

    this.orderService.updateOrderStatus(
      this.order.id,
      this.order.status
    ).subscribe({
      next: (response: any) => {
        this.order = response.order || {
          ...this.order,
          ...(response.data || {})
        };

        this.savingStatus = false;
        alert('Order status updated successfully.');
      },
      error: (error) => {
        console.error('Status update error:', error);

        this.savingStatus = false;
        alert(
          error.error?.message || 'Unable to update order status.'
        );

        this.loadOrder();
      }
    });
  }

  get items(): any[] {
    return this.order?.items || [];
  }

  getCustomerName(): string {
    return this.order?.customer_name ||
      this.order?.user?.name ||
      'Guest Customer';
  }

  getProductName(item: any): string {
    return item?.product_name ||
      item?.product?.name ||
      'Product';
  }

  getProductImage(item: any): string {
    const image =
      item?.product?.featured_image ||
      item?.featured_image ||
      item?.product_image;

    if (!image) {
      return 'assets/images/product-placeholder.png';
    }

    if (
      image.startsWith('http://') ||
      image.startsWith('https://') ||
      image.startsWith('data:')
    ) {
      return image;
    }

    // Change this prefix if your product images use a different URL.
    return `https://khanibykhanam.pk/storage/${image.replace(/^\/+/, '')}`;
  }

  formatPrice(price: any): string {
    return 'PKR ' + Number(price || 0).toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
      processing: 'bg-blue-900/30 text-blue-400 border-blue-800',
      shipped: 'bg-purple-900/30 text-purple-400 border-purple-800',
      completed: 'bg-green-900/30 text-green-400 border-green-800',
      cancelled: 'bg-red-900/30 text-red-400 border-red-800'
    };

    return classes[status?.toLowerCase()] ||
      'bg-gray-800 text-gray-300 border-gray-700';
  }

  printOrder(): void {
    window.print();
  }

  goBack(): void {
    this.router.navigate(['/admin/orders']);
  }

  downloadInvoice(): void {
  window.print();
}

resendOrderEmail(): void {
  if (!this.order?.id || this.sendingEmail) {
    return;
  }

  this.sendingEmail = true;

  this.orderService.sendOrderConfirmation(this.order.id).subscribe({
    next: (response: any) => {
      this.sendingEmail = false;
      alert(response.message || 'Order emails sent successfully.');
            this.cdr.detectChanges();

    },
    error: (error) => {
      console.error('Email sending error:', error);
      this.sendingEmail = false;
      this.cdr.detectChanges();

      alert(
        error.error?.message || 'Unable to send order confirmation emails.'
      );
    }
  });
}

}
