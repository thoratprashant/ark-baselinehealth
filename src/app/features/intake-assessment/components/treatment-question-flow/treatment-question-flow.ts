import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

export interface TreatmentQuestionOption {
  label: string;
  value: string;
}

export interface TreatmentQuestionTitlePart {
  text: string;
  tone?: 'accent' | 'highlight';
}

export interface TreatmentQuestionExtraField {
  placeholder: string;
  showWhen: string;
}

export interface TreatmentQuestion {
  id: string;
  type: 'single' | 'multi';
  title: string;
  titleParts?: readonly TreatmentQuestionTitlePart[];
  options: readonly TreatmentQuestionOption[];
  note?: string;
  extraField?: TreatmentQuestionExtraField;
}

export interface TreatmentFlowConfig {
  id: string;
  eyebrowTitle: string;
  eyebrowDescription: string;
  summaryQuestion: string;
  progress: readonly number[];
  questions: readonly TreatmentQuestion[];
}

export type TreatmentAnswers = Record<string, string | readonly string[]>;

export interface TreatmentFlowResult {
  answers: TreatmentAnswers;
  details: Readonly<Record<string, string>>;
}

@Component({
  selector: 'app-treatment-question-flow',
  templateUrl: './treatment-question-flow.html',
  styleUrl: './treatment-question-flow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreatmentQuestionFlow {
  readonly config = input.required<TreatmentFlowConfig>();
  readonly backRequested = output<void>();
  readonly completed = output<TreatmentFlowResult>();
  readonly progressChanged = output<number>();

  protected readonly currentQuestionIndex = signal(0);
  protected readonly answers = signal<TreatmentAnswers>({});
  protected readonly textAnswers = signal<Record<string, string>>({});

  protected readonly currentQuestion = computed(
    () => this.config().questions[this.currentQuestionIndex()],
  );

  protected readonly canContinue = computed(() => {
    const question = this.currentQuestion();
    const answer = this.answers()[question.id];

    return question.type === 'multi'
      ? Array.isArray(answer) && answer.length > 0
      : typeof answer === 'string' && answer.length > 0;
  });

  protected readonly summaryAnswer = computed(() => {
    const firstQuestion = this.config().questions[0];
    const answer = this.answers()[firstQuestion.id];
    return typeof answer === 'string' ? answer : '';
  });

  protected selectSingle(questionId: string, value: string): void {
    this.answers.update((answers) => ({ ...answers, [questionId]: value }));

    const question = this.currentQuestion();
    if (question.extraField && question.extraField.showWhen !== value) {
      this.textAnswers.update((answers) => ({ ...answers, [questionId]: '' }));
    }
  }

  protected toggleMulti(questionId: string, value: string): void {
    this.answers.update((answers) => {
      const current = answers[questionId];
      const selected = new Set(Array.isArray(current) ? current : []);
      selected.has(value) ? selected.delete(value) : selected.add(value);

      return { ...answers, [questionId]: [...selected] };
    });
  }

  protected isSelected(questionId: string, value: string): boolean {
    const answer = this.answers()[questionId];
    return Array.isArray(answer) ? answer.includes(value) : answer === value;
  }

  protected shouldShowExtraField(question: TreatmentQuestion): boolean {
    return Boolean(
      question.extraField && this.answers()[question.id] === question.extraField.showWhen,
    );
  }

  protected updateTextAnswer(questionId: string, event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.textAnswers.update((answers) => ({ ...answers, [questionId]: value }));
  }

  protected back(): void {
    if (this.currentQuestionIndex() === 0) {
      this.backRequested.emit();
      return;
    }

    this.currentQuestionIndex.update((index) => index - 1);
    this.emitProgress();
    this.scrollCardToTop();
  }

  protected continue(): void {
    if (!this.canContinue()) {
      return;
    }

    if (this.currentQuestionIndex() < this.config().questions.length - 1) {
      this.currentQuestionIndex.update((index) => index + 1);
      this.emitProgress();
      this.scrollCardToTop();
      return;
    }

    this.completed.emit({
      answers: this.answers(),
      details: this.textAnswers(),
    });
  }

  private emitProgress(): void {
    const progress = this.config().progress;
    this.progressChanged.emit(progress[this.currentQuestionIndex()] ?? progress.at(-1) ?? 0);
  }

  private scrollCardToTop(): void {
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>('.treatment-flow-card .assessment-card__scroll')
        ?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
