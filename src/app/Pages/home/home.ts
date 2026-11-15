import { Component } from '@angular/core';
import { HeroSection } from './component/hero-section/hero-section';
import { CuratedOccasions } from './component/curated-occasions/curated-occasions';
import { LatestArrivals } from './component/latest-arrivals/latest-arrivals';

@Component({
  selector: 'app-home',
  imports: [HeroSection, CuratedOccasions, LatestArrivals],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
