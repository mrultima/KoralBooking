import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ta-core-html-alerts',
  templateUrl: './html-alerts.component.html',
  styleUrls: ['./html-alerts.component.scss']
})
export class HmtlAlertsComponent implements OnInit {

  @Input() icon;
  @Input() type; // info, danger, warning, dark, light
  @Input() message;

  backgroundColor: string;

  constructor() {
  }

  ngOnInit() {

    switch (this.type) {
      case 'info':
        this.backgroundColor = '#B0C4DE';
        break;
      case 'danger':
        this.backgroundColor = '#FF6347';
        break;
      case 'warning':
        this.backgroundColor = '#ffc107';
        break;
      case 'dark':
        this.backgroundColor = '#696969';
        break;
      case 'light':
        this.backgroundColor = '#F8F8FF';
        break;
      default:
        break;
    }
  }

}
