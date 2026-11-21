import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
  private cartSubscription?: Subscription;


  navItems = [
    { label: 'Home', route: '/' },
    { label: 'All Products', route: '/products' },
    { label: 'Three Piece', route: '/ready-to-wear' },
    { label: 'Two  Piece', route: '/festive' },
    { label: 'Embroidery', route: '/shop-all' },
    { label: 'JOURNAL', route: '/journal' },
    { label: 'OUR STORY', route: '/our-story' },
    { label: 'CONTACT', route: '/contact' },
    { label: 'MY ACCOUNT', route: '/panel' }
  ];

  constructor(private cdr:ChangeDetectorRef){}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit(): void {
     this.cartSubscription = this.cartService.cartCount$.subscribe(count => {
      this.cartItemCount = count;
      this.cdr.detectChanges();
    });

        this.cartService.refreshCartCount();

  // this.updateCartCount();
  // window.addEventListener('storage', this.handleStorageChange);
}

ngOnDestroy(): void {
      this.cartSubscription?.unsubscribe();

  // window.removeEventListener('storage', this.handleStorageChange);
}

updateCartCount(): void {
  this.cartItemCount = this.cartService.getTotalItems();
      this.cdr.detectChanges();

}

private handleStorageChange = (event: StorageEvent): void => {
  if (event.key === 'khanibykhanam_cart') {
    this.updateCartCount();
    this.cdr.detectChanges();
  }
};
}
