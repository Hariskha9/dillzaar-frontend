import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

interface MediaItem {
  id: number;
  fileName: string;
  alt: string;
  url: string;
}

@Component({
  selector: 'app-product-edit',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css',
})
export class ProductEdit implements OnInit {
  productForm: FormGroup;
  productId: string | null = null;
  
  // Image States
  featuredImagePreview: string | null = null;
  galleryImages: string[] = [];

  // Drawer Controls: 'none' | 'create-media' | 'select-media'
  activeDrawer: 'none' | 'create-media' | 'select-media' = 'none';
  targetForMedia: 'featured' | 'gallery' = 'gallery';
  
  newMediaPreview: string | null = null;
  newMediaAlt = '';

  categories = ['Luxury Lawn', 'Festive Formals', 'Ready to Wear'];

  // Mock database store for products (matches detail view pattern)
  productsData: { [key: string]: any } = {
    '1': {
      name: 'Zareen Festive Suit',
      slug: 'zareen-festive-suit',
      sku: 'ZQ-F25-001',
      regularPrice: 15990,
      salePrice: 13990,
      stock: 12,
      category: 'Festive Formals',
      description: 'Refined organza and silk ensemble with detailed embroidery.',
      active: true,
      featuredImage: 'assets/images/zareen.webp',
      gallery: ['assets/images/ready-to-wear.webp', 'assets/images/sahar.webp']
    },
    '2': {
      name: 'Elegance Lawn Print',
      slug: 'elegance-lawn-print',
      sku: 'ZQ-L25-002',
      regularPrice: 8990,
      salePrice: 7490,
      stock: 25,
      category: 'Luxury Lawn',
      description: 'Breathable summer lawn suit with vibrant prints.',
      active: true,
      featuredImage: 'assets/images/luxury-lawn.webp',
      gallery: ['assets/images/mehr-un-nisa.webp']
    }
  };

  // Mock Existing Media Library
  existingMediaItems: MediaItem[] = [
    { id: 1, fileName: 'zareen-formal-original.jpg', alt: 'Pakistani formal black embroidered ensemble', url: 'assets/images/zareen.webp' },
    { id: 2, fileName: 'ready-to-wear-original.jpg', alt: 'Pakistani woman wearing a grey outfit', url: 'assets/images/ready-to-wear.webp' },
    { id: 3, fileName: 'sahar-original.jpg', alt: 'Pakistani woman in a beige outfit', url: 'assets/images/sahar.webp' },
    { id: 4, fileName: 'mehr-un-nisa-original.jpg', alt: 'Pakistani woman in grey embroidered suit', url: 'assets/images/mehr-un-nisa.webp' },
    { id: 5, fileName: 'luxury-lawn-original.jpg', alt: 'Pakistani woman styling a green outfit', url: 'assets/images/luxury-lawn.webp' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      sku: ['', Validators.required],
      regularPrice: ['', [Validators.required, Validators.min(0)]],
      salePrice: ['', Validators.min(0)],
      stock: [1, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      description: [''],
      active: [true]
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId && this.productsData[this.productId]) {
      const product = this.productsData[this.productId];
      
      // Patch form values
      this.productForm.patchValue({
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        regularPrice: product.regularPrice,
        salePrice: product.salePrice,
        stock: product.stock,
        category: product.category,
        description: product.description,
        active: product.active
      });

      // Load images
      this.featuredImagePreview = product.featuredImage || null;
      this.galleryImages = product.gallery ? [...product.gallery] : [];
    }
  }

  // --- Featured Image Triggers ---
  openFeaturedMediaDrawer() {
    this.targetForMedia = 'featured';
    this.activeDrawer = 'select-media';
  }

  onFeaturedDesktopFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.featuredImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeFeaturedImage() {
    this.featuredImagePreview = null;
  }

  // --- Gallery Triggers ---
  openGalleryMediaDrawer() {
    this.targetForMedia = 'gallery';
    this.activeDrawer = 'select-media';
  }

  removeGalleryImage(index: number) {
    this.galleryImages.splice(index, 1);
  }

  // --- Drawer Management ---
  openCreateMediaDrawer() {
    this.activeDrawer = 'create-media';
    this.newMediaPreview = null;
    this.newMediaAlt = '';
  }

  closeDrawer() {
    this.activeDrawer = 'none';
  }

  onDrawerFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newMediaPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveNewMedia() {
    if (this.newMediaPreview) {
      const newMedia: MediaItem = {
        id: this.existingMediaItems.length + 1,
        fileName: 'upload-' + Date.now() + '.jpg',
        alt: this.newMediaAlt || 'Product image',
        url: this.newMediaPreview
      };
      this.existingMediaItems.unshift(newMedia);
      this.assignMedia(newMedia.url);
    }
  }

  selectExistingMedia(media: MediaItem) {
    this.assignMedia(media.url);
  }

  assignMedia(url: string) {
    if (this.targetForMedia === 'featured') {
      this.featuredImagePreview = url;
    } else {
      if (!this.galleryImages.includes(url)) {
        this.galleryImages.push(url);
      }
    }
    this.closeDrawer();
  }

  // Save / Update Product
  onUpdate() {
    if (this.productForm.valid) {
      const updatedProductData = {
        ...this.productForm.value,
        featuredImage: this.featuredImagePreview,
        gallery: this.galleryImages
      };
      console.log('Product Updated Successfully:', updatedProductData);
      this.router.navigate(['/admin/products']);
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
