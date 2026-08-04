import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  TreatmentFlowConfig,
  TreatmentFlowResult,
  TreatmentQuestionFlow,
} from './components/treatment-question-flow/treatment-question-flow';
import { GENERALIZED_ANXIETY_FLOW } from './generalized-anxiety-flow.config';
import { INSOMNIA_FLOW } from './insomnia-flow.config';
import { MAJOR_DEPRESSIVE_DISORDER_FLOW } from './major-depressive-disorder-flow.config';
import { OCD_FLOW } from './ocd-flow.config';
import { PMDD_FLOW } from './pmdd-flow.config';
import { IntakeFlowService } from './intake-flow.service';

interface WellbeingConcern {
  label: string;
  icon: string;
}

type SectionState = 'is-active' | 'is-before' | 'is-after';

@Component({
  selector: 'app-intake-assessment',
  imports: [ReactiveFormsModule, RouterLink, TreatmentQuestionFlow],
  templateUrl: './intake-assessment.html',
  styleUrl: './intake-assessment.scss',
})
export class IntakeAssessment implements OnInit {
  private readonly document = inject(DOCUMENT);
  protected readonly flow = inject(IntakeFlowService);

  protected readonly consentForm = new FormGroup({
    participation: new FormControl(true, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
    privacy: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
    communications: new FormControl(false, { nonNullable: true }),
  });

  protected readonly concerns: readonly WellbeingConcern[] = [
    { label: 'Generalized Anxiety Treatment', icon: '\u{1F630}' },
    { label: 'Illness Anxiety Treatment', icon: '\u{1F912}' },
    { label: 'OCD Treatment', icon: '\u2696\uFE0F' },
    { label: 'Insomnia Treatment', icon: '\u{1F319}' },
    { label: 'Panic Disorder Treatment', icon: '\u{1F631}' },
    { label: 'PTSD Treatment', icon: '\u{1F6E1}\uFE0F' },
    { label: 'Major Depressive Disorder Treatment', icon: '\u{1F614}' },
    { label: 'Premenstrual Dysphoric Disorder Treatment', icon: '\u{1F937}\u200D\u2640\uFE0F' },
    { label: 'Social Anxiety & Agoraphobia Treatment', icon: '\u{1F3E0}' },
  ];

  protected readonly selectedConcerns = signal<readonly string[]>([]);
  protected readonly completedTreatment = signal<TreatmentFlowResult | null>(null);
  protected readonly submittedDate = signal('');
  private readonly treatmentFlowsByConcern: Readonly<Record<string, TreatmentFlowConfig>> = {
    'Generalized Anxiety Treatment': GENERALIZED_ANXIETY_FLOW,
    'Insomnia Treatment': INSOMNIA_FLOW,
    'Major Depressive Disorder Treatment': MAJOR_DEPRESSIVE_DISORDER_FLOW,
    'OCD Treatment': OCD_FLOW,
    'Premenstrual Dysphoric Disorder Treatment': PMDD_FLOW,
  };
  protected readonly selectedTreatmentFlows = computed(() =>
    this.selectedConcerns()
      .map((concern) => this.treatmentFlowsByConcern[concern])
      .filter((config): config is TreatmentFlowConfig => Boolean(config)),
  );
  protected readonly treatmentFlowKey = computed(() =>
    this.selectedTreatmentFlows()
      .map((config) => config.id)
      .join('|'),
  );

  ngOnInit(): void {
    this.flow.reset();
  }

  protected sectionState(index: number): SectionState {
    if (index === this.flow.currentIndex()) {
      return 'is-active';
    }

    return index < this.flow.currentIndex() ? 'is-before' : 'is-after';
  }

  protected continueFromWelcome(): void {
    if (this.consentForm.invalid) {
      this.consentForm.markAllAsTouched();
      return;
    }

    if (this.flow.goNext()) {
      this.scrollActiveSectionToTop();
    }
  }

  protected selectConcern(label: string): void {
    if (!this.hasTreatmentFlow(label)) {
      return;
    }

    this.selectedConcerns.update((selected) =>
      selected.includes(label)
        ? selected.filter((concern) => concern !== label)
        : [...selected, label],
    );
  }

  protected isConcernSelected(label: string): boolean {
    return this.selectedConcerns().includes(label);
  }

  protected hasTreatmentFlow(label: string): boolean {
    return Boolean(this.treatmentFlowsByConcern[label]);
  }

  protected back(): void {
    if (this.flow.goBack()) {
      this.scrollActiveSectionToTop();
    }
  }

  protected continueFromWellbeing(): void {
    if (this.selectedTreatmentFlows().length > 0 && this.flow.goNext()) {
      this.scrollActiveSectionToTop();
    }
  }

  protected backFromTreatment(): void {
    if (this.flow.goBack()) {
      this.scrollActiveSectionToTop();
    }
  }

  protected completeAssessment(result: TreatmentFlowResult): void {
    this.completedTreatment.set(result);
    this.submittedDate.set(this.formatSubmissionDate(new Date()));

    if (this.flow.goNext()) {
      this.scrollActiveSectionToTop();
    }
  }

  private formatSubmissionDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  }

  private scrollActiveSectionToTop(): void {
    const view = this.document.defaultView;

    view?.requestAnimationFrame(() => {
      const activeCard = this.document.querySelector<HTMLElement>(
        '.assessment-section.is-active .assessment-card__scroll',
      );

      activeCard?.scrollTo({ top: 0, behavior: 'smooth' });
      view.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
