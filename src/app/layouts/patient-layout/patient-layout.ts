import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-patient-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgbDropdownModule],
  templateUrl: './patient-layout.html',
  styleUrl: './patient-layout.scss'
})
export class PatientLayout {
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly mobileMenuOpen = signal(false);
  protected readonly showDesktopSidebar = signal(this.isMedicationRoute(this.router.url));

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.showDesktopSidebar.set(this.isMedicationRoute(event.urlAfterRedirects));
        this.mobileMenuOpen.set(false);
      });
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  private isMedicationRoute(url: string): boolean {
    return !url.includes('/patient/dashboard-day-one');
  }
}
