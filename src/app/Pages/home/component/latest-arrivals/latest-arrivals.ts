
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ProductCard } from '../../../shared-compnent/product-card/product-card';
import { Product } from '../../../../core/services/product/product';

@Component({
  selector: 'app-latest-arrivals',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCard],
  templateUrl: './latest-arrivals.html',
  styleUrl: './latest-arrivals.css',
})
export class LatestArrivals implements OnInit {

  products: any[] = [];

  loading = false;
  errorMessage = '';

  constructor(
    private productService: Product,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLatestProducts();
  }

  // Get latest products from API
  loadLatestProducts(): void {

    this.loading = true;
    this.errorMessage = '';

    this.productService.getPublicProducts(1).subscribe({

      next: (response: any) => {

        // Support Laravel pagination response
        const result = response?.data;

        const productList: Product[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        // Display latest 6 products
        this.products = productList.slice(0, 6).map((product: any) => ({

          id: product.id,

          name: product.name,

          category: (
            product.category?.name || 'Uncategorized'
          ).toUpperCase(),

          price: this.formatPrice(
            product.sale_price && Number(product.sale_price) > 0
              ? product.sale_price
              : product.regular_price
          ),

          regularPrice: product.regular_price,

          salePrice: product.sale_price,

          image:
            product.featured_image_url ||
            product.featured_image ||
            'assets/images/placeholder.webp',

          slug: product.slug,

          isWishlisted: false

        }));

        this.loading = false;
this.cdr.detectChanges()


      },

      error: (error) => {

        console.error('Latest products error:', error);

        this.errorMessage = 'Unable to load latest products.';

        this.loading = false;

      }

    });

  }

  // Format product price
  formatPrice(price: number | string): string {

    return 'PKR ' + Number(price || 0).toLocaleString('en-PK');

  }

  // Wishlist
  handleWishlist(product: any): void {

    console.log(
      'Wishlist updated:',
      product.name,
      product.isWishlisted
    );

  }

  // Quick Add
  handleQuickAdd(product: any): void {

    console.log('Added to cart:', product.name);

  }

}
