import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-provider-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './provider-layout.html',
  styleUrl: './provider-layout.scss'
})
export class ProviderLayout {}
