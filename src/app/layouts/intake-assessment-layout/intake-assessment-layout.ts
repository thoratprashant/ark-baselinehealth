import { Component, computed } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import {
  ASSESSMENT_TOTAL_STEPS,
  IntakeFlowService
} from '../../features/intake-assessment/intake-flow.service';

@Component({
  selector: 'app-intake-assessment-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './intake-assessment-layout.html',
  styleUrl: './intake-assessment-layout.scss'
})
export class IntakeAssessmentLayout {
  protected readonly progress = computed(() =>
    Math.round((this.flow.currentIndex() / ASSESSMENT_TOTAL_STEPS) * 100)
  );

  constructor(protected readonly flow: IntakeFlowService) {}
}
