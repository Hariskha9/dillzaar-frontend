import { Component } from '@angular/core';
import { HeroSection } from './component/hero-section/hero-section';
import { LatestArrivals } from './component/latest-arrivals/latest-arrivals';

@Component({
  selector: 'app-home',
  imports: [HeroSection, LatestArrivals],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
