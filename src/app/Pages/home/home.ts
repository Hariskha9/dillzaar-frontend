import { Component } from '@angular/core';
import { HeroSection } from './component/hero-section/hero-section';
import { CuratedOccasions } from './component/curated-occasions/curated-occasions';

@Component({
  selector: 'app-home',
  imports: [HeroSection, CuratedOccasions],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
