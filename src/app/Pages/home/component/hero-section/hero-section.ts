import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {
  heroImage = 'DillZaar-lawn.jpg';
  features = [
    { label: 'MADE IN PAKISTAN' },
    { label: '14 DAY EXCHANGE' },
    { label: 'FREE NATIONWIDE DELIVERY' }
  ];
}
