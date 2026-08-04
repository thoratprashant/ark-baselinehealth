import { TreatmentFlowConfig } from './components/treatment-question-flow/treatment-question-flow';

const yesNoOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
] as const;

export const MAJOR_DEPRESSIVE_DISORDER_FLOW: TreatmentFlowConfig = {
  id: 'major-depressive-disorder',
  eyebrowTitle: 'Major Depressive Disorder',
  eyebrowDescription:
    'Will prompt dynamic DSM-based questions assessing Major Depressive Disorder to become available',
  summaryQuestion: '',
  progress: [70, 78, 87, 95],
  questions: [
    {
      id: 'mdd-simultaneous-symptoms',
      type: 'multi',
      layout: 'single-column',
      title:
        'During any point in time (childhood-adulthood) have you had any of the following symptoms simultaneously for a duration of 2+ consecutive weeks, prior to taking medication for this issue?',
      titleParts: [
        { text: 'During any point in time ' },
        { text: '(childhood-adulthood)', tone: 'highlight' },
        { text: ' have you had any of the following symptoms simultaneously for a ' },
        { text: 'duration of 2+ consecutive weeks', tone: 'accent' },
        { text: ', prior to taking medication for this issue?' },
      ],
      options: [
        {
          label: 'Depressed mood most of the day, nearly every day',
          value: 'depressed-mood',
        },
        {
          label:
            'Reduced desire to engage in activities that typically bring you joy, or if you still try to engage in these activities you experienced significantly reduced interest/pleasure from them',
          value: 'reduced-interest-pleasure',
        },
      ],
      optionGroups: [
        {
          label: 'Changes in appetite',
          collapsible: true,
          singleSelect: true,
          options: [
            {
              label: 'Reduced',
              value: 'appetite-reduced',
              followUp: {
                title: 'Did you experience unintentional',
                singleSelect: true,
                options: [
                  { label: 'Weight loss', value: 'unintentional-weight-loss' },
                  { label: 'Weight gain', value: 'unintentional-weight-gain' },
                ],
              },
            },
            { label: 'Increased', value: 'appetite-increased' },
          ],
        },
        {
          label: 'Changes in sleep',
          collapsible: true,
          singleSelect: true,
          options: [
            {
              label: 'Reduced',
              value: 'sleep-reduced',
              followUp: {
                singleSelect: true,
                options: [
                  { label: 'Trouble falling asleep', value: 'trouble-falling-asleep' },
                  { label: 'Trouble staying asleep', value: 'trouble-staying-asleep' },
                ],
              },
            },
            { label: 'Increased', value: 'sleep-increased' },
          ],
        },
        {
          label: 'Changes in motor function',
          collapsible: false,
          singleSelect: true,
          options: [
            {
              label: 'More restless or fidgeting more than usual',
              value: 'restless-fidgeting',
            },
            { label: 'Moving slower than usual', value: 'moving-slower' },
          ],
        },
      ],
      trailingOptions: [
        {
          label: 'Low energy/fatigue throughout the day',
          value: 'low-energy-fatigue',
        },
        {
          label: 'Feeling worthless, guilty about your emotions or actions',
          value: 'worthless-guilty',
        },
        {
          label: 'More difficulty concentrating/focusing on tasks or hobbies than usual',
          value: 'difficulty-concentrating',
        },
        {
          label:
            'Thoughts of self-harm or death would be a viable option to escape emotional distress',
          value: 'self-harm-or-death-thoughts',
        },
      ],
    },
    {
      id: 'mdd-distress-level',
      type: 'single',
      layout: 'single-column',
      title:
        'At the time these symptoms were active, what level of distress or impairment in social, occupational, or personal functioning did they cause?',
      options: [
        { label: 'Severe', value: 'Severe' },
        { label: 'Moderate', value: 'Moderate' },
        { label: 'Mild', value: 'Mild' },
      ],
    },
    {
      id: 'mdd-medical-or-substance-cause',
      type: 'single',
      title:
        'Were these symptoms the result of a medical condition (new or existing diagnoses), or a substance use disorder?',
      options: yesNoOptions,
      extraField: {
        showWhen: 'Yes',
        placeholder: 'If Yes, please list the medical condition or substance used',
      },
    },
    {
      id: 'mdd-psychotic-disorder',
      type: 'single',
      title:
        'Were these symptoms the result of a psychotic disorder (ex schizophrenia, schizoaffective disorder)?',
      options: yesNoOptions,
      conditionalPanel: {
        id: 'mdd-psychotic-symptoms',
        showWhen: 'Yes',
        title: 'What symptoms did you have ?',
        collapsible: true,
        options: [
          {
            label: 'Delusional thoughts (beliefs that are not based in reality)',
            value: 'delusional-thoughts',
          },
          {
            label: 'Hallucinations',
            value: 'hallucinations',
            followUp: {
              options: [
                {
                  label: 'Seeing things others cannot see or cannot be real',
                  value: 'visual-hallucinations',
                },
                {
                  label: 'Hearing things others cannot hear or cannot be real',
                  value: 'auditory-hallucinations',
                },
                {
                  label: 'Incoherent speech (babbling that makes no sense)',
                  value: 'incoherent-speech',
                },
                { label: 'Odd behaviors or catatonia', value: 'odd-behaviors-catatonia' },
              ],
            },
          },
        ],
        fields: [
          {
            id: 'mdd-psychotic-age',
            label: 'How old were you when these symptoms first occurred?',
            type: 'text',
            placeholder: 'Enter your age',
          },
          {
            id: 'mdd-psychotic-last-occurrence',
            label: 'When is the last time they occurred?',
            type: 'textarea',
            placeholder: 'If Yes, free text type here...',
          },
          {
            id: 'mdd-psychotic-hospitalized',
            label: 'Were you ever hospitalized for these symptoms?',
            type: 'single',
            options: yesNoOptions,
          },
        ],
      },
    },
  ],
};
