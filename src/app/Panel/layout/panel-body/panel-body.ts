import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidenav } from '../sidenav/sidenav';

@Component({
  selector: 'app-panel-body',
  imports: [CommonModule, RouterModule, Sidenav],
  templateUrl: './panel-body.html',
  styleUrl: './panel-body.css',
})
export class PanelBody {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
