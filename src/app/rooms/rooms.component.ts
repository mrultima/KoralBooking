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
  roomsGroup:any[] = []
  roomsByGroup:any[] = [];
  roomsCancelByGroup:any[] = [];
  roomsBoardByGroup:any[] = [];
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
    this.apiService.rooms$.subscribe(async (info) => {
    this.roomsByGroup = await this._groupBy(info,"RoomTypeId");
    this.roomsCancelByGroup = await this._groupBy(info,"CancelPolicy");
    this.roomsBoardByGroup = await this._groupBy(info,"BoardType");
    })   
    await timer(500).toPromise();
    this.apiService.rooms$.pipe(takeUntil(this.isDestroyed)).subscribe(info=>{
      if(info){
        this.rooms$.next(info)
        this.rooms$.getValue()?.forEach(room => this.rooms.push(room))
        console.log(this.rooms$.value)
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

  async _groupBy(data:Room[], key:any){
    let room:any = []
    const source = from(data);
    const roomType = source.pipe(
      groupBy((room:any) => room[key]),
      // return each item in group as array
      mergeMap(group => group.pipe(toArray()))
    );
    
    // const cancelPol = source.pipe(
    //   groupBy(room => room.CancelPolicy),
    //   mergeMap(group => group.pipe(toArray()))
    // );
    // const boardType = source.pipe(
    //   groupBy(room => room.CancelPolicy),
    //   mergeMap(group => group.pipe(toArray()))
    // );

    const subscribe = roomType.subscribe(val => room.push(val))
    console.log("r",room)
    // const subscribeCancel = cancelPol.subscribe(val => {this.roomsCancelByGroup.push(val)
    // });
    // const subscribeBoard = boardType.subscribe(val => {this.roomsBoardByGroup.push(val)
    // });
    return room
  }
}
