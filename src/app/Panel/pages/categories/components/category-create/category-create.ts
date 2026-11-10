import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

interface MediaItem {
  id: number;
  fileName: string;
  alt: string;
  folder: string;
  tags: string;
  url: string;
}


@Component({
  selector: 'app-category-create',
  imports: [CommonModule, ReactiveFormsModule, RouterModule,],
  templateUrl: './category-create.html',
  styleUrl: './category-create.css',
})
export class CategoryCreate {
categoryForm: FormGroup;
  
  // Drawer states: 'none' | 'create-media' | 'select-media'
  activeDrawer: 'none' | 'create-media' | 'select-media' = 'none';

  // Selected image preview for the category
  selectedImagePreview: string | null = null;

  // New Media Form state
  newMediaForm: FormGroup;
  newMediaPreview: string | null = null;

  // Existing Media Library Data matching your screenshot
  existingMediaItems: MediaItem[] = [
    { id: 1, fileName: 'zareen-formal-original.jpg', alt: 'Pakistani formal black embroidered ensemble', folder: 'None', tags: 'None', url: 'assets/images/zareen.webp' },
    { id: 2, fileName: 'ready-to-wear-original.jpg', alt: 'Pakistani woman wearing a grey outfit and embroidered dupatta', folder: 'None', tags: 'None', url: 'assets/images/ready-to-wear.webp' },
    { id: 3, fileName: 'sahar-original.jpg', alt: 'Pakistani woman in a beige embroidered outfit and pink dupatta', folder: 'None', tags: 'None', url: 'assets/images/sahar.webp' },
    { id: 4, fileName: 'mehr-un-nisa-original.jpg', alt: 'Pakistani woman in grey embroidered three piece suit', folder: 'None', tags: 'None', url: 'assets/images/mehr-un-nisa.webp' },
    { id: 5, fileName: 'luxury-lawn-original.jpg', alt: 'Pakistani woman styling a green outfit with white dupatta', folder: 'None', tags: 'None', url: 'assets/images/luxury-lawn.webp' }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
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

  // Add this getter inside your CategoryCreateComponent class
get altControl(): FormControl {
  return this.newMediaForm.get('alt') as FormControl;
}

  // Open Drawers
  openCreateMediaDrawer() {
    this.activeDrawer = 'create-media';
    this.newMediaForm.reset({ folder: 'None', tags: 'None' });
    this.newMediaPreview = null;
  }

  openSelectMediaDrawer() {
    this.activeDrawer = 'select-media';
  }

  closeDrawer() {
    this.activeDrawer = 'none';
  }

  // Handle file selection in Create New Media drawer
  onNewMediaFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newMediaPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Save new media item and attach it to category
  saveNewMedia() {
    if (this.newMediaForm.valid && this.newMediaPreview) {
      const newMedia: MediaItem = {
        id: this.existingMediaItems.length + 1,
        fileName: 'custom-upload-' + Date.now() + '.jpg',
        alt: this.newMediaForm.value.alt,
        folder: this.newMediaForm.value.folder,
        tags: this.newMediaForm.value.tags,
        url: this.newMediaPreview
      };
      this.existingMediaItems.unshift(newMedia);
      this.selectMedia(newMedia);
    }
  }

  // Select an item from the existing media list
  selectMedia(media: MediaItem) {
    this.selectedImagePreview = media.url;
    this.categoryForm.patchValue({ image: media.url });
    this.closeDrawer();
  }

  removeSelectedImage() {
    this.selectedImagePreview = null;
    this.categoryForm.patchValue({ image: null });
  }

  onSaveCategory() {
    if (this.categoryForm.valid) {
      console.log('Category Saved:', this.categoryForm.value);
      this.router.navigate(['/admin/categories']);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
