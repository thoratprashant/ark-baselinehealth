import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CareJourney } from '../dashboard/care-journey/care-journey';

@Component({
  selector: 'app-dashboard-day-one',
  imports: [RouterLink, CareJourney],
  templateUrl: './dashboard-day-one.html',
  styleUrl: './dashboard-day-one.scss',
})
export class DashboardDayOne {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly showAssessmentStatus = signal(true);

  constructor() {
    const view = this.document.defaultView;

    if (!view) {
      return;
    }

    const statusTimer = view.setTimeout(() => this.showAssessmentStatus.set(false), 5000);
    this.destroyRef.onDestroy(() => view.clearTimeout(statusTimer));
  }
}
