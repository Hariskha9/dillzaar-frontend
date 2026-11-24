import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductCard } from '../../../shared-compnent/product-card/product-card';
import { Product } from '../../../../core/services/product/product';

@Component({
  selector: 'app-home-product-collection',
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './home-product-collection.html',
  styleUrl: './home-product-collection.css',
})
export class HomeProductCollection implements OnInit {

  @Input() title = '';
  @Input() categorySlug = '';
    categoryName = '';


  products: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private productService: Product,
    private cdr: ChangeDetectorRef
  ) {}

   ngOnInit(): void {
    this.setCategoryName();
    this.loadProducts();
  }

  // Convert slug into readable category name
  setCategoryName(): void {
    this.categoryName = this.categorySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  get viewMoreRoute(): string[] {
    return ['/products', this.categorySlug];
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

      const filters = {
      category: this.categorySlug,
      type: 'all',
      fabric: 'all',
      collection: 'all',
      season: 'all',
      maxPrice: 20000,
    };

    this.productService
      .getPublicProducts(1, filters)
      .subscribe({
        next: (response: any) => {
          const result = response?.data;

          const productList = Array.isArray(result)
            ? result
            : Array.isArray(result?.data)
              ? result.data
              : [];

          this.products = productList
            .slice(0, 8)
            .map((product: any) => ({
              ...product,
              isWishlisted: false,
            }));

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(`${this.title} products error:`, error);

          this.errorMessage = 'Unable to load products. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  handleWishlist(product: any): void {
    console.log('Wishlist updated:', product.name, product.isWishlisted);
  }

  handleQuickAdd(product: any): void {
    console.log('Added to cart:', product.name);
  }
}
