import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ta-core-list-no-item',
  templateUrl: './list-no-item.component.html',
  styleUrls: [ './list-no-item.component.scss' ]
})
export class ListNoItemComponent implements OnInit {
  @Input() mode: 'CallList' ;

  constructor() {
  }

  ngOnInit() {
  }

}
