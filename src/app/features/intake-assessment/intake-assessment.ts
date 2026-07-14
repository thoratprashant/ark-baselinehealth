import { DOCUMENT } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { IntakeFlowService } from './intake-flow.service';

interface WellbeingConcern {
  label: string;
  icon: string;
}

interface Phq9Answer {
  label: string;
  description: string;
  icon?: string;
}

type SectionState = 'is-active' | 'is-before' | 'is-after';

@Component({
  selector: 'app-intake-assessment',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './intake-assessment.html',
  styleUrl: './intake-assessment.scss'
})
export class IntakeAssessment implements OnInit {
  private readonly document = inject(DOCUMENT);
  protected readonly flow = inject(IntakeFlowService);

  protected readonly consentForm = new FormGroup({
    participation: new FormControl(true, {
      nonNullable: true,
      validators: [Validators.requiredTrue]
    }),
    privacy: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue]
    }),
    communications: new FormControl(false, { nonNullable: true })
  });

  protected readonly historyForm = new FormGroup({
    lifetimeSeizures: new FormControl('', { nonNullable: true }),
    lastSeizureDate: new FormControl('', { nonNullable: true }),
    seizureMedications: new FormControl('', { nonNullable: true }),
    wellbutrin: new FormControl('', { nonNullable: true })
  });

  protected readonly medicationForm = new FormGroup({
    currentMedications: new FormControl('', { nonNullable: true })
  });

  protected readonly concerns: readonly WellbeingConcern[] = [
    { label: 'Generalized Anxiety Screening', icon: '\u{1F630}' },
    { label: 'Illness Anxiety Screening', icon: '\u{1F912}' },
    { label: 'OCD Screening', icon: '\u2696\uFE0F' },
    { label: 'Insomnia Screening', icon: '\u{1F319}' },
    { label: 'Panic Disorder Screening', icon: '\u{1F631}' },
    { label: 'PTSD Screening', icon: '\u{1F6E1}\uFE0F' },
    { label: 'Major Depressive Disorder Screening', icon: '\u{1F614}' },
    { label: 'Premenstrual Dysphoric Disorder Screening', icon: '\u{1F629}' },
    { label: 'Social Anxiety & Agoraphobia Screening', icon: '\u{1F3E0}' }
  ];

  protected readonly selectedConcerns = signal(
    new Set<string>(['Generalized Anxiety Screening'])
  );

  protected readonly phq9Answers: readonly Phq9Answer[] = [
    { label: 'Not at all', description: 'No symptoms reported', icon: '\u{1F600}' },
    { label: 'Several Days', description: 'Mild Symptoms Frequency' },
    { label: 'More than half the days', description: 'Moderate Symptoms Frequency' },
    { label: 'Nearly every day', description: 'Severe Symptoms Frequency' }
  ];

  protected readonly selectedPhq9Answers = signal(new Set<string>(['Not at all']));
  protected readonly selectedSafetyAnswer = signal<'No' | 'Yes'>('No');

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

  protected toggleConcern(label: string): void {
    this.selectedConcerns.update((current) => {
      const updated = new Set(current);
      updated.has(label) ? updated.delete(label) : updated.add(label);
      return updated;
    });
  }

  protected back(): void {
    if (this.flow.goBack()) {
      this.scrollActiveSectionToTop();
    }
  }

  protected continueFromWellbeing(): void {
    if (this.selectedConcerns().size > 0 && this.flow.goNext()) {
      this.scrollActiveSectionToTop();
    }
  }

  protected togglePhq9Answer(answer: string): void {
    this.selectedPhq9Answers.update((current) => {
      const updated = new Set(current);
      updated.has(answer) ? updated.delete(answer) : updated.add(answer);
      return updated;
    });
  }

  protected continueFromPhq9(): void {
    if (this.selectedPhq9Answers().size > 0 && this.flow.goNext()) {
      this.scrollActiveSectionToTop();
    }
  }

  protected selectSafetyAnswer(answer: 'No' | 'Yes'): void {
    this.selectedSafetyAnswer.set(answer);
  }

  protected continueFromSafety(): void {
    if (this.selectedSafetyAnswer() && this.flow.goNext()) {
      this.scrollActiveSectionToTop();
    }
  }

  protected continueFromHistory(): void {
    if (this.flow.goNext()) {
      this.scrollActiveSectionToTop();
    }
  }

  protected continueFromMedication(): void {
    if (this.flow.goNext()) {
      this.scrollActiveSectionToTop();
    }
  }

  private scrollActiveSectionToTop(): void {
    const view = this.document.defaultView;

    view?.requestAnimationFrame(() => {
      const activeCard = this.document.querySelector<HTMLElement>(
        '.assessment-section.is-active .assessment-card'
      );

      activeCard?.scrollTo({ top: 0, behavior: 'smooth' });
      view.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
