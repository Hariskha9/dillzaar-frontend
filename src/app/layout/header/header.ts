import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isMobileMenuOpen = false;
  cartItemCount = 0; // Update dynamically based on your cart service

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
}
