import { Component } from '@angular/core';

import { CareJourney } from './care-journey/care-journey';

@Component({
  selector: 'app-patient-dashboard',
  imports: [CareJourney],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class PatientDashboard {}
