import { Component } from '@angular/core';

import { CareJourney } from '../../care-journey/care-journey';

@Component({
  selector: 'app-membership-payment',
  imports: [CareJourney],
  templateUrl: './membership-payment.html',
  styleUrl: './membership-payment.scss'
})
export class MembershipPayment {}
