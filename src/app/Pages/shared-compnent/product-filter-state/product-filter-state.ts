
import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CategoryFilterOption {
  slug: string;
  name: string;
}

export interface FabricFilterOption {
  id: number;
  name: string;
  slug: string;
}

export interface ProductFilterStatedata {
  category: string;
  fabric: string;
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
  fabrics = input<FabricFilterOption[]>([]);

  selectedCategory = input<string>('all');
  selectedFabric = input<string>('all');
  maxPrice = input<number>(20000);

  filterChange = output<ProductFilterStatedata>();

  draftCategory = signal('all');
  draftFabric = signal('all');
  draftMaxPrice = signal(20000);

  constructor() {
    effect(() => {
      this.draftCategory.set(this.selectedCategory());
      this.draftFabric.set(this.selectedFabric());
      this.draftMaxPrice.set(this.maxPrice());
    });
  }

  onCategorySelect(category: string): void {
    this.draftCategory.set(category);
  }

  onFabricSelect(fabric: string): void {
    this.draftFabric.set(fabric);
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
      fabric: this.draftFabric(),
      maxPrice: this.draftMaxPrice(),
    });
  }

  resetDraftFilters(): void {
    this.draftCategory.set('all');
    this.draftFabric.set('all');
    this.draftMaxPrice.set(20000);
  }

  formatPkr(amount: number): string {
    return `PKR ${amount.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })}`;
  }
}
