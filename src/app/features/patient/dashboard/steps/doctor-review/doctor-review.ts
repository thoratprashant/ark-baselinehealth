import { Component } from '@angular/core';

import { CareJourney } from '../../care-journey/care-journey';

@Component({
  selector: 'app-doctor-review',
  imports: [CareJourney],
  templateUrl: './doctor-review.html',
  styleUrl: './doctor-review.scss'
})
export class DoctorReview {}
