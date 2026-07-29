import { Injectable, signal } from '@angular/core';

export type IntakeFlowDirection = 'forward' | 'back' | 'none';

export const INTAKE_SECTIONS = [
  { id: 'welcome', progress: 0 },
  { id: 'wellbeing', progress: 7 },
  { id: 'treatment', progress: 70 },
] as const;

@Injectable({ providedIn: 'root' })
export class IntakeFlowService {
  readonly direction = signal<IntakeFlowDirection>('none');
  readonly currentIndex = signal(0);
  readonly progress = signal(0);

  goNext(): boolean {
    if (this.currentIndex() >= INTAKE_SECTIONS.length - 1) {
      return false;
    }

    this.direction.set('forward');
    this.currentIndex.update((index) => index + 1);
    this.syncSectionProgress();
    return true;
  }

  goBack(): boolean {
    if (this.currentIndex() <= 0) {
      return false;
    }

    this.direction.set('back');
    this.currentIndex.update((index) => index - 1);
    this.syncSectionProgress();
    return true;
  }

  setProgress(progress: number): void {
    this.progress.set(Math.max(0, Math.min(100, progress)));
  }

  reset(): void {
    this.direction.set('none');
    this.currentIndex.set(0);
    this.syncSectionProgress();
  }

  private syncSectionProgress(): void {
    this.progress.set(INTAKE_SECTIONS[this.currentIndex()]?.progress ?? 0);
  }
}
