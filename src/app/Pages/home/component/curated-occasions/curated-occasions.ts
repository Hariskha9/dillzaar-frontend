import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-curated-occasions',
  imports: [CommonModule, RouterModule],
  templateUrl: './curated-occasions.html',
  styleUrl: './curated-occasions.css',
})
export class CuratedOccasions {
  occasions = [
    {
      title: 'Festive Formals',
      route: '/festive-formals',
      image: 'assets/images/festive-formals.webp',
      alt: 'Pakistani Black Festive Formal Outfit'
    },
    {
      title: 'Luxury Lawn',
      route: '/luxury-lawn',
      image: 'assets/images/luxury-lawn.webp',
      alt: 'Pakistani Mint Green Luxury Lawn Suit'
    },
    {
      title: 'Ready to Wear',
      route: '/ready-to-wear',
      image: 'assets/images/ready-to-wear.webp',
      alt: 'Pakistani Grey Ready to Wear Suit'
    }
  ];
}
