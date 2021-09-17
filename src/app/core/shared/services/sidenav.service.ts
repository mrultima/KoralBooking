import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  leftSide = new Subject();
  rightSide = new Subject();

  constructor() {
  }
}
