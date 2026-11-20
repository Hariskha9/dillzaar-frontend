
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

import { Product } from '../../../../../core/services/product/product';
import { CategoryService, Category } from '../../../../../core/services/category/categoryservice';
import { Media } from '../../../../../core/services/media/media';
import { forkJoin } from 'rxjs';

import { Typeservice, TypeData } from '../../../../../core/services/type/typeservice';
import { Fabricservice, FabricData } from '../../../../../core/services/fabric/fabricservice';
import { Collectionservice, CollectionData } from '../../../../../core/services/collection/collectionservice';
import { Seasonservice, SeasonData } from '../../../../../core/services/season/seasonservice';


interface MediaItem {
  id: number;
  fileName: string;
  alt: string;
  url: string;
}

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css',
})
export class ProductEdit implements OnInit {
  productForm: FormGroup;
  productId: number | null = null;

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  // Image states
  featuredImagePreview: string | null = null;
  featuredImagePath: string | null = null;

  galleryImages: string[] = [];

  // Drawer controls
  activeDrawer: 'none' | 'create-media' | 'select-media' = 'none';
  targetForMedia: 'featured' | 'gallery' = 'gallery';

    mediaLoading = false;

  newMediaFile: File | null = null;
  newMediaPreview: string | null = null;
  newMediaAlt = '';

  categories: Category[] = [];

  // Keep your existing media drawer data for now
  existingMediaItems: MediaItem[] = [];

  types: TypeData[] = [];
fabrics: FabricData[] = [];
collections: CollectionData[] = [];
seasons: SeasonData[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: Product,
    private categoryService: CategoryService,
     private mediaService: Media,
      private typeService: Typeservice,
  private fabricService: Fabricservice,
  private collectionService: Collectionservice,
  private seasonService: Seasonservice,
  private cdr: ChangeDetectorRef
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
      active: [true],
      type_id: [null],
fabric_id: [null],
collection_id: [null],
season_id: [null],
short_description: ['']
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.errorMessage = 'Invalid product ID.';
      return;
    }

    this.productId = id;

    this.loadCategories();
    this.loadProduct();
    this.loadMedia();
    this.loadProductAttributes();
  }



  loadProductAttributes(): void {
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
     this.setProductAttributes();
      
    },
    error: (error) => {
      console.error('Unable to load product attributes:', error);
    }
  });
}

productData: any = null;

