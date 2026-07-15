import { Component } from '@angular/core';

import { CareJourney } from '../../care-journey/care-journey';

@Component({
  selector: 'app-prescription-sent',
  imports: [CareJourney],
  templateUrl: './prescription-sent.html',
  styleUrl: './prescription-sent.scss'
})
export class PrescriptionSent {}
