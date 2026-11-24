import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeroSection } from './component/hero-section/hero-section';
import { LatestArrivals } from './component/latest-arrivals/latest-arrivals';
import { HomeProductCollection } from './component/home-product-collection/home-product-collection';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [HeroSection, LatestArrivals, HomeProductCollection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  private platformId = inject(PLATFORM_ID);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

}
