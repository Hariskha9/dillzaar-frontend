
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { CategoryService } from '../../../../../core/services/category/categoryservice';
import { forkJoin } from 'rxjs';

import { Typeservice, TypeData } from '../../../../../core/services/type/typeservice';
import { Fabricservice, FabricData } from '../../../../../core/services/fabric/fabricservice';
import { Collectionservice, CollectionData } from '../../../../../core/services/collection/collectionservice';
import { Seasonservice, SeasonData } from '../../../../../core/services/season/seasonservice';

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


  types: TypeData[] = [];
fabrics: FabricData[] = [];
collections: CollectionData[] = [];
seasons: SeasonData[] = [];

loadingAttributes = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: Product,
    private mediaService: Media,
    private categoryService: CategoryService,
     private typeService: Typeservice,
  private fabricService: Fabricservice,
  private collectionService: Collectionservice,
  private seasonService: Seasonservice,
    private cdr: ChangeDetectorRef
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
      type_id: [null],
fabric_id: [null],
collection_id: [null],
season_id: [null],
short_description: [''],

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

    this.loadCategories();
this.loadProductAttributes();
  }





  loadProductAttributes(): void {
  this.loadingAttributes = true;

  forkJoin({
    types: this.typeService.getTypes(),
    fabrics: this.fabricService.getFabrics(),
    collections: this.collectionService.getCollections(),
    seasons: this.seasonService.getSeasons()
  }).subscribe({
    next: (response) => {
      this.types = response.types?.data || [];
      this.fabrics = response.fabrics?.data || [];
      this.collections = response.collections?.data || [];
      this.seasons = response.seasons?.data || [];

      this.loadingAttributes = false;
    },
    error: (error) => {
      console.error('Unable to load product attributes:', error);
      this.loadingAttributes = false;
    }
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


 loadCategories(): void {
    this.categoryService.getCategories(1, 100).subscribe({
      next: (response: any) => {
        const result = response?.data;

        this.categories = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

            console.log('check 1', this.categories)
      },
      error: (error) => {
        console.error('Categories loading error:', error);
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

    return `https://khanibykhanam.pk/api/storage/app/public/${path}`;

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
            this.cdr.detectChanges();

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

    formData.append(
  'type_id',
  this.productForm.value.type_id || ''
);

formData.append(
  'fabric_id',
  this.productForm.value.fabric_id || ''
);

formData.append(
  'collection_id',
  this.productForm.value.collection_id || ''
);

formData.append(
  'season_id',
  this.productForm.value.season_id || ''
);

formData.append(
  'short_description',
  this.productForm.value.short_description || ''
);

    this.loading = true;

    this.mediaService.uploadMedia(formData).subscribe({

      next: (response: any) => {

        const media = response.data;

        if (!media?.url) {
  this.errorMessage = 'Image URL was not returned.';
  this.loading = false;
  return;
}

        this.assignMedia(media.url);

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
  // saveNewMedia(): void {

  //   if (!this.newMediaFile) {

  //     this.errorMessage = 'Please select an image first.';

  //     return;

  //   }

  //   if (!this.newMediaAlt.trim()) {

  //     this.errorMessage = 'Please enter image alt text.';

  //     return;

  //   }

  //   this.uploadImageToMedia(
  //     this.newMediaFile,
  //     this.targetForMedia
  //   );

  // }


  saveNewMedia(): void {
  if (!this.newMediaFile) {
    this.errorMessage = 'Please select an image.';
    return;
  }

  const formData = new FormData();

  formData.append('file', this.newMediaFile);
  formData.append('alt', this.newMediaAlt || '');

  this.mediaLoading = true;

  this.mediaService.uploadMedia(formData).subscribe({
    next: (response: any) => {
      this.mediaLoading = false;

      const media = response?.data;

      if (!media?.url) {
        this.errorMessage = 'Image uploaded, but image URL was not returned.';
        return;
      }

      this.assignMedia(media.url);

      this.newMediaFile = null;
      this.newMediaPreview = null;
      this.newMediaAlt = '';
        this.closeDrawer();
            this.loadMedia();
        this.cdr.detectChanges();

    },
    error: (error: any) => {
      this.mediaLoading = false;

      console.error('Media upload error:', error);

      this.errorMessage =
        error?.error?.message || 'Unable to upload image.';
    }
  });
}

  // ---------------------------------
  // SELECT EXISTING MEDIA
  // ---------------------------------

  selectExistingMedia(media: MediaItem): void {

    this.assignMedia(media.url);

  }

  // ---------------------------------
  // ASSIGN MEDIA TO PRODUCT
  // ---------------------------------

  // assignMedia(media: MediaItem): void {

  //   const path = media.file_path;

  //   const url = media.url || this.getMediaUrl(path);

  //   if (!path) {

  //     this.errorMessage = 'Media file path is missing.';

  //     return;

  //   }

  //   if (this.targetForMedia === 'featured') {

  //     this.featuredImagePreview = url;

  //     this.featuredImagePath = path;

  //     this.featuredMediaId = media.id;

  //   } else {

  //     if (!this.galleryPaths.includes(path)) {

  //       this.galleryImages.push(url);

  //       this.galleryPaths.push(path);

  //       this.galleryMediaIds.push(media.id);

  //     }

  //   }

  // }

 assignMedia(url: string): void {
    if (this.targetForMedia === 'featured') {
      this.featuredImagePreview = url;
      this.featuredImagePath = url;
    } else {
      if (!this.galleryImages.includes(url)) {
        this.galleryImages.push(url);
      }
    }

    this.closeDrawer();
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

      formData.append('type_id', formValue.type_id || '');
formData.append('fabric_id', formValue.fabric_id || '');
formData.append('collection_id', formValue.collection_id || '');
formData.append('season_id', formValue.season_id || '');
formData.append(
  'short_description',
  formValue.short_description || ''
);

  // Send existing media paths, not image files
  if (this.featuredImagePath) {
    formData.append(
      'featured_image',
      this.featuredImagePath
    );
  }

  // this.galleryPaths.forEach((path, index) => {
  //   formData.append(`gallery_images[${index}]`, path);
  // });

    // Gallery image paths
    this.galleryImages.forEach((image) => {
      formData.append('gallery_images[]', image);
    });

  this.loading = true;

  this.productService.createProduct(formData).subscribe({

    next: (response: any) => {

      this.loading = false;

      this.router.navigate(['/panel/products']);

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
