import {Component} from '@angular/core';
import { SpinnerService } from '../../shared';

@Component({
  selector: 'ta-core-loading-spinnner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss'],
})
export class LoadingSpinnerComponent {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;


  constructor(public spinnerService: SpinnerService) {}
}
