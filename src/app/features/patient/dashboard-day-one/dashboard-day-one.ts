import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CareJourney } from '../dashboard/care-journey/care-journey';

@Component({
  selector: 'app-dashboard-day-one',
  imports: [RouterLink, CareJourney],
  templateUrl: './dashboard-day-one.html',
  styleUrl: './dashboard-day-one.scss'
})
export class DashboardDayOne {}
