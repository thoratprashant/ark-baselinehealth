import { TreatmentFlowConfig } from './components/treatment-question-flow/treatment-question-flow';

export const PMDD_FLOW: TreatmentFlowConfig = {
  id: 'pmdd',
  eyebrowTitle: 'Premenstrual Dysphoric Disorder',
  eyebrowDescription:
    'Will prompt dynamic DSM-based questions assessing Premenstrual Dysphoric Disorder to become available',
  summaryQuestion: '',
  progress: [70, 95],
  questions: [
    {
      id: 'pmdd-cycle-symptoms',
      type: 'multi',
      layout: 'single-column',
      title:
        'Have any of the following symptoms been present A) at least 1 week before your menstrual cycle starts, B) start to improve within a few days of your cycle starting, C) are mild or gone in the week after your cycle, and D) have occurred during 2+ cycles, prior to taking medication for this issue?',
      options: [
        {
          label: 'Mood swings, crying spells, sadness, feeling rejected',
          value: 'mood-swings',
        },
        {
          label: 'Significant anger, irritability, or increased personal conflicts',
          value: 'anger-irritability',
        },
        { label: 'Feeling hopeless or worthless', value: 'hopeless-worthless' },
        {
          label: 'Elevated anxiety or feeling overwhelmed',
          value: 'anxiety-overwhelmed',
        },
      ],
      optionGroups: [
        {
          label: 'Depression',
          options: [
            {
              label:
                'Reduced interest in doing things that typically bring joy, or diminished feelings of joy from doing them',
              value: 'reduced-interest',
            },
            {
              label: 'Changes in sleep (sleeping more or less than usual)',
              value: 'sleep-changes',
            },
            {
              label: 'Changes in appetite (eating more or less than usual)',
              value: 'appetite-changes',
            },
            { label: 'Reduced energy', value: 'reduced-energy' },
            { label: 'Reduced concentration', value: 'reduced-concentration' },
          ],
        },
      ],
    },
    {
      id: 'pmdd-dysfunction-level',
      type: 'single',
      layout: 'single-column',
      title: 'What level of dysfunction have these symptoms caused you in the past?',
      options: [
        { label: 'Severe', value: 'Severe' },
        { label: 'Moderate', value: 'Moderate' },
        { label: 'Mild', value: 'Mild' },
      ],
    },
  ],
};
