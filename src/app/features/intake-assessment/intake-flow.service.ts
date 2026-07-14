import { Injectable, signal } from '@angular/core';

export type IntakeFlowDirection = 'forward' | 'back' | 'none';

export const ASSESSMENT_TOTAL_STEPS = 14;

export const INTAKE_SECTIONS = [
  { id: 'welcome' },
  { id: 'wellbeing' }
] as const;

@Injectable({ providedIn: 'root' })
export class IntakeFlowService {
  readonly direction = signal<IntakeFlowDirection>('none');
  readonly currentIndex = signal(0);

  goNext(): boolean {
    if (this.currentIndex() >= INTAKE_SECTIONS.length - 1) {
      return false;
    }

    this.direction.set('forward');
    this.currentIndex.update((index) => index + 1);
    return true;
  }

  goBack(): boolean {
    if (this.currentIndex() <= 0) {
      return false;
    }

    this.direction.set('back');
    this.currentIndex.update((index) => index - 1);
    return true;
  }

  reset(): void {
    this.direction.set('none');
    this.currentIndex.set(0);
  }
}
