import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidenav } from '../sidenav/sidenav';
import { Observable } from 'rxjs';
import { Auth } from '../../../core/services/auth/auth';

@Component({
  selector: 'app-panel-body',
  imports: [CommonModule, RouterModule, Sidenav],
  templateUrl: './panel-body.html',
  styleUrl: './panel-body.css',
})
export class PanelBody {
  isSidebarOpen = false;

  user$: Observable<any>;

  constructor(private auth: Auth) {
      this.user$ = this.auth.user$;

  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
