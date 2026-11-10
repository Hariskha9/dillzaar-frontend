import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: boolean;
}

@Component({
  selector: 'app-users',
  imports: [CommonModule, RouterModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  // Toggle this to populate users or leave empty `[]` to test the exact empty state from your screenshot
  users: User[] = [
    { id: 1, name: 'Store Admin', email: 'admin@zarqash.com', role: 'Administrator', status: true },
    { id: 2, name: 'Ayesha Khan', email: 'ayesha@gmail.com', role: 'Customer', status: true },
    { id: 3, name: 'Fatima Malik', email: 'fatima@gmail.com', role: 'Customer', status: true }
  ];

  onCreateUser() {
    console.log('Navigate to Create User page');
  }

  onView(user: User) {
    console.log('View user:', user);
  }

  onEdit(user: User) {
    console.log('Edit user:', user);
  }

  onDelete(user: User) {
    console.log('Delete user:', user);
    this.users = this.users.filter(u => u.id !== user.id);
  }
}
