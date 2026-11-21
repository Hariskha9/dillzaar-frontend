import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-body',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {}
