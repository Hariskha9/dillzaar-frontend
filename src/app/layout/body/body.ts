import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../header/header';

@Component({
  selector: 'app-body',
  imports: [RouterOutlet, Header],
  templateUrl: './body.html',
  styleUrl: './body.css',
})
export class Body {}
