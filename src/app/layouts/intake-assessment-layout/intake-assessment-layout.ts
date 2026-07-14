import { DOCUMENT } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import {
  INTAKE_SECTIONS,
  IntakeFlowService
} from '../../features/intake-assessment/intake-flow.service';

@Component({
  selector: 'app-intake-assessment-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './intake-assessment-layout.html',
  styleUrl: './intake-assessment-layout.scss'
})
export class IntakeAssessmentLayout {
  private readonly document = inject(DOCUMENT);
  private readonly targetProgress = computed(
    () => INTAKE_SECTIONS[this.flow.currentIndex()]?.progress ?? 0
  );
  protected readonly animatedProgress = signal(0);
  protected readonly displayedProgress = computed(() => Math.round(this.animatedProgress()));
  protected readonly isComplete = computed(
    () => this.flow.currentIndex() === INTAKE_SECTIONS.length - 1
  );

  constructor(protected readonly flow: IntakeFlowService) {
    effect((onCleanup) => {
      const target = this.targetProgress();
      const cancelAnimation = this.animateProgress(target);

      onCleanup(cancelAnimation);
    });
  }

  private animateProgress(target: number): () => void {
    const view = this.document.defaultView;
    const start = untracked(() => this.animatedProgress());

    if (
      !view ||
      typeof view.requestAnimationFrame !== 'function' ||
      typeof view.cancelAnimationFrame !== 'function'
    ) {
      this.animatedProgress.set(target);
      return () => undefined;
    }

    const prefersReducedMotion =
      typeof view.matchMedia === 'function' &&
      view.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      this.animatedProgress.set(target);
      return () => undefined;
    }

    const difference = target - start;
    const duration = 650;
    let animationFrame = 0;
    let startTime: number | undefined;

    const update = (timestamp: number): void => {
      startTime ??= timestamp;
      const elapsed = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - elapsed, 3);

      this.animatedProgress.set(start + difference * easedProgress);

      if (elapsed < 1) {
        animationFrame = view.requestAnimationFrame(update);
      } else {
        this.animatedProgress.set(target);
      }
    };

    animationFrame = view.requestAnimationFrame(update);

    return () => view.cancelAnimationFrame(animationFrame);
  }
}
