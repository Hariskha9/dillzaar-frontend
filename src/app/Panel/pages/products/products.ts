import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  active: boolean;
  image: string;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  products: Product[] = [
    { id: 1, name: 'Zareen', sku: 'ZQ-F25-004', price: 15990, stock: 6, active: true, image: 'assets/images/zareen.webp' },
    { id: 2, name: 'Sahar', sku: 'ZQ-L25-012', price: 11990, stock: 7, active: true, image: 'assets/images/sahar.webp' },
    { id: 3, name: 'Mahpara', sku: 'ZQ-RTW-011', price: 6490, stock: 24, active: true, image: 'assets/images/mahpara.webp' },
    { id: 4, name: 'Gul Bano', sku: 'ZQ-L25-003', price: 10990, stock: 9, active: true, image: 'assets/images/gul-bano.webp' },
    { id: 5, name: 'Mehr-Un-Nisa', sku: 'ZQ-L25-002', price: 9290, stock: 12, active: true, image: 'assets/images/mehr-un-nisa.webp' },
    { id: 6, name: 'Noor Jahan', sku: 'ZQ-L25-001', price: 8490, stock: 18, active: true, image: 'assets/images/noor-jahan.webp' }
  ];

  onView(product: Product) {
    console.log('View product:', product);
  }

  onEdit(product: Product) {
    console.log('Edit product:', product);
  }

  onDelete(product: Product) {
    console.log('Delete product:', product);
    this.products = this.products.filter(p => p.id !== product.id);
  }
}
