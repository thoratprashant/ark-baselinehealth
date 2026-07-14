import { Component, computed } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import {
  INTAKE_SECTIONS,
  IntakeFlowService
} from '../../features/intake-assessment/intake-flow.service';

@Component({
  selector: 'app-intake-assessment-layout',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './intake-assessment-layout.html',
  styleUrl: './intake-assessment-layout.scss'
})
export class IntakeAssessmentLayout {
  protected readonly progress = computed(
    () => INTAKE_SECTIONS[this.flow.currentIndex()]?.progress ?? 0
  );

  constructor(protected readonly flow: IntakeFlowService) {}
}
