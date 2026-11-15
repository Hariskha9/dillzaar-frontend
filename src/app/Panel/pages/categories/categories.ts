import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CategoryService, Category } from '../../../core/services/category/categoryservice';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {

  categories: Category[] = [];
  filteredCategories: Category[] = [];

  loading = false;
  deletingId: number | null = null;
  errorMessage = '';

  searchTerm = '';

  currentPage = 1;
  perPage = 10;
  total = 0;
  lastPage = 1;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Get categories from Laravel API
  loadCategories(): void {
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.getCategories(this.currentPage, this.perPage)
      .subscribe({
        next: (response: any) => {
          // Supports Laravel paginate() response and wrapped responses
          const paginator = response?.data && !Array.isArray(response.data)
            ? response.data
            : response;

          const rows = Array.isArray(response?.data)
            ? response.data
            : Array.isArray(paginator?.data)
              ? paginator.data
              : [];

          this.categories = rows;
          this.total = paginator?.total ?? rows.length;
          this.currentPage = paginator?.current_page ?? this.currentPage;
          this.perPage = paginator?.per_page ?? this.perPage;
          this.lastPage = paginator?.last_page ?? 1;


          this.applySearch();
          this.loading = false;
                            this.cdr.detectChanges();

        },
        error: (error) => {
          console.error('Categories loading error:', error);
          this.errorMessage = error?.error?.message || 'Unable to load categories.';
          this.loading = false;
        }
      });
  }

  // Search categories
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applySearch();
  }

  applySearch(): void {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      this.filteredCategories = [...this.categories];
      return;
    }

    this.filteredCategories = this.categories.filter(category =>
      category.name?.toLowerCase().includes(term) ||
      category.slug?.toLowerCase().includes(term)
    );

  }

  // View category
  onView(category: Category): void {
    this.categoryService.getCategory(category.id).subscribe({
      next: (response) => {
        console.log('Category details:', response?.data ?? response);
      },
      error: (error) => {
        console.error('Unable to load category:', error);
      }
    });
  }

  // Edit category
  onEdit(category: Category): void {
    // Change this URL if your edit route uses a different path.
    this.router.navigate(['/panel/categories/edit', category.id]);
  }

  // Delete category
  onDelete(category: Category): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    this.deletingId = category.id;

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.deletingId = null;

        // Reload to keep pagination totals accurate
        if (this.categories.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }

        this.loadCategories();
      },
      error: (error) => {
        console.error('Category delete error:', error);
        this.deletingId = null;
        alert(error?.error?.message || 'Unable to delete category.');
      }
    });
  }

  // Change page
  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadCategories();
  }

  // Change records per page
  onPerPageChange(event: Event): void {
    this.perPage = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 1;
    this.loadCategories();
  }

  get showingFrom(): number {
    return this.total === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
  }

  get showingTo(): number {
    return Math.min(this.currentPage * this.perPage, this.total);
  }
}