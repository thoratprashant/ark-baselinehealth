import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';

export interface TreatmentQuestionOption {
  label: string;
  value: string;
}

export interface TreatmentQuestionOptionGroup {
  label: string;
  options: readonly TreatmentQuestionOption[];
}

export interface TreatmentQuestionTitlePart {
  text: string;
  tone?: 'accent' | 'highlight';
}

export interface TreatmentQuestionExtraField {
  placeholder: string;
  showWhen: string;
  placement?: 'after-options' | 'inside-option';
}

export interface TreatmentQuestionConditionalField {
  id: string;
  label: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'single';
  options?: readonly TreatmentQuestionOption[];
}

export interface TreatmentQuestionConditionalPanel {
  id: string;
  showWhen: string;
  title: string;
  options?: readonly TreatmentQuestionOption[];
  fields?: readonly TreatmentQuestionConditionalField[];
}

export interface TreatmentQuestion {
  id: string;
  type: 'single' | 'multi';
  layout?: 'single-column' | 'two-column';
  optional?: boolean;
  showRadio?: boolean;
  context?: string;
  title: string;
  titleParts?: readonly TreatmentQuestionTitlePart[];
  options: readonly TreatmentQuestionOption[];
  optionGroups?: readonly TreatmentQuestionOptionGroup[];
  trailingOptions?: readonly TreatmentQuestionOption[];
  note?: string;
  extraField?: TreatmentQuestionExtraField;
  conditionalPanel?: TreatmentQuestionConditionalPanel;
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
  readonly configs = input.required<readonly TreatmentFlowConfig[]>();
  readonly backRequested = output<void>();
  readonly completed = output<TreatmentFlowResult>();
  readonly progressChanged = output<number>();

  protected readonly currentQuestionIndex = signal(0);
  protected readonly answers = signal<TreatmentAnswers>({});
  protected readonly textAnswers = signal<Record<string, string>>({});
  protected readonly collapsedGroups = signal<ReadonlySet<string>>(new Set());

  protected readonly queuedQuestions = computed(() =>
    this.configs().flatMap((config) =>
      config.questions.map((question, questionIndex) => ({ config, question, questionIndex })),
    ),
  );

  protected readonly currentItem = computed(
    () => this.queuedQuestions()[this.currentQuestionIndex()],
  );

  protected readonly currentQuestion = computed(() => this.currentItem().question);
  protected readonly currentConfig = computed(() => this.currentItem().config);

  protected readonly canContinue = computed(() => {
    const question = this.currentQuestion();
    const answer = this.answers()[question.id];

    if (question.optional) {
      return true;
    }

    return question.type === 'multi'
      ? Array.isArray(answer) && answer.length > 0
      : typeof answer === 'string' && answer.length > 0;
  });

  protected readonly summaryAnswer = computed(() => {
    const firstQuestion = this.currentConfig().questions[0];
    const answer = this.answers()[firstQuestion.id];
    return typeof answer === 'string' ? answer : '';
  });

  protected readonly showAnswerSummary = computed(
    () =>
      this.currentItem().questionIndex > 0 &&
      Boolean(this.currentConfig().summaryQuestion && this.summaryAnswer()),
  );

  protected selectSingle(questionId: string, value: string): void {
    this.answers.update((answers) => ({ ...answers, [questionId]: value }));

    const question = this.currentQuestion();
    if (question.extraField && question.extraField.showWhen !== value) {
      this.textAnswers.update((answers) => ({ ...answers, [questionId]: '' }));
    }
  }

  protected toggleMulti(questionId: string, value: string): void {
    const wasSelected = this.isSelected(questionId, value);

    this.answers.update((answers) => {
      const current = answers[questionId];
      const selected = new Set(Array.isArray(current) ? current : []);
      selected.has(value) ? selected.delete(value) : selected.add(value);

      return { ...answers, [questionId]: [...selected] };
    });

    const question = this.currentQuestion();
    if (wasSelected && question.extraField?.showWhen === value) {
      this.textAnswers.update((answers) => ({ ...answers, [questionId]: '' }));
    }
  }

  protected isSelected(questionId: string, value: string): boolean {
    const answer = this.answers()[questionId];
    return Array.isArray(answer) ? answer.includes(value) : answer === value;
  }

  protected toggleOptionGroup(questionId: string, groupLabel: string): void {
    const key = `${questionId}:${groupLabel}`;
    this.collapsedGroups.update((collapsed) => {
      const next = new Set(collapsed);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  protected isOptionGroupExpanded(questionId: string, groupLabel: string): boolean {
    return !this.collapsedGroups().has(`${questionId}:${groupLabel}`);
  }

  protected shouldShowExtraField(question: TreatmentQuestion): boolean {
    if (!question.extraField) {
      return false;
    }

    const answer = this.answers()[question.id];
    return Array.isArray(answer)
      ? answer.includes(question.extraField.showWhen)
      : answer === question.extraField.showWhen;
  }

  protected shouldShowConditionalPanel(question: TreatmentQuestion): boolean {
    return Boolean(
      question.conditionalPanel &&
        this.answers()[question.id] === question.conditionalPanel.showWhen,
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

    if (this.currentQuestionIndex() < this.queuedQuestions().length - 1) {
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
    const questionCount = this.queuedQuestions().length;
    const progress =
      questionCount > 1
        ? 70 + Math.round((this.currentQuestionIndex() / (questionCount - 1)) * 25)
        : 95;

    this.progressChanged.emit(progress);
  }

  private scrollCardToTop(): void {
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>('.treatment-flow-card .assessment-card__scroll')
        ?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
