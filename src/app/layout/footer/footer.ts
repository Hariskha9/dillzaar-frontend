import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  route: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}


@Component({
  selector: 'app-footer',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  email = signal('');
  subscribed = signal(false);
  errorMessage = signal('');

  readonly columns: FooterColumn[] = [
    {
      heading: 'SHOP',
      links: [
        { label: 'Home', route: '/' },
        { label: 'All product', route: '/products' },
        { label: 'Two Piece', route: '/products/2-piece' },
        { label: 'Three Piece', route: '/products/3-piece' },
      ],
    },
    {
      heading: 'HELP',
      links: [
        { label: 'About us', route: '/about-us' },
        { label: 'Contact us', route: '/contact-us' },
        { label: 'Shopping bag', route: '/bag' },
        { label: 'Checkout', route: '/checkout' },
        // { label: 'My orders', route: '/orders' },
      ],
    },
    // {
    //   heading: 'ABOUT',
    //   links: [
    //     { label: 'Our story', route: '/about/our-story' },
    //     { label: 'Journal', route: '/journal' },
    //     { label: 'Craftsmanship', route: '/about/craftsmanship' },
    //     { label: 'Store admin', route: '/admin' },
    //   ],
    // },
  ];

  onSubscribe(event: Event): void {
    event.preventDefault();
    const trimmed = this.email().trim();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      this.errorMessage.set('Please enter a valid email address.');
      this.subscribed.set(false);
      return;
    }

    this.errorMessage.set('');
    this.subscribed.set(true);
    this.email.set('');
  }
}
