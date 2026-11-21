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
        { label: 'New arrivals', route: '/shop/new-arrivals' },
        { label: 'Luxury lawn', route: '/shop/luxury-lawn' },
        { label: 'Ready to wear', route: '/shop/ready-to-wear' },
        { label: 'Festive', route: '/shop/festive' },
      ],
    },
    {
      heading: 'HELP',
      links: [
        { label: 'Contact us', route: '/contact' },
        { label: 'Shopping bag', route: '/bag' },
        { label: 'Checkout', route: '/checkout' },
        { label: 'My orders', route: '/orders' },
      ],
    },
    {
      heading: 'ABOUT',
      links: [
        { label: 'Our story', route: '/about/our-story' },
        { label: 'Journal', route: '/journal' },
        { label: 'Craftsmanship', route: '/about/craftsmanship' },
        { label: 'Store admin', route: '/admin' },
      ],
    },
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