setProductAttributes(): void {
  if (!this.productData) return;

  this.productForm.patchValue({
    type_id: this.productData.type_id
      ? Number(this.productData.type_id)
      : null,

    fabric_id: this.productData.fabric_id
      ? Number(this.productData.fabric_id)
      : null,

    collection_id: this.productData.collection_id
      ? Number(this.productData.collection_id)
      : null,

    season_id: this.productData.season_id
      ? Number(this.productData.season_id)
      : null
  });
}



  // -----------------------------
  // Load Categories
  // -----------------------------
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

  // -----------------------------
  // Get Product By ID
  // -----------------------------
  loadProduct(): void {
    if (!this.productId) return;

    this.loading = true;
    this.errorMessage = '';

    this.productService.getProduct(this.productId).subscribe({
      next: (response: any) => {
        const product = response?.data ?? response;
this.productData = product;
        if (!product) {
          this.errorMessage = 'Product not found.';
          this.loading = false;
          return;
        }

        // Patch product fields into form
        this.productForm.patchValue({
          name: product.name ?? '',
          slug: product.slug ?? '',
          sku: product.sku ?? '',
          regularPrice: product.regular_price ?? '',
          salePrice: product.sale_price ?? '',
          stock: product.stock_quantity ?? 0,
          category: product.category_id ?? '',
          description: product.description ?? '',
          active: Boolean(product.is_active),
           type_id: product.type_id ?? null,
  fabric_id: product.fabric_id ?? null,
  collection_id: product.collection_id ?? null,
  season_id: product.season_id ?? null,
  short_description: product.short_description ?? ''
        });

        // Load featured image
        this.featuredImagePath = product.featured_image ?? null;
        this.featuredImagePreview = product.featured_image ?? null;

        // Load gallery images
        let gallery: any = product.gallery_images ?? [];

        // Handle JSON string response if applicable
        if (typeof gallery === 'string') {
          try {
            gallery = JSON.parse(gallery);
          } catch {
            gallery = gallery ? [gallery] : [];
          }
        }

        this.galleryImages = Array.isArray(gallery)
          ? [...gallery]
          : [];

        this.loading = false;
      },
      error: (error) => {
        console.error('Product loading error:', error);
        this.errorMessage =
          error?.error?.message || 'Unable to load product.';
        this.loading = false;
      }
    });
  }

  // -----------------------------
  // Featured Image
  // -----------------------------
  openFeaturedMediaDrawer(): void {
    this.targetForMedia = 'featured';
    this.activeDrawer = 'select-media';
  }

  onFeaturedDesktopFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.featuredImagePreview = reader.result as string;
      this.featuredImagePath = null;
    };

    reader.readAsDataURL(file);
  }

  removeFeaturedImage(): void {
    this.featuredImagePreview = null;
    this.featuredImagePath = null;
  }

  // -----------------------------
  // Gallery Images
  // -----------------------------
  openGalleryMediaDrawer(): void {
    this.targetForMedia = 'gallery';
    this.activeDrawer = 'select-media';
  }

  removeGalleryImage(index: number): void {
    this.galleryImages.splice(index, 1);
    this.galleryImages = [...this.galleryImages];
  }

  // -----------------------------
  // Drawer Management
  // -----------------------------
  openCreateMediaDrawer(): void {
    this.activeDrawer = 'create-media';
    this.newMediaPreview = null;
    this.newMediaAlt = '';
  }

  closeDrawer(): void {
    this.activeDrawer = 'none';
  }

  onDrawerFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

      this.newMediaFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.newMediaPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
            this.cdr.detectChanges();

  }

  // saveNewMedia(): void {
  //   if (!this.newMediaPreview) return;

  //   // This is a local preview only.
  //   // Upload the file through your Media API to get a permanent path.
  //   this.assignMedia(this.newMediaPreview);
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

  selectExistingMedia(media: MediaItem): void {
    this.assignMedia(media.url);
  }

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

  // -----------------------------
  // Update Product
  // -----------------------------
  onUpdate(): void {
    if (!this.productId) return;

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.productForm.value;

    const formData = new FormData();

    formData.append('name', formValue.name || '');
    formData.append('slug', formValue.slug || '');
    formData.append('sku', formValue.sku || '');
    formData.append('description', formValue.description || '');
    formData.append('category_id', String(formValue.category || ''));
    formData.append('regular_price', String(formValue.regularPrice ?? 0));
    formData.append('sale_price', String(formValue.salePrice ?? 0));
    formData.append('stock_quantity', String(formValue.stock ?? 0));
    formData.append('is_active', formValue.active ? '1' : '0');
    formData.append('type_id', formValue.type_id || '');
formData.append('fabric_id', formValue.fabric_id || '');
formData.append('collection_id', formValue.collection_id || '');
formData.append('season_id', formValue.season_id || '');
formData.append(
  'short_description',
  formValue.short_description || ''
);

    // Featured image path
    if (this.featuredImagePreview) {
      formData.append(
  'featured_image',
  this.featuredImagePath || ''
);
    } else {
      formData.append('featured_image', '');
    }

    // Gallery image paths
    this.galleryImages.forEach((image) => {
      formData.append('gallery_images[]', image);
    });

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: (response: any) => {
        this.saving = false;
        this.successMessage =
          response?.message || 'Product updated successfully.';

        setTimeout(() => {
          this.router.navigate(['/panel/products']);
        }, 1000);
                this.cdr.detectChanges();

      },
      error: (error) => {
        console.error('Product update error:', error);
        this.saving = false;
        this.errorMessage =
          error?.error?.message || 'Unable to update product.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/panel/products']);
  }
}
