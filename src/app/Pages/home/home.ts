import { Component, OnInit } from '@angular/core';
import { HeroSection } from './component/hero-section/hero-section';
import { LatestArrivals } from './component/latest-arrivals/latest-arrivals';
import { HomeProductCollection } from './component/home-product-collection/home-product-collection';

@Component({
  selector: 'app-home',
  imports: [HeroSection, LatestArrivals, HomeProductCollection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{

  ngOnInit(): void {
    window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
  }

}
