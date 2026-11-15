
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  CategoryService,
  Category,
  CategoryPayload
} from '../../../../../core/services/category/categoryservice';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.css'
})
export class CategoryEdit implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoryService = inject(CategoryService);

  categoryId!: number;

  loading = true;
  saving = false;

  errorMessage = '';
  successMessage = '';

  categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    slug: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    image: [''],
    is_active: [true]
  });

  constructor(    private cdr: ChangeDetectorRef){}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || Number.isNaN(id)) {
      this.errorMessage = 'Invalid category ID.';
      this.loading = false;
      return;
    }

    this.categoryId = id;
    this.loadCategory();
  }

  loadCategory(): void {
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (response: any) => {
        const category: Category = response?.data ?? response;

        if (!category) {
          this.errorMessage = 'Category not found.';
          this.loading = false;
          return;
        }

        this.categoryForm.patchValue({
          name: category.name ?? '',
          slug: category.slug ?? '',
          description: category.description ?? '',
          image: category.image ?? '',
          is_active: Boolean(category.is_active)
        });

        this.loading = false;
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.error('Category loading error:', error);
        this.errorMessage =
          error?.error?.message || 'Unable to load category.';
        this.loading = false;
      }
    });
  }

  updateCategory(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: CategoryPayload = {
      name: this.categoryForm.value.name?.trim() || '',
      slug: this.categoryForm.value.slug?.trim() || '',
      description: this.categoryForm.value.description || '',
      image: this.categoryForm.value.image?.trim() || '',
      is_active: Boolean(this.categoryForm.value.is_active)
    };

    this.categoryService.updateCategory(this.categoryId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Category updated successfully.';

        setTimeout(() => {
          this.router.navigate(['/panel/categories']);
        }, 800);
      },
      error: (error) => {
        console.error('Category update error:', error);
        this.saving = false;
        this.errorMessage =
          error?.error?.message || 'Unable to update category.';
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/panel/categories']);
  }

  get imageUrl(): string {
    return this.categoryForm.get('image')?.value || '';
  }
}
