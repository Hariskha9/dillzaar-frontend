
import { Component, input, output } from '@angular/core';
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
  resetFilters = output<void>();

  onCategorySelect(category: string): void {
    this.filterChange.emit({
      category,
      fabric: this.selectedFabric(),
      maxPrice: this.maxPrice(),
    });
  }

  onFabricSelectname(fabric: string): void {
    this.filterChange.emit({
      category: this.selectedCategory(),
      fabric,
      maxPrice: this.maxPrice(),
    });
  }

  onPriceInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);

    if (!Number.isNaN(value)) {
      this.filterChange.emit({
        category: this.selectedCategory(),
        fabric: this.selectedFabric(),
        maxPrice: value,
      });
    }
  }

  formatPkr(amount: number): string {
    return `PKR ${amount.toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })}`;
  }
}
