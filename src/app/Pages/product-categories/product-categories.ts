import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Product,
  Productdata,
} from '../../core/services/product/product';

import { ProductCard } from '../shared-compnent/product-card/product-card';


@Component({
  selector: 'app-product-categories',
  imports: [CommonModule, ProductCard],
  templateUrl: './product-categories.html',
  styleUrl: './product-categories.css',
})
export class ProductCategories implements OnInit {
    private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(Product);

  products = signal<Productdata[]>([]);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  categorySlug = signal('');
  categoryName = signal('');

  currentPage = signal(1);
  lastPage = signal(1);
  totalCount = signal(0);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') || '';

      this.categorySlug.set(slug);
      this.categoryName.set(
        slug
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      );

      this.loadProducts(1);
    });
  }

  loadProducts(page: number): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const filters = {
      category: this.categorySlug(),
      type: 'all',
      fabric: 'all',
      collection: 'all',
      season: 'all',
      maxPrice: 20000,
    };

    this.productService.getPublicProducts(page, filters).subscribe({
      next: (res: any) => {
        const paginated = res?.data;

        this.products.set(
          Array.isArray(paginated?.data)
            ? paginated.data
            : []
        );

        this.currentPage.set(paginated?.current_page ?? page);
        this.lastPage.set(paginated?.last_page ?? 1);
        this.totalCount.set(paginated?.total ?? 0);

        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Unable to load products.');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage()) {
      this.loadProducts(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
