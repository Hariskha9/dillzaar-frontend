import {
  Component,
  OnInit,
  signal,
  computed,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Product, Productdata } from '../../core/services/product/product';
import {
  ProductFilterStatedata,
  ProductFilterState,
  CategoryFilterOption,
} from '../shared-compnent/product-filter-state/product-filter-state';
import { ProductCard } from '../shared-compnent/product-card/product-card';


export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';


interface Fabric {
  id: number;
  name: string;
  slug: string;
}

@Component({
  selector: 'app-all-product',
  imports: [CommonModule, ProductFilterState, ProductCard],
  templateUrl: './all-product.html',
  styleUrl: './all-product.css',
})
export class AllProduct implements OnInit{
  private readonly productService = inject(Product);
  private readonly platformId = inject(PLATFORM_ID);

  products = signal<Productdata[]>([]);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  currentPage = signal<number>(1);
  lastPage = signal<number>(1);
  totalCount = signal<number>(0);

  selectedCategory = signal<string>('all');
selectedFabric = signal<string>('all');
  maxPrice = signal<number>(20000);
  sortBy = signal<SortOption>('featured');
  wishlistIds = signal<Set<number>>(new Set());

  categories = computed<CategoryFilterOption[]>(() => {
    const map = new Map<string, string>();
    for (const p of this.products()) {
      if (p.category?.slug && p.category?.name) {
        map.set(p.category.slug, p.category.name);
      }
    }
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  });

  fabricOptions = computed<Fabric[]>(() => {
  const map = new Map<string, Fabric>();

  for (const p of this.products()) {
    if (p.fabric?.id && p.fabric?.name && p.fabric?.slug) {
      map.set(p.fabric.slug, {
        id: p.fabric.id,
        name: p.fabric.name,
        slug: p.fabric.slug,
      });
    }
  }

  return Array.from(map.values());
});

 

  filteredProducts = computed<Productdata[]>(() => {
  const cat = this.selectedCategory();
  const fab = this.selectedFabric();
  const ceiling = this.maxPrice();
  const sort = this.sortBy();

  let list = this.products().filter((p) => {
    if (cat !== 'all' && p.category?.slug !== cat) {
      return false;
    }

    if (fab !== 'all' && p.fabric?.slug !== fab) {
      return false;
    }

    if (this.getEffectivePrice(p) > ceiling) {
      return false;
    }

    return true;
  });

  if (sort === 'price-asc') {
    list = [...list].sort(
      (a, b) => this.getEffectivePrice(a) - this.getEffectivePrice(b)
    );
  } else if (sort === 'price-desc') {
    list = [...list].sort(
      (a, b) => this.getEffectivePrice(b) - this.getEffectivePrice(a)
    );
  } else if (sort === 'newest') {
    list = [...list].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  }

  return list;
});

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    if (page < 1) return;
    this.loading.set(true);
    this.errorMessage.set(null);

    this.productService.getPublicProducts(page).subscribe({
      next: (res) => {
        const paginated = res?.data;
        const items: Productdata[] = Array.isArray(paginated?.data)
          ? paginated.data
          : [];
          console.log('allp',items)
        this.products.set(items);
        this.currentPage.set(paginated?.current_page ?? page);
        this.lastPage.set(paginated?.last_page ?? 1);
        this.totalCount.set(paginated?.total ?? items.length);
        this.loading.set(false);

        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: () => {
        this.errorMessage.set(
          'Unable to load products right now. Please try again.'
        );
        this.loading.set(false);
      },
    });
  }

  onFilterChange(state: ProductFilterStatedata): void {
    this.selectedCategory.set(state.category);
    this.selectedFabric.set(state.fabric);
    this.maxPrice.set(state.maxPrice);
  }

  resetFilters(): void {
    this.selectedCategory.set('all');
        this.selectedFabric.set('all');
    this.maxPrice.set(20000);
    this.sortBy.set('featured');
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as SortOption;
    this.sortBy.set(value);
  }

  toggleWishlist(id: number): void {
    this.wishlistIds.update((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  isWishlisted(id: number | undefined): boolean {
    if (id === undefined) return false;
    return this.wishlistIds().has(id);
  }

  private getEffectivePrice(product: Productdata): number {
    const sale =
      product.sale_price !== null && product.sale_price !== undefined
        ? Number(product.sale_price)
        : NaN;
    if (!Number.isNaN(sale) && sale > 0) {
      return sale;
    }
    return Number(product.regular_price) || 0;
  }
}
