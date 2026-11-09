import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Category {
  id: number;
  name: string;
  slug: string;
  featured: boolean;
}

@Component({
  selector: 'app-categories',
  imports: [CommonModule, RouterModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  categories: Category[] = [
    { id: 1, name: 'Festive Formals', slug: 'festive-formals', featured: true },
    { id: 2, name: 'Ready to Wear', slug: 'ready-to-wear', featured: true },
    { id: 3, name: 'Luxury Lawn', slug: 'luxury-lawn', featured: true }
  ];

  onView(category: Category) {
    console.log('View category:', category);
  }

  onEdit(category: Category) {
    console.log('Edit category:', category);
  }

  onDelete(category: Category) {
    console.log('Delete category:', category);
    this.categories = this.categories.filter(c => c.id !== category.id);
  }
}
