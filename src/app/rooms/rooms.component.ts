import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, Subject, timer } from 'rxjs';
import { groupBy, mergeMap, takeUntil, toArray } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Room, Rooms } from '../types';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit,OnDestroy,AfterViewInit {

  rooms: Room[]=[];
  roomsByGroup:any[] = [];
  rooms$ = new BehaviorSubject<Rooms | null>(null);

  isDestroyed = new Subject();
  constructor(public apiService: ApiService) {
   
    
   }
  async ngAfterViewInit(){
    
    
  }
  ngOnDestroy(): void {
    this.isDestroyed.next();
    this.isDestroyed.complete(); 
  }

  async ngOnInit(){
    this.apiService.rooms$.subscribe((info) => {
    this._groupBy(info);
    })
    await timer(500).toPromise();
    this.apiService.rooms$.pipe(takeUntil(this.isDestroyed)).subscribe(info=>{
      if(info){
        this.rooms$.next(info)
        this.rooms$.getValue()?.forEach(room => this.rooms.push(room))
        
        for(let i= 0 ; i < this.rooms.length ; i++)
        if(this.rooms[i]){
          if(this.rooms[i]?.RoomImageURL == null){
            this.rooms[i].RoomImageURL = "https://erspublic.blob.core.windows.net/test/1721248f-f039-5867-86fc-2e5b0a257000.jpg"
          }
        }        
      }
    })
    this.apiService.onSearch();  
  }

  search(){
    
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
