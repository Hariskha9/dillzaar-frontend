
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  featured_image?: string;
  regular_price: number;
  sale_price?: number | null;
  quantity: number;
  stock_quantity: number;
}


@Injectable({
  providedIn: 'root',
})
export class CartService {
   private storageKey = 'khanibykhanam_cart';

   private cartCountSubject = new BehaviorSubject<number>(this.getTotalItems());

cartCount$ = this.cartCountSubject.asObservable();

private updateCartCount(): void {
  this.cartCountSubject.next(this.getTotalItems());
}

refreshCartCount(): void {
  this.cartCountSubject.next(this.getTotalItems());
}

  // Get cart from localStorage
  getCart(): CartItem[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }

    return JSON.parse(
      localStorage.getItem(this.storageKey) || '[]'
    );
  }

  // Save cart to localStorage
  saveCart(items: CartItem[]): void {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(items)
    );
    this.updateCartCount();
  }

  // Add product to cart
  addToCart(product: any, quantity: number = 1): void {
    const cart = this.getCart();

    const existing = cart.find(
      item => item.id === product.id
    );

    if (existing) {
      const newQuantity = existing.quantity + quantity;

      if (newQuantity <= existing.stock_quantity) {
        existing.quantity = newQuantity;
      }
    } else {
      if (quantity > 0 && quantity <= product.stock_quantity) {
        cart.push({
          ...product,
          quantity
        });
      }
    }

    this.saveCart(cart);
  }

  // Update quantity
  updateQuantity(id: number, quantity: number): void {
    const cart = this.getCart();

    const item = cart.find(item => item.id === id);

    if (item && quantity >= 1 && quantity <= item.stock_quantity) {
      item.quantity = quantity;
      this.saveCart(cart);
    }
  }

  // Remove product
  removeItem(id: number): void {
    const cart = this.getCart().filter(
      item => item.id !== id
    );

    this.saveCart(cart);
  }

  // Clear cart
  clearCart(): void {
    localStorage.removeItem(this.storageKey);
      this.updateCartCount();

  }

  // Cart subtotal
  getSubtotal(): number {
    return this.getCart().reduce((total, item) => {
      return total + this.getItemPrice(item) * item.quantity;
    }, 0);
  }

  // Get sale price or regular price
  getItemPrice(item: CartItem): number {
    return Number(
      item.sale_price && item.sale_price > 0
        ? item.sale_price
        : item.regular_price
    );
  }

  // Total quantity
  getTotalItems(): number {
    return this.getCart().reduce(
      (total, item) => total + item.quantity,
      0
    );
  }
}
