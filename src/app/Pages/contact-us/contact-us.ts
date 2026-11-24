import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css',
})
export class ContactUs {

  submitted = false;
  successMessage = '';
  errorMessage = '';

  contactForm;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  submitForm(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formData = this.contactForm.getRawValue();

    console.log('Contact form data:', formData);

    // Connect your Laravel contact API here.
    // Example: this.contactService.submitContact(formData)

    this.successMessage = 'Thank you! Your message has been received.';
    this.contactForm.reset();
    this.submitted = false;
  }
}
