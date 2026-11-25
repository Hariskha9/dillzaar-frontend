import {
  Component, 
  OnDestroy,
  signal,
  computed,
  PLATFORM_ID,
  inject,
  afterNextRender,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface HeroSlide {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaRoute: string;
  desktopImage: string;
  mobileImage: string;
  alt: string;
}

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection implements  OnDestroy {
  heroImage = 'DillZaar-lawn.jpg';
  features = [
    { label: 'MADE IN PAKISTAN' },
    { label: '14 DAY EXCHANGE' },
    { label: 'FREE NATIONWIDE DELIVERY' }
  ];

  private readonly platformId = inject(PLATFORM_ID);
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private touchStartX = 0;

  readonly slides: HeroSlide[] = [
    {
      id: 1,
      eyebrow: 'NEW ARRIVALS · WINTER EDIT',
      title: 'KHANI BY KHANAM',
      subtitle: 'Elegance in Every Thread',
      ctaLabel: 'SHOP NEW ARRIVALS',
      ctaRoute: '/collections/new-arrivals',
      desktopImage: 'khani by khanam Embroidered.webp',
      mobileImage: 'khani by khanam Embroidered mobile.webp',
      alt: 'Baroque Premium Khaddar Embroidered Collection',
    },
    {
      id: 2,
      eyebrow: 'FESTIVE LUXURY',
      title: 'KHANI BY KHANAM',
      subtitle: 'Regal Florals Collection',
      ctaLabel: 'DISCOVER NOW',
      ctaRoute: '/collections/regal-florals',
      desktopImage: 'khani by khanam slide 2.webp',
      mobileImage: 'khani by khanam slide 2 mobile.webp',
      alt: 'Premium Embroidered Khaddar Collection',
    },
    {
      id: 3,
      eyebrow: 'SIGNATURE PRINTS',
      title: 'KHANI BY KHANAM',
      subtitle: 'Vibrant Hues Collection',
      ctaLabel: 'EXPLORE COLLECTION',
      ctaRoute: '/collections/vibrant-hues',
      desktopImage: 'khani by khanam Embroidered.webp',
      mobileImage: 'khani by khanam Embroidered mobile.webp',
      alt: 'Mohagni Premium Khaddar Collection',
    },
    {
      id: 4,
      eyebrow: 'TIMELESS CRAFT',
      title: 'KHANI BY KHANAM',
      subtitle: 'Midnight Blooms Collection',
      ctaLabel: 'VIEW COLLECTION',
      ctaRoute: '/collections/midnight-blooms',
      desktopImage: 'khani by khanam slide 2.webp',
      mobileImage: 'khani by khanam slide 2 mobile.webp',
      alt: 'Khaddar 3 Piece Embroidered Collection',
    },
  ];

  currentIndex = signal(0);
  isPaused = signal(false);
  currentSlide = computed(() => this.slides[this.currentIndex()]);

  constructor() {
  afterNextRender(() => {
    this.startAutoPlay();
  });
}

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  next(): void {
    this.currentIndex.update((i) => (i + 1) % this.slides.length);
  }

  prev(): void {
    this.currentIndex.update(
      (i) => (i - 1 + this.slides.length) % this.slides.length
    );
  }

  goTo(index: number): void {
    this.currentIndex.set(index);
  }

  pause(): void {
    this.isPaused.set(true);
    this.stopAutoPlay();
  }

  resume(): void {
    this.isPaused.set(false);
    this.startAutoPlay();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndX = event.changedTouches[0].screenX;
    const diff = this.touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      diff > 0 ? this.next() : this.prev();
    }
  }

  private startAutoPlay(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.stopAutoPlay();
    this.intervalId = setInterval(() => {
      if (!this.isPaused()) {
        this.next();
      }
    }, 6000);
  }

  private stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
