
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormsModule
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { Media } from '../../../../../core/services/media/media';
import { CategoryPayload, CategoryService } from '../../../../../core/services/category/categoryservice';

interface MediaItem {
  id: number;
  file_name: string;
  file_path: string;
  alt: string;
  folder: string;
  tags: string;
  url: string;
}

@Component({
  selector: 'app-category-create',
  imports: [CommonModule, ReactiveFormsModule, FormsModule , RouterModule],
  templateUrl: './category-create.html',
  styleUrl: './category-create.css',
})
export class CategoryCreate implements OnInit {

  categoryForm: FormGroup;

  activeDrawer: 'none' | 'create-media' | 'select-media' = 'none';

  // Selected image preview
  selectedImagePreview: string | null = null;
  selectedMedia: MediaItem | null = null;

  // Media Library
  existingMediaItems: MediaItem[] = [];

  // New Media Form
  newMediaForm: FormGroup;
  newMediaPreview: string | null = null;
  newMediaFile: File | null = null;

  uploadingMedia = false;
  loadingMedia = false;
  mediaError = '';

  // Change this to your production storage URL when deploying.
  private storageUrl = 'http://127.0.0.1:8000/storage';

  constructor(
      private fb: FormBuilder,
  private router: Router,
  private mediaService: Media,
  private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
      image: [null],
      featured: [false]
    });

    this.newMediaForm = this.fb.group({
      folder: ['None'],
      alt: ['', Validators.required],
      tags: ['None']
    });
  }

  ngOnInit(): void {
    this.loadMedia();
  }

  get altControl(): FormControl {
    return this.newMediaForm.get('alt') as FormControl;
  }

  // Load media from Laravel database
  loadMedia(): void {
    this.loadingMedia = true;

    this.mediaService.getMedia().subscribe({
      next: (response: any) => {
        const result = response.data;

        const items = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        this.existingMediaItems = items.map((item: any) =>
          this.formatMedia(item)
        );

        this.loadingMedia = false;
      },
      error: (error: any) => {
        console.error('Media loading failed:', error);
        this.mediaError = 'Unable to load media library.';
        this.loadingMedia = false;
      }
    });
  }

  // Normalize Laravel media response
  private formatMedia(item: any): MediaItem {
    return {
      id: item.id,
      file_name: item.file_name || item.fileName || '',
      file_path: item.file_path || '',
      alt: item.alt || '',
      folder: item.folder || 'None',
      tags: item.tags || 'None',
      url: item.url || this.getMediaUrl(item.file_path)
    };
  }

  // Generate URL if API doesn't return one
  getMediaUrl(path: string): string {
    if (!path) return '';

    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    return `${this.storageUrl}/${path.replace(/^\/+/, '')}`;
  }

  // Open drawers
  openCreateMediaDrawer(): void {
    this.activeDrawer = 'create-media';

    this.newMediaForm.reset({
      folder: 'None',
      alt: '',
      tags: 'None'
    });

    this.newMediaPreview = null;
    this.newMediaFile = null;
    this.mediaError = '';
  }

  openSelectMediaDrawer(): void {
    this.activeDrawer = 'select-media';
    this.loadMedia();
  }

  closeDrawer(): void {
    this.activeDrawer = 'none';
  }

  // Select image file
  onNewMediaFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.mediaError = 'Please select a valid image.';
      input.value = '';
      return;
    }

    this.newMediaFile = file;
    this.mediaError = '';

    const reader = new FileReader();

    reader.onload = () => {
      this.newMediaPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  // Upload image to Laravel Media API
  saveNewMedia(): void {
    if (!this.newMediaFile) {
      this.mediaError = 'Please select an image first.';
      return;
    }

    if (this.newMediaForm.invalid) {
      this.newMediaForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    formData.append('file', this.newMediaFile);
    formData.append('alt', this.newMediaForm.value.alt);
    formData.append('folder', this.newMediaForm.value.folder || 'None');

    this.uploadingMedia = true;
    this.mediaError = '';

    this.mediaService.uploadMedia(formData).subscribe({
      next: (response: any) => {
        // Supports {data: media} and {data: {data: media}}
        const uploaded = response.data?.data || response.data;

        if (!uploaded?.id) {
          this.mediaError = 'Upload succeeded but media details were not returned.';
          this.uploadingMedia = false;
          return;
        }

        const media = this.formatMedia(uploaded);

        // Add uploaded image to Media Library
        this.existingMediaItems.unshift(media);

        // Automatically select uploaded image
        this.selectMedia(media);

        this.uploadingMedia = false;
        this.newMediaFile = null;
        this.newMediaPreview = null;
      },
      error: (error: any) => {
        console.error('Media upload failed:', error);

        this.mediaError =
          error.error?.message || 'Image upload failed. Please try again.';

        this.uploadingMedia = false;
      }
    });
  }

  // Select existing or newly uploaded media
  selectMedia(media: MediaItem): void {
    this.selectedMedia = media;
    this.selectedImagePreview = media.url;

    // Preview only. This value is not submitted when creating category.
    this.categoryForm.patchValue({
      image: media.url
    });

    this.closeDrawer();
  }

  // Remove selected preview
  removeSelectedImage(): void {
    this.selectedImagePreview = null;
    this.selectedMedia = null;

    this.categoryForm.patchValue({
      image: null
    });
  }

  // Save category without image
 onSaveCategory(): void {
  if (this.categoryForm.invalid) {
    this.categoryForm.markAllAsTouched();
    return;
  }

  const payload: CategoryPayload = {
    name: this.categoryForm.value.name,
    slug: this.categoryForm.value.slug,
    image: this.categoryForm.value.image,
    description: this.categoryForm.value.description,
    is_active: true
  };

  this.categoryService.createCategory(payload).subscribe({
    next: (response) => {
      console.log('Category created successfully:', response);

      this.router.navigate(['/admin/categories']);
    },
    error: (error) => {
      console.error('Category creation failed:', error);

      if (error.error?.errors) {
        console.log('Validation errors:', error.error.errors);
      }
    }
  });
}
}
