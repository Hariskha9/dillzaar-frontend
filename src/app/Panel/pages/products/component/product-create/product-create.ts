import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

interface MediaItem {
  id: number;
  fileName: string;
  alt: string;
  url: string;
}

@Component({
  selector: 'app-product-create',
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css',
})
export class ProductCreate {
productForm: FormGroup;
  
  // Featured Image State
  featuredImagePreview: string | null = null;

  // Gallery Images State
  galleryImages: string[] = [];

  // Drawer Control: 'none' | 'create-media' | 'select-media' | 'select-featured'
  activeDrawer: 'none' | 'create-media' | 'select-media' | 'select-featured' = 'none';
  targetForMedia: 'featured' | 'gallery' = 'gallery';

  newMediaPreview: string | null = null;
  newMediaAlt = '';

  categories = ['Luxury Lawn', 'Festive Formals', 'Ready to Wear'];

  // Mock Existing Media Library
  existingMediaItems: MediaItem[] = [
    { id: 1, fileName: 'zareen-formal-original.jpg', alt: 'Pakistani formal black embroidered ensemble', url: 'assets/images/zareen.webp' },
    { id: 2, fileName: 'ready-to-wear-original.jpg', alt: 'Pakistani woman wearing a grey outfit', url: 'assets/images/ready-to-wear.webp' },
    { id: 3, fileName: 'sahar-original.jpg', alt: 'Pakistani woman in a beige outfit', url: 'assets/images/sahar.webp' },
    { id: 4, fileName: 'mehr-un-nisa-original.jpg', alt: 'Pakistani woman in grey embroidered suit', url: 'assets/images/mehr-un-nisa.webp' },
    { id: 5, fileName: 'luxury-lawn-original.jpg', alt: 'Pakistani woman styling a green outfit', url: 'assets/images/luxury-lawn.webp' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      sku: ['', Validators.required],
      regularPrice: ['', [Validators.required, Validators.min(0)]],
      salePrice: ['', Validators.min(0)],
      stock: [1, [Validators.required, Validators.min(0)]],
      category: ['Luxury Lawn', Validators.required],
      description: [''],
      active: [true]
    });
  }

  // --- Featured Image Triggers ---
  openFeaturedMediaDrawer() {
    this.targetForMedia = 'featured';
    this.activeDrawer = 'select-media';
  }

  // Direct Desktop Upload for Featured Image
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

  // --- Gallery Image Triggers ---
  openGalleryMediaDrawer() {
    this.targetForMedia = 'gallery';
    this.activeDrawer = 'select-media';
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

  removeGalleryImage(index: number) {
    this.galleryImages.splice(index, 1);
  }

  onSave() {
    if (this.productForm.valid) {
      const formData = {
        ...this.productForm.value,
        featuredImage: this.featuredImagePreview,
        gallery: this.galleryImages
      };
      console.log('Product Saved:', formData);
      this.router.navigate(['/admin/products']);
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}
