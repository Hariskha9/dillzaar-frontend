import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) product!: any;
  @Output() wishlistToggle = new EventEmitter<any>();
  @Output() quickAddClick = new EventEmitter<any>();

  getProductImage(image: string | null | undefined): string {
  if (!image) {
    return 'assets/images/placeholder.png';
  }

  return `https://khanibykhanam.pk/api/storage/app/public/${image}`;
}



  onToggleWishlist(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.product.isWishlisted = !this.product.isWishlisted;
    this.wishlistToggle.emit(this.product);
  }

  onQuickAdd(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.quickAddClick.emit(this.product);
  }

  getDiscount(regularPrice: number, salePrice: number): number {
  if (!regularPrice || !salePrice || salePrice >= regularPrice) {
    return 0;
  }

  return Math.round(
    ((regularPrice - salePrice) / regularPrice) * 100
  );
}
}
