
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Productdata, Product } from '../../../core/services/product/product';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  private productService = inject(Product);

  products: Productdata[] = [];
  filteredProducts: Productdata[] = [];

  loading = false;
  deletingId: number | null = null;

  searchTerm = '';
  errorMessage = '';

  currentPage = 1;
  lastPage = 1;
  perPage = 15;
  totalProducts = 0;

  constructor(    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Get products from Laravel API
  loadProducts(page: number = 1): void {

    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts(page, this.perPage).subscribe({

      next: (response: any) => {

        const pagination = response.data;

        this.products = pagination.data || [];

        this.currentPage = pagination.current_page || 1;
        this.lastPage = pagination.last_page || 1;
        this.totalProducts = pagination.total || 0;

        this.applySearch();

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Products loading error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load products.';

        this.loading = false;
      }

    });
  }

  // Search products
  applySearch(): void {

    const search = this.searchTerm.toLowerCase().trim();

    if (!search) {
      this.filteredProducts = [...this.products];
      return;
    }

    this.filteredProducts = this.products.filter(product =>
      product.name?.toLowerCase().includes(search) ||
      product.sku?.toLowerCase().includes(search) ||
      product.slug?.toLowerCase().includes(search)
    );
  }

  // Image URL from Laravel storage
  getImageUrl(path: string | null | undefined): string {

    if (!path) {
      return 'assets/images/no-image.png';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const baseUrl = environment.apiUrl.replace(/\/api\/?$/, '');

    return `${baseUrl}/storage/${path}`;
  }

  // View product
  onView(product: Productdata): void {
    console.log('View product:', product);

    // Product details can be opened using product.slug
    // or admin product ID.
  }

  // Edit product
  onEdit(product: Productdata): void {
    console.log('Edit product:', product);
  }

  // Delete product
  onDelete(product: Productdata): void {

    if (!product.id) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${product.name}"?`
    );

    if (!confirmed) return;

    this.deletingId = product.id;

    this.productService.deleteProduct(product.id).subscribe({

      next: (response) => {

        console.log(response.message);

        this.deletingId = null;

        // Reload current page
        if (this.products.length === 1 && this.currentPage > 1) {
          this.loadProducts(this.currentPage - 1);
        } else {
          this.loadProducts(this.currentPage);
        }

      },

      error: (error) => {

        console.error('Delete product error:', error);

        alert(
          error.error?.message || 'Unable to delete product.'
        );

        this.deletingId = null;
      }

    });
  }

  // Pagination
  previousPage(): void {

    if (this.currentPage > 1) {
      this.loadProducts(this.currentPage - 1);
    }
  }

  nextPage(): void {

    if (this.currentPage < this.lastPage) {
      this.loadProducts(this.currentPage + 1);
    }
  }

  // Change per page
  changePerPage(value: string): void {

    this.perPage = Number(value);

    // Your Laravel index currently uses paginate(15).
    // See the backend change below to make this dynamic.
    this.loadProducts(1);
  }

  // Pagination starting number
get startRecord(): number {
  return this.totalProducts === 0
    ? 0
    : (this.currentPage - 1) * this.perPage + 1;
}

get endRecord(): number {
  return Math.min(
    this.currentPage * this.perPage,
    this.totalProducts
  );
}

}
