import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RouterModule } from '@angular/router';

import { CartService, CartItem } from '../../core/services/cart/cart-service';
import { Orderservice } from '../../core/services/order/orderservice';

@Component({
  selector: 'app-checkout',
  imports: [
      CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit{


  private fb = inject(FormBuilder);
  private orderService = inject(Orderservice);

  public cartService = inject(CartService);

  cartItems: CartItem[] = [];

  loading = false;
  errorMessage = '';

  orderPlaced = false;
  orderNumber = '';

  checkoutForm = this.fb.group({

    customer_name: ['', Validators.required],

    email: ['', [
      Validators.required,
      Validators.email
    ]],

    phone: ['', Validators.required],

    address: ['', Validators.required],

    city: ['', Validators.required],

    postal_code: [''],

    notes: ['']

  });

  ngOnInit(): void {

    this.cartItems = this.cartService.getCart();

  }

  get subtotal(): number {
    return this.cartService.getSubtotal();
  }

  get total(): number {
    return this.subtotal;
  }

  getItemPrice(item: CartItem): number {
    return this.cartService.getItemPrice(item);
  }

  placeOrder(): void {

    if (this.checkoutForm.invalid) {

      this.checkoutForm.markAllAsTouched();

      return;
    }

    if (this.cartItems.length === 0) {

      this.errorMessage = 'Your cart is empty.';

      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const orderData = {

      ...this.checkoutForm.getRawValue(),

      payment_method: 'cod',

      items: this.cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }))

    };

    this.orderService.createOrder(orderData).subscribe({

      next: (response) => {

        this.loading = false;

        this.orderPlaced = true;

        this.orderNumber = response.order.order_number;

        this.cartService.clearCart();

        this.cartItems = [];

      },

      error: (error) => {

        this.loading = false;

        this.errorMessage =
          error.error?.message ||
          'Unable to place your order. Please try again.';

      }

    });

  }
}
