
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart/cart-service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  cartItems: CartItem[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCart();
  }

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  get totalItems(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getItemPrice(item: CartItem): number {
    return this.cartService.getItemPrice(item);
  }

  getItemTotal(item: CartItem): number {
    return this.getItemPrice(item) * item.quantity;
  }

  increaseQuantity(item: CartItem): void {
    if (item.quantity < item.stock_quantity) {
      this.cartService.updateQuantity(
        item.id,
        item.quantity + 1
      );

      this.loadCart();
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartService.updateQuantity(
        item.id,
        item.quantity - 1
      );

      this.loadCart();
    }
  }

  removeItem(id: number): void {
    this.cartService.removeItem(id);
    this.loadCart();
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.loadCart();
  }
}
