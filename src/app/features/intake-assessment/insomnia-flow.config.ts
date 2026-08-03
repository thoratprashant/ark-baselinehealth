import { TreatmentFlowConfig } from './components/treatment-question-flow/treatment-question-flow';

export const INSOMNIA_FLOW: TreatmentFlowConfig = {
  id: 'insomnia',
  eyebrowTitle: 'Insomnia Screening',
  eyebrowDescription:
    'Will prompt dynamic DSM-based questions assessing Insomnia Disorder to become available',
  summaryQuestion: '',
  progress: [70, 95],
  questions: [
    {
      id: 'insomnia-sleep-issues',
      type: 'multi',
      layout: 'single-column',
      title:
        'Which of the following issues were affecting your sleep prior to taking medication to treat this issue?',
      titleParts: [
        { text: 'Which of the following issues were ' },
        { text: 'affecting your sleep', tone: 'accent' },
        { text: ' prior to taking medication to treat this issue?' },
      ],
      options: [
        { label: 'Difficulty falling asleep', value: 'difficulty-falling-asleep' },
        {
          label:
            'Difficulty staying asleep and/or returning to sleep after waking before intended (ex after using the restroom, awaken by a child or pet)',
          value: 'difficulty-staying-asleep',
        },
        {
          label: 'Early-morning awakening with inability to fall back asleep',
          value: 'early-morning-awakening',
        },
      ],
    },
    {
      id: 'insomnia-distress-level',
      type: 'single',
      layout: 'single-column',
      title: 'What level of distress has your insomnia caused before you took medication?',
      titleParts: [
        { text: 'What level of ' },
        { text: 'distress', tone: 'accent' },
        { text: ' has your insomnia caused before you took medication?' },
      ],
      options: [
        { label: 'Severe', value: 'Severe' },
        { label: 'Moderate', value: 'Moderate' },
        { label: 'Mild', value: 'Mild' },
      ],
    },
  ],
};
