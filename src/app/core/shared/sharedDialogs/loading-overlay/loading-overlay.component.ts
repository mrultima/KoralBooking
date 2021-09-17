import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss']
})
export class LoadingOverlayComponent implements OnInit {
  @Input() message: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  @Input() messages: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>(null);

  @Input() cancel: Subject<void>;

  constructor() {
  }

  ngOnInit() {
  }
}
