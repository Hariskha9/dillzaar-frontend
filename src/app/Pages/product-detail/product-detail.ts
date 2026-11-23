
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { ProductCard } from '../shared-compnent/product-card/product-card';

import { Productdata, Product } from '../../core/services/product/product';
import { CartService } from '../../core/services/cart/cart-service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProductCard
  ],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetail implements OnInit {

  // Current product
  product: Productdata | null = null;

  // Related products
  relatedProducts: any[] = [];

  // Loading states
  loading = true;
  relatedLoading = false;
  errorMessage = '';

  // Image gallery
  selectedImage = '';

  // Size selection
  selectedSize = '';
  sizes: string[] = ['XS', 'S', 'M', 'L'];

  // Lightbox
  isLightboxOpen = false;
  lightboxImage = '';

  quantity = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: Product,
    private cdr:ChangeDetectorRef,
    private cartService: CartService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    window.scrollTo({
  top: 0,
  behavior: 'smooth'
});

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');

      if (slug) {
        this.loadProduct(slug);
      } else {
        this.loading = false;
        this.errorMessage = 'Product not found.';
      }
    });
  }

  // Load product using slug
  loadProduct(slug: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.product = null;
    this.selectedImage = '';

    this.productService.getProductBySlug(slug).subscribe({
      next: (response) => {
        this.product = response.data;

        if (!this.product) {
          this.errorMessage = 'Product not found.';
          this.loading = false;
          return;
        }

        // Set first image as selected image
        this.selectedImage = this.productImages[0] || '';

        // Reset size selection
        this.selectedSize = '';

        // Load related products
        if (this.product.id) {
          this.loadRelatedProducts(this.product.id);
        }

        this.loading = false;

        this.cdr.detectChanges()
      },

      error: (error) => {
        console.error('Product loading error:', error);

        this.errorMessage =
          error?.error?.message || 'Unable to load product.';

        this.loading = false;
      }
    });
  }

  // Get all product images
  // get productImages(): string[] {
  //   if (!this.product) {
  //     return [];
  //   }

  //   const images: string[] = [];

  //   const featuredImage =
  //     this.product.featured_image;

  //   if (featuredImage) {
  //     images.push(featuredImage);
  //   }

  //   let gallery: any = this.product.gallery_images || [];

  //   // Handle gallery JSON string
  //   if (typeof gallery === 'string') {
  //     try {
  //       gallery = JSON.parse(gallery);
  //     } catch {
  //       gallery = gallery ? [gallery] : [];
  //     }
  //   }

  //   if (Array.isArray(gallery)) {
  //     gallery.forEach((image: any) => {
  //       let imageUrl = '';

  //       if (typeof image === 'string') {
  //         imageUrl = image;
  //       } else if (image && typeof image === 'object') {
  //         imageUrl =
  //           image.url ||
  //           image.file_path ||
  //           image.path ||
  //           image.image ||
  //           '';
  //       }

  //       if (imageUrl && !images.includes(imageUrl)) {
  //         images.push(imageUrl);
  //       }
  //     });
  //   }

  //   return images;
  // }

  get productImages(): string[] {
  if (!this.product) {
    return [];
  }

  const images: string[] = [];

  // Convert image path into Laravel storage URL
  const getImageUrl = (image: string): string => {
    if (!image) {
      return '';
    }

    // Already a complete URL
    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    // Remove leading slash if present
    image = image.replace(/^\/+/, '');

    // Avoid adding storage twice
    if (image.startsWith('storage/')) {
      return `http://127.0.0.1:8000/${image}`;
    }

    return `http://127.0.0.1:8000/storage/${image}`;
  };

  // Featured image
  const featuredImage = this.product.featured_image;

  if (featuredImage) {
    images.push(getImageUrl(featuredImage));
  }

  // Gallery images
  let gallery: any = this.product.gallery_images || [];

  if (typeof gallery === 'string') {
    try {
      gallery = JSON.parse(gallery);
    } catch {
      gallery = gallery ? [gallery] : [];
    }
  }

  if (Array.isArray(gallery)) {
    gallery.forEach((image: any) => {
      let imageUrl = '';

      if (typeof image === 'string') {
        imageUrl = image;
      } else if (image && typeof image === 'object') {
        imageUrl =
          image.url ||
          image.file_path ||
          image.path ||
          image.image ||
          '';
      }

      if (imageUrl) {
        const finalUrl = getImageUrl(imageUrl);

        if (!images.includes(finalUrl)) {
          images.push(finalUrl);
        }
      }
    });
  }

  return images;
}

  // Product price
  get productPrice(): number {
    if (!this.product) {
      return 0;
    }

    return Number(
      this.product.sale_price &&
      this.product.sale_price > 0
        ? this.product.sale_price
        : this.product.regular_price
    );
  }

  // Format price
  formatPrice(price: number | null | undefined): string {
    return Number(price || 0).toLocaleString('en-PK', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

    getDiscount(regularPrice: number, salePrice: number): number {
  if (!regularPrice || !salePrice || salePrice >= regularPrice) {
    return 0;
  }

  return Math.round(
    ((regularPrice - salePrice) / regularPrice) * 100
  );
}

  // Category name
  get categoryName(): string {
    return this.product?.category?.name || 'COLLECTION';
  }

  // Product availability
  get availability(): string {
    if (!this.product) {
      return 'Unavailable';
    }

    return this.product.stock_quantity > 0
      ? 'In Stock'
      : 'Out of Stock';
  }

  // Check if product is in stock
  get isInStock(): boolean {
    return !!this.product &&
      this.product.stock_quantity > 0 &&
      this.product.is_active;
  }

  // Select product image
  selectImage(image: string): void {
    this.selectedImage = image;
  }

  // Select product size
  selectSize(size: string): void {
    this.selectedSize = size;
  }

  // Open image lightbox
  openLightbox(image?: string): void {
    this.lightboxImage = image || this.selectedImage;
    this.isLightboxOpen = true;
  }

  // Close image lightbox
  closeLightbox(): void {
    this.isLightboxOpen = false;
    this.lightboxImage = '';
  }

  // Load related products
  loadRelatedProducts(currentProductId: number): void {
    this.relatedLoading = true;

    this.productService.getPublicProducts(1).subscribe({
      next: (response: any) => {
        let products: Productdata[] = [];

        // Handle Laravel pagination response
        if (Array.isArray(response?.data)) {
          products = response.data;
        } else if (Array.isArray(response?.data?.data)) {
          products = response.data.data;
        } else if (Array.isArray(response)) {
          products = response;
        }

        // Exclude current product and get 3 related products
        this.relatedProducts = products
          .filter(item => item.id !== currentProductId)
          .slice(0, 8)
          .map(item => ({
            id: item.id,
            name: item.name,
            category: item.category?.name || 'COLLECTION',
            price: this.formatPrice(
              item.sale_price && item.sale_price > 0
                ? item.sale_price
                : item.regular_price
            ),
            regularPrice: item.regular_price,
            salePrice: item.sale_price,
            image:
            
              item.featured_image ||
              '',
            slug: item.slug,
            isWishlisted: false
          }));

        this.relatedLoading = false;
                this.cdr.detectChanges()

      },

      error: (error) => {
        console.error('Related products error:', error);
        this.relatedProducts = [];
        this.relatedLoading = false;
      }
    });
  }

  // Add product to bag
  // addToBag(): void {
  //   if (!this.product) {
  //     return;
  //   }

  //   if (!this.isInStock) {
  //     alert('This product is currently out of stock.');
  //     return;
  //   }

  //   // if (!this.selectedSize) {
  //   //   alert('Please select a size first.');
  //   //   return;
  //   // }

  //   // Cart service integration can be added here
  //   console.log('Product added to bag:', {
  //     product: this.product,
  //     size: this.selectedSize,
  //     quantity: 1
  //   });
  // }


  addToBag(): void {

  if (!this.product) {
    return;
  }

  const quantity = this.quantity || 1;
  const stock = Number(this.product.stock_quantity || 0);

  if (stock < 1 || quantity > stock) {
    return;
  }

  this.cartService.addToCart(
    this.product,
    quantity
  );

  alert('Product added to your bag successfully!');
}

  // Wishlist handler
  handleWishlist(product: any): void {
    console.log('Wishlist product:', product);
  }

  // Quick add handler
  handleQuickAdd(product: any): void {
    console.log('Quick add product:', product);
  }


increaseQuantity(): void {
    if (!this.product) return;

  if (this.quantity < this.product.stock_quantity) {
    this.quantity++;
  }
}

decreaseQuantity(): void {
  if (this.quantity > 1) {
    this.quantity--;
  }
}

buyNow(): void {

  if (!this.product) return;

  const stock = this.product.stock_quantity ?? 0;

  if (this.quantity < 1 || this.quantity > stock) {
    return;
  }

  this.cartService.addToCart(this.product, this.quantity);

  this.router.navigate(['/checkout']);

}
  
}
