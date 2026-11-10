import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Orderdata {
  id: string;
  customer: string;
  total: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-order',
  imports: [CommonModule, RouterModule],
  templateUrl: './order.html',
  styleUrl: './order.css',
})
export class Order {
  // Toggle this to `true` or populate array to see the populated order design
  // Set to `[]` to see the empty "No Results" state matching your screenshot
  orders: Orderdata[] = [
    { id: '#ZQ-8492', customer: 'Ayesha Khan', total: 'PKR 14,500', status: 'Completed', date: '2026-03-30' },
    { id: '#ZQ-8491', customer: 'Fatima Malik', total: 'PKR 28,000', status: 'Processing', date: '2026-03-29' },
    { id: '#ZQ-8490', customer: 'Zainab Ahmed', total: 'PKR 9,500', status: 'Shipped', date: '2026-03-28' },
    { id: '#ZQ-8489', customer: 'Usman Tariq', total: 'PKR 15,200', status: 'Pending', date: '2026-03-27' }
  ];

  onCreateOrder() {
    console.log('Navigate to Create Order page');
  }

  onView(order: Orderdata) {
    console.log('View order:', order);
  }

  onEdit(order: Orderdata) {
    console.log('Edit order:', order);
  }

  onDelete(order: Orderdata) {
    console.log('Delete order:', order);
    this.orders = this.orders.filter(o => o.id !== order.id);
  }
}
