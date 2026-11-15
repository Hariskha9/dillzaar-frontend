
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';


import { Product } from '../../../../../core/services/product/product';
import { Media } from '../../../../../core/services/media/media';

interface MediaItem {
  id: number;
  file_name: string;
  file_path: string;
  alt: string;
  url: string;
}

@Component({
  selector: 'app-product-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css',
})
export class ProductCreate implements OnInit {

  productForm: FormGroup;

  loading = false;
  mediaLoading = false;

  errorMessage = '';
  successMessage = '';

  // Featured image
  featuredImagePreview: string | null = null;
  featuredImagePath: string | null = null;
  featuredMediaId: number | null = null;

  // Gallery
  galleryImages: string[] = [];
  galleryPaths: string[] = [];
  galleryMediaIds: number[] = [];

  // Drawer
  activeDrawer: 'none' | 'create-media' | 'select-media' = 'none';

  targetForMedia: 'featured' | 'gallery' = 'gallery';

  // New media
  newMediaFile: File | null = null;
  newMediaPreview: string | null = null;
  newMediaAlt = '';

  // Media library
  existingMediaItems: MediaItem[] = [];

  // Categories must contain IDs from your categories table.
  categories: { id: number; name: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: Product,
    private mediaService: Media
  ) {

    this.productForm = this.fb.group({

      name: ['', Validators.required],

      slug: [''],

      sku: ['', Validators.required],

      regular_price: ['', [
        Validators.required,
        Validators.min(0)
      ]],

      sale_price: ['', [
        Validators.min(0)
      ]],

      stock_quantity: [1, [
        Validators.required,
        Validators.min(0)
      ]],

      category_id: [null],

      description: [''],

      is_active: [true]

    });

  }

  ngOnInit(): void {

    this.loadMedia();

    // Automatically generate slug
    this.productForm.get('name')?.valueChanges.subscribe(name => {

      const slug = this.generateSlug(name || '');

      this.productForm.patchValue(
        { slug },
        { emitEvent: false }
      );

    });

  }

  // ---------------------------------
  // SLUG GENERATOR
  // ---------------------------------

  generateSlug(name: string): string {

    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  }

  // ---------------------------------
  // LOAD MEDIA LIBRARY
  // ---------------------------------

  loadMedia(): void {

    this.mediaLoading = true;

    this.mediaService.getMedia().subscribe({

      next: (response: any) => {

        const result = response.data;

        this.existingMediaItems = Array.isArray(result)
          ? result
          : result?.data || [];

        this.mediaLoading = false;

      },

      error: (error: any) => {

        console.error('Media loading error:', error);

        this.mediaLoading = false;

      }

    });

  }

  // ---------------------------------
  // IMAGE URL
  // ---------------------------------

  getMediaUrl(path: string): string {

    if (!path) return '';

    if (path.startsWith('http')) {
      return path;
    }

    return `http://127.0.0.1:8000/storage/${path}`;

  }

  // ---------------------------------
  // FEATURED IMAGE
  // ---------------------------------

  openFeaturedMediaDrawer(): void {

    this.targetForMedia = 'featured';

    this.activeDrawer = 'select-media';

    this.loadMedia();

  }

  onFeaturedDesktopFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select an image file.';
      input.value = '';
      return;
    }

    this.uploadImageToMedia(file, 'featured');

    input.value = '';

  }

  removeFeaturedImage(): void {

    this.featuredImagePreview = null;

    this.featuredImagePath = null;

    this.featuredMediaId = null;

  }

  // ---------------------------------
  // GALLERY
  // ---------------------------------

  openGalleryMediaDrawer(): void {

    this.targetForMedia = 'gallery';

    this.activeDrawer = 'select-media';

    this.loadMedia();

  }

  removeGalleryImage(index: number): void {

    this.galleryImages.splice(index, 1);

    this.galleryPaths.splice(index, 1);

    this.galleryMediaIds.splice(index, 1);

  }

  // ---------------------------------
  // DRAWER
  // ---------------------------------

  openCreateMediaDrawer(): void {

    this.activeDrawer = 'create-media';

    this.newMediaPreview = null;

    this.newMediaFile = null;

    this.newMediaAlt = '';

  }

  closeDrawer(): void {

    this.activeDrawer = 'none';

  }

  onDrawerFileSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select an image file.';
      input.value = '';
      return;
    }

    this.newMediaFile = file;

    const reader = new FileReader();

    reader.onload = () => {

      this.newMediaPreview = reader.result as string;

    };

    reader.readAsDataURL(file);

  }

  // ---------------------------------
  // UPLOAD NEW MEDIA
  // ---------------------------------

  uploadImageToMedia(
    file: File,
    target: 'featured' | 'gallery'
  ): void {

    const formData = new FormData();

    formData.append('file', file);

    formData.append(
      'alt',
      this.newMediaAlt || file.name.replace(/\.[^/.]+$/, '')
    );

    formData.append('folder', 'products');

    this.loading = true;

    this.mediaService.uploadMedia(formData).subscribe({

      next: (response: any) => {

        const media = response.data;

        this.assignMedia(media);

        this.loading = false;

        this.newMediaFile = null;

        this.newMediaPreview = null;

        this.newMediaAlt = '';

        this.activeDrawer = 'none';

      },

      error: (error: any) => {

        console.error('Media upload error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to upload image.';

        this.loading = false;

      }

    });

  }

  // Save image from Create Media drawer
  saveNewMedia(): void {

    if (!this.newMediaFile) {

      this.errorMessage = 'Please select an image first.';

      return;

    }

    if (!this.newMediaAlt.trim()) {

      this.errorMessage = 'Please enter image alt text.';

      return;

    }

    this.uploadImageToMedia(
      this.newMediaFile,
      this.targetForMedia
    );

  }

  // ---------------------------------
  // SELECT EXISTING MEDIA
  // ---------------------------------

  selectExistingMedia(media: MediaItem): void {

    this.assignMedia(media);

    this.closeDrawer();

  }

  // ---------------------------------
  // ASSIGN MEDIA TO PRODUCT
  // ---------------------------------

  assignMedia(media: MediaItem): void {

    const path = media.file_path;

    const url = media.url || this.getMediaUrl(path);

    if (!path) {

      this.errorMessage = 'Media file path is missing.';

      return;

    }

    if (this.targetForMedia === 'featured') {

      this.featuredImagePreview = url;

      this.featuredImagePath = path;

      this.featuredMediaId = media.id;

    } else {

      if (!this.galleryPaths.includes(path)) {

        this.galleryImages.push(url);

        this.galleryPaths.push(path);

        this.galleryMediaIds.push(media.id);

      }

    }

  }

  // ---------------------------------
  // SAVE PRODUCT
  // ---------------------------------

  
onSave(): void {

  this.errorMessage = '';

  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  if (this.loading) return;

  const formValue = this.productForm.value;

  const formData = new FormData();

  formData.append('name', formValue.name);
  formData.append('slug', formValue.slug || '');
  formData.append('sku', formValue.sku);
  formData.append('description', formValue.description || '');

  formData.append(
    'category_id',
    formValue.category_id || ''
  );

  formData.append(
    'regular_price',
    formValue.regular_price
  );

  formData.append(
    'sale_price',
    formValue.sale_price || ''
  );

  formData.append(
    'stock_quantity',
    formValue.stock_quantity
  );

  formData.append(
    'is_active',
    formValue.is_active ? '1' : '0'
  );

  // Send existing media paths, not image files
  if (this.featuredImagePath) {
    formData.append(
      'featured_image',
      this.featuredImagePath
    );
  }

  this.galleryPaths.forEach((path, index) => {
    formData.append(`gallery_images[${index}]`, path);
  });

  this.loading = true;

  this.productService.createProduct(formData).subscribe({

    next: (response: any) => {

      this.loading = false;

      this.router.navigate(['/admin/products']);

    },

    error: (error: any) => {

      console.error('Product save error:', error);

      this.loading = false;

      this.errorMessage =
        error.error?.message || 'Unable to save product.';

    }

  });

}


}
