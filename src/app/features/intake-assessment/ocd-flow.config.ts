import { TreatmentFlowConfig } from './components/treatment-question-flow/treatment-question-flow';

const symptomContext =
  'Select below if applied to your symptoms prior to taking medication for this issue:';

export const OCD_FLOW: TreatmentFlowConfig = {
  id: 'ocd',
  eyebrowTitle: 'OCD Screening',
  eyebrowDescription:
    'Will prompt dynamic DSM-based questions assessing Obsessive-Compulsive Disorder to become available',
  summaryQuestion: '',
  progress: [70, 82, 95],
  questions: [
    {
      id: 'ocd-symptoms',
      type: 'multi',
      layout: 'single-column',
      title: 'Select all that applied to your symptoms prior to taking medication for this issue:',
      options: [
        {
          label:
            'Recurrent thoughts, urges, or mental images that are intrusive and lead to feelings of anxiety or distress',
          value: 'intrusive-thoughts',
        },
        {
          label: 'An inability to ignore/dismiss these thoughts',
          value: 'cannot-dismiss-thoughts',
        },
        {
          label:
            'Repetitive behaviors you engage in to try and quiet/appease the intrusive thoughts or feel compelled to perform',
          value: 'repetitive-behaviors',
        },
        {
          label:
            'There is a hope/expectation that performing repetitive acts/routines will reduce anxiety, distress or fear something bad will happen if not completing behavior(s)',
          value: 'repetitive-acts-expectation',
        },
      ],
      extraField: {
        showWhen: 'repetitive-acts-expectation',
        placement: 'inside-option',
        placeholder:
          'Free text: please list all repetitive, intrusive thoughts, urges, behaviors, routines...',
      },
    },
    {
      id: 'ocd-intrusive-behaviors',
      type: 'multi',
      layout: 'single-column',
      optional: true,
      context: symptomContext,
      title: 'Do you have any of the following intrusive behaviors?',
      options: [
        { label: 'Scratching or picking at your skin', value: 'skin-picking' },
        { label: 'Pulling hairs out', value: 'hair-pulling' },
        {
          label:
            'Difficulty throwing away useless objects (ex: trash, un-needed mail, receipts or other papers, etc.)',
          value: 'discarding-useless-objects',
        },
        {
          label:
            'Difficulty parting with personal items (Ex: worn out or outgrown clothing/shoes, furniture, electronic equipment, etc.)',
          value: 'parting-with-personal-items',
        },
      ],
      note:
        'If you have not experienced any of the above behaviors, you may skip this section and click Continue.',
    },
    {
      id: 'ocd-daily-time',
      type: 'single',
      layout: 'single-column',
      showRadio: false,
      context: symptomContext,
      title: 'How much time do you spend per day dealing with these symptoms?',
      options: [
        { label: '0-30 min', value: '0-30-min' },
        { label: '1-2 hr', value: '1-2-hr' },
        { label: '3-4 hr', value: '3-4-hr' },
        { label: '5+ hours', value: '5-plus-hours' },
      ],
    },
  ],
};
