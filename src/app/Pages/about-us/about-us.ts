import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface PromiseItem {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about-us',
  imports: [RouterLink],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css',
})
export class AboutUs {
  promises: PromiseItem[] = [
    {
      number: '01',
      title: 'Elegant Pakistani Fashion',
      description:
        'Elegant and trendy Pakistani fashion designed to celebrate your individual style.',
    },
    {
      number: '02',
      title: 'Beautiful Prints & Fabrics',
      description:
        'Beautiful prints and carefully selected fabrics that bring comfort and charm together.',
    },
    {
      number: '03',
      title: 'Affordable Elegance',
      description:
        'Affordable prices without compromising on quality, beauty or style.',
    },
    {
      number: '04',
      title: 'A Delightful Experience',
      description:
        'A delightful and trustworthy shopping experience from browsing to delivery.',
    },
    {
      number: '05',
      title: 'Customer Happiness',
      description:
        'Your happiness and satisfaction remain at the heart of everything we do.',
    },
    {
      number: '06',
      title: 'Fashion with Love',
      description:
        'Every outfit is thoughtfully selected with love, care and attention to detail.',
    },
  ];

}
