import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject, timer } from 'rxjs';
import { groupBy, map, mergeMap, takeUntil, tap, toArray, filter } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Room, Rooms } from '../types';

interface RoomType {  
  id:number;
  name:string;
  description:string;
  image:string;
  maxAdult:number;
  wifi:boolean;
  safe:boolean;
  hairDryer:boolean;
  balcony:boolean;
  privateBath:boolean;
  area?:string;
  maxBed:number;
  _rooms:Rooms;
  boardTypes:Array<{
    id:number;
    name:string;
    _rooms:Rooms;
    rateTypes:Array<{
      id:number;
      name:string;
      grossPrice:number;
      netPrice:number;
      currency:string;
      discountPercent:number;
      _rooms:Rooms;
    }>
  }>;
}

type RoomList = RoomType[]

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})

export class RoomsComponent implements OnInit,OnDestroy,AfterViewInit {

  room:any[] = []
  rooms: Room[]=[];
  roomsGroup:any[] = []
  roomsByGroup:any[] = [];
  roomsCancelByGroup:any[] = [];
  roomsBoardByGroup:any[] = [];
  rooms$ = new BehaviorSubject<Rooms>(null);  
  roomList$ = this.rooms$.pipe(
    filter(rooms => rooms != null),
    map(this.roomsToRoomList),
    tap(x=>console.log("roomList$",x))
  )

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
    this.roomList$.subscribe(x=>this.room.push(x))
    this.apiService.rooms$.subscribe(async (info) => {
      this.roomsByGroup = await this._groupBy(info,"RoomTypeId");
      this.roomsCancelByGroup = await this._groupBy(info,"RateType");
      this.roomsBoardByGroup = await this._groupBy(info,"BoardType");
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
  }

  roomsToRoomList(rooms:Rooms):RoomList{
    const roomTypes:{[roomTypeId:number]:Array<Room>} = {}

    const roomBoardType:{[roomTypeId:number]:Set<number>} = {}    
    const boardTypes:{[boardTypeId:string]:Array<Room>} = {}

    const rateTypes:{[rateTypeId:string]:Array<Room>} = {}
    const roomBoardTypeRateType:{[roomBoardType:string]:Set<number>} = {}

    rooms.forEach(room=> {
      roomTypes[room.RoomTypeId] = roomTypes[room.RoomTypeId] || [];
      roomTypes[room.RoomTypeId].push(room);

      roomBoardType[room.RoomTypeId] =  roomBoardType[room.RoomTypeId] || new Set();
      roomBoardType[room.RoomTypeId].add(room.BoardTypeId);

      const boardTypeKey = room.RoomTypeId +'-'+ room.BoardTypeId;
      boardTypes[boardTypeKey] = boardTypes[boardTypeKey] || [];
      boardTypes[boardTypeKey].push(room);

      roomBoardTypeRateType[boardTypeKey] = roomBoardTypeRateType[boardTypeKey] || new Set();
      roomBoardTypeRateType[boardTypeKey].add(room.RateTypeId)

      const rateTypeKey = boardTypeKey + '-' + room.RateTypeId;
      rateTypes[rateTypeKey] = rateTypes[rateTypeKey] || [];
      rateTypes[rateTypeKey].push(room);
    })

    return Object.entries(roomTypes).map(([roomTypeId,rooms]) => {
      return{
        id:rooms[0].RoomTypeId,
        name:rooms[0].RoomType,
        description:rooms[0].RoomInfo,
        maxAdult:rooms[0].RoomMaxAdult,
        image:rooms[0].RoomImageURL,
        balcony:rooms[0].Balcony,
        wifi:rooms[0].Balcony,
        safe:rooms[0].Balcony,
        privateBath:rooms[0].Balcony,
        hairDryer:rooms[0].Balcony,
        area:null,
        maxBed:rooms[0].RoomMaxBed,
        _rooms:rooms,
        boardTypes:Array.from(roomBoardType[rooms[0].RoomTypeId]).map(boardTypeId => {
          const boardTypeKey = roomTypeId+"-"+boardTypeId
          return {
            id:boardTypeId,
            name:boardTypes[boardTypeKey][0].BoardType,
            _rooms:boardTypes[boardTypeKey],
            rateTypes:Array.from(roomBoardTypeRateType[boardTypeKey]).map(rateTypeId => {
              const rateTypeKey = boardTypeKey+'-'+rateTypeId
              return {
                id:rateTypeId,
                name:rateTypes[rateTypeKey][0].RateType,
                grossPrice:rateTypes[rateTypeKey][0].Price,
                netPrice:rateTypes[rateTypeKey][0].Price,
                currency:rateTypes[rateTypeKey][0].Currency,
                discountPercent:rateTypes[rateTypeKey][0].TotalDiscountApplied,
                _rooms:rateTypes[rateTypeKey]
              }
            })
          }
        })  
      }
    })
  }

  search(){
    this.roomList$.subscribe(x => console.log(x,"roomlar"))
  }

  async onSelectRoom(){
    console.log(this.roomList$, "roomList")
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
    // const subscribeCancel = cancelPol.subscribe(val => {this.roomsCancelByGroup.push(val)
    // });
    // const subscribeBoard = boardType.subscribe(val => {this.roomsBoardByGroup.push(val)
    // });
    return room
  }
}
