import {
  Component,
  input,
  output,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CategoryFilterOption {
  id: number;
  name: string;
  slug: string;
}

export interface AttributeFilterOption {
  id: number;
  name: string;
  slug: string;
}

export interface ProductFilterStatedata {
  category: string;
  type: string;
  fabric: string;
  collection: string;
  season: string;
  maxPrice: number;
}

@Component({
  selector: 'app-product-filter-state',
  imports: [CommonModule],
  templateUrl: './product-filter-state.html',
  styleUrl: './product-filter-state.css',
})
export class ProductFilterState {
  categories = input<CategoryFilterOption[]>([]);
  types = input<AttributeFilterOption[]>([]);
  fabrics = input<AttributeFilterOption[]>([]);
  collections = input<AttributeFilterOption[]>([]);
  seasons = input<AttributeFilterOption[]>([]);

  selectedCategory = input<string>('all');
  selectedType = input<string>('all');
  selectedFabric = input<string>('all');
  selectedCollection = input<string>('all');
  selectedSeason = input<string>('all');
  maxPrice = input<number>(20000);

  filterChange = output<ProductFilterStatedata>();

  draftCategory = signal('all');
  draftType = signal('all');
  draftFabric = signal('all');
  draftCollection = signal('all');
  draftSeason = signal('all');
  draftMaxPrice = signal(20000);

  isMobileFilterOpen = signal(false);

  constructor() {
    effect(() => {
      this.draftCategory.set(this.selectedCategory());
      this.draftType.set(this.selectedType());
      this.draftFabric.set(this.selectedFabric());
      this.draftCollection.set(this.selectedCollection());
      this.draftSeason.set(this.selectedSeason());
      this.draftMaxPrice.set(this.maxPrice());
    });
  }

  openMobileFilter(): void {
    this.isMobileFilterOpen.set(true);
  }

  closeMobileFilter(): void {
    this.isMobileFilterOpen.set(false);
  }

  onCategorySelect(value: string): void {
    this.draftCategory.set(value);
  }

  onTypeSelect(value: string): void {
    this.draftType.set(value);
  }

  onFabricSelect(value: string): void {
    this.draftFabric.set(value);
  }

  onCollectionSelect(value: string): void {
    this.draftCollection.set(value);
  }

  onSeasonSelect(value: string): void {
    this.draftSeason.set(value);
  }

  onPriceInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);

    if (!Number.isNaN(value)) {
      this.draftMaxPrice.set(value);
    }
  }

  applyFilters(): void {
    this.filterChange.emit({
      category: this.draftCategory(),
      type: this.draftType(),
      fabric: this.draftFabric(),
      collection: this.draftCollection(),
      season: this.draftSeason(),
      maxPrice: this.draftMaxPrice(),
    });

    this.closeMobileFilter();
  }

  resetDraftFilters(): void {
    this.draftCategory.set('all');
    this.draftType.set('all');
    this.draftFabric.set('all');
    this.draftCollection.set('all');
    this.draftSeason.set('all');
    this.draftMaxPrice.set(20000);
  }

  formatPkr(amount: number): string {
    return `PKR ${amount.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })}`;
  }
}