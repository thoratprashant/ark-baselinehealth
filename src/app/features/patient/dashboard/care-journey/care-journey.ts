import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, input, signal, untracked } from '@angular/core';

interface JourneyStep {
  label: string;
  completeLabel: string;
}

@Component({
  selector: 'app-care-journey',
  templateUrl: './care-journey.html',
  styleUrl: './care-journey.scss'
})
export class CareJourney {
  private readonly document = inject(DOCUMENT);

  readonly activeStep = input(1);
  protected readonly animatedProgress = signal(0);
  protected readonly displayedProgress = signal(0);
  protected readonly steps: readonly JourneyStep[] = [
    { label: 'Intake Assessment', completeLabel: 'Completed' },
    { label: 'Medication Request', completeLabel: 'Active' },
    { label: 'Membership & Payment', completeLabel: 'Upcoming' },
    { label: 'Doctor Review', completeLabel: 'Upcoming' },
    { label: 'Prescription Sent', completeLabel: 'Upcoming' }
  ];

  constructor() {
    effect((onCleanup) => {
      const target = Math.min(100, Math.max(0, this.activeStep() * 20));
      const cancel = this.animateProgress(target);
      onCleanup(cancel);
    });
  }

  protected stepState(index: number): 'completed' | 'active' | 'upcoming' {
    if (index < this.activeStep()) {
      return 'completed';
    }

    return index === this.activeStep() ? 'active' : 'upcoming';
  }

  protected statusLabel(index: number): string {
    const state = this.stepState(index);
    return state === 'completed' ? 'Completed' : state === 'active' ? 'Active' : 'Upcoming';
  }

  private animateProgress(target: number): () => void {
    const view = this.document.defaultView;
    const start = untracked(() => this.animatedProgress());

    if (!view?.requestAnimationFrame || !view.cancelAnimationFrame) {
      this.animatedProgress.set(target);
      this.displayedProgress.set(target);
      return () => undefined;
    }

    const reducedMotion = view.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      this.animatedProgress.set(target);
      this.displayedProgress.set(target);
      return () => undefined;
    }

    const difference = target - start;
    const duration = 700;
    let frame = 0;
    let startedAt: number | undefined;

    const update = (timestamp: number): void => {
      startedAt ??= timestamp;
      const elapsed = Math.min((timestamp - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const value = start + difference * eased;

      this.animatedProgress.set(value);
      this.displayedProgress.set(Math.round(value));

      if (elapsed < 1) {
        frame = view.requestAnimationFrame(update);
      } else {
        this.animatedProgress.set(target);
        this.displayedProgress.set(target);
      }
    };

    frame = view.requestAnimationFrame(update);
    return () => view.cancelAnimationFrame(frame);
  }
}
