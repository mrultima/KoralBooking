import { Component, OnInit } from '@angular/core';
import { from, timer } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Room } from '../types';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {

  rooms: Room[]=[];
  roomsByGroup:any[] = [];
  constructor(public apiService: ApiService) { }

  async ngOnInit(){
    this.apiService.rooms$.subscribe((info) => {this.rooms = info
    this._groupBy(info);
    console.log("grop",this.roomsByGroup);
    })
    await timer(500).toPromise();
  
  }

  search(){
    console.log(this.rooms)
  }

  _groupBy(data:Room[]){
    const source = from(data);
    const example = source.pipe(
      groupBy(room => room.RoomTypeId),
      // return each item in group as array
      mergeMap(group => group.pipe(toArray()))
    );

    const subscribe = example.subscribe(val => {this.roomsByGroup.push(val)
    });
  }
}
