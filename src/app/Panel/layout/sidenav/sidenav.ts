import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css',
})
export class Sidenav {
 // Emits an event to close sidebar on mobile when a link is clicked
  @Output() linkClicked = new EventEmitter<void>();

  navSections: NavSection[] = [
    {
      title: 'Collections',
      items: []
    },
    {
      title: 'Commerce',
      items: [
        { label: 'Categories', route: '/panel/categories' },
        { label: 'Products', route: '/panel/products' },
        { label: 'Orders', route: '/panel/orders' },
        { label: 'Users', route: '/panel/users' },
      ]
    },
    {
      title: 'Content',
      items: [
        { label: 'Posts', route: '/admin/posts' }
      ]
    },
    {
      title: 'Customer Care',
      items: [
        { label: 'Contact Submissions', route: '/admin/contact-submissions' }
      ]
    }
  ];

  onNavClick() {
    this.linkClicked.emit();
  }
}
