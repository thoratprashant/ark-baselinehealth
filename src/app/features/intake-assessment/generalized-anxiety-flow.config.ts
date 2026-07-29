import { TreatmentFlowConfig } from './components/treatment-question-flow/treatment-question-flow';

const yesNoOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
] as const;

const summaryQuestion =
  'During any point in time (childhood–adulthood) have you had excessive worrying and difficulty controlling the worry or compartmentalizing, more days than not for 6+ months in a row, prior to taking medication for this issue?';

export const GENERALIZED_ANXIETY_FLOW: TreatmentFlowConfig = {
  id: 'generalized-anxiety',
  eyebrowTitle: 'Generalized Anxiety Screening',
  eyebrowDescription:
    'Will prompt dynamic DSM-based questions assessing Generalized Anxiety Disorder to become available',
  summaryQuestion,
  progress: [70, 75, 80, 85, 90, 95],
  questions: [
    {
      id: 'persistent-worry',
      type: 'single',
      title: summaryQuestion,
      titleParts: [
        { text: 'During any point in time ' },
        { text: '(childhood–adulthood)', tone: 'highlight' },
        {
          text: ' have you had excessive worrying and difficulty controlling the worry or compartmentalizing, ',
        },
        { text: 'more days than not for 6+ months', tone: 'accent' },
        { text: ' in a row, prior to taking medication for this issue?' },
      ],
      options: yesNoOptions,
    },
    {
      id: 'simultaneous-symptoms',
      type: 'multi',
      title: 'Have any of these symptoms been present simultaneously with those mentioned above?',
      options: [
        { label: 'Feeling restless, on edge, or “keyed up”?', value: 'restless' },
        {
          label: 'Physically or mentally fatigued from your worrying',
          value: 'fatigued',
        },
        { label: 'Difficulty concentrating', value: 'concentrating' },
        { label: 'Irritable mood', value: 'irritable' },
        { label: 'Muscle tension', value: 'muscle-tension' },
        {
          label: 'Difficulty sleeping (falling or staying asleep)',
          value: 'sleeping',
        },
      ],
      note: 'Multi-selection',
    },
    {
      id: 'distress-impairment',
      type: 'single',
      title:
        'Did the anxiety cause significant distress/impairment in your personal, social, or occupational life (prior to medication)?',
      options: yesNoOptions,
    },
    {
      id: 'medical-condition',
      type: 'single',
      title: 'Has this anxiety been linked to a specific medical condition?',
      options: yesNoOptions,
      extraField: {
        showWhen: 'Yes',
        placeholder:
          'If Yes, list the medical conditions and any treatments you are receiving other than mental health medication',
      },
    },
    {
      id: 'substance-abuse',
      type: 'single',
      title: 'Has this anxiety been linked to substance abuse?',
      options: yesNoOptions,
      extraField: {
        showWhen: 'Yes',
        placeholder: 'If Yes, list the substances linked to your anxiety',
      },
    },
    {
      id: 'other-mental-health-disorder',
      type: 'single',
      title: 'Has this anxiety been linked to another mental health disorder?',
      options: yesNoOptions,
      extraField: {
        showWhen: 'Yes',
        placeholder: 'If Yes, list the other mental health disorder',
      },
    },
  ],
};
