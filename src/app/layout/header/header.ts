import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart/cart-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit , OnDestroy {
  isMobileMenuOpen = false;
  cartItemCount = 0; // Update dynamically based on your cart service
  private cartService = inject(CartService);


  navItems = [
    { label: 'NEW IN', route: '/new-in' },
    { label: 'LUXURY LAWN', route: '/luxury-lawn' },
    { label: 'READY TO WEAR', route: '/ready-to-wear' },
    { label: 'FESTIVE', route: '/festive' },
    { label: 'SHOP ALL', route: '/shop-all' },
    { label: 'JOURNAL', route: '/journal' },
    { label: 'OUR STORY', route: '/our-story' },
    { label: 'CONTACT', route: '/contact' },
    { label: 'MY ACCOUNT', route: '/account' }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit(): void {
  this.updateCartCount();
  window.addEventListener('storage', this.handleStorageChange);
}

ngOnDestroy(): void {
  window.removeEventListener('storage', this.handleStorageChange);
}

updateCartCount(): void {
  this.cartItemCount = this.cartService.getTotalItems();
}

private handleStorageChange = (event: StorageEvent): void => {
  if (event.key === 'dillzaar_cart') {
    this.updateCartCount();
  }
};
}
