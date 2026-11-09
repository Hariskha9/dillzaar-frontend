import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashbored',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashbored.html',
  styleUrl: './dashbored.css',
})
export class Dashbored {
  stats = [
    { title: 'Total Revenue', value: 'PKR 4,850,200', change: '+12.5%', isPositive: true },
    { title: 'Total Orders', value: '1,428', change: '+8.2%', isPositive: true },
    { title: 'Total Products', value: '356', change: '+3 new', isPositive: true },
    { title: 'Active Customers', value: '2,845', change: '-1.4%', isPositive: false }
  ];

  recentOrders = [
    { id: '#ZQ-8492', customer: 'Ayesha Khan', product: 'Luxury Lawn - Mint Green', amount: 'PKR 14,500', status: 'Completed' },
    { id: '#ZQ-8491', customer: 'Fatima Malik', product: 'Festive Formal - Black', amount: 'PKR 28,000', status: 'Processing' },
    { id: '#ZQ-8490', customer: 'Zainab Ahmed', product: 'Ready to Wear - Grey', amount: 'PKR 9,500', status: 'Shipped' },
    { id: '#ZQ-8489', customer: 'Usman Tariq', product: 'Luxury Lawn - Crimson', amount: 'PKR 15,200', status: 'Pending' }
  ];
}
