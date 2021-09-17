import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PortalService, TranslateService, YandexMapData } from '../../shared';
import { HotelService } from '../../../';
import { timer } from 'rxjs';

@Component({
  selector: 'app-yandex-map',
  templateUrl: './yandex-map.component.html',
  styleUrls: ['./yandex-map.component.scss']
})
export class YandexMapComponent implements OnInit, AfterViewInit {
  @Output() selectedHotel = new EventEmitter();
  isInit = false;
  isMobile: boolean;
  map;
  _latestCoordinates;
  objectManager: any;
  routePanelControl;
  control;
  @Input() mapType: 'Route' | 'Points' = 'Points';
  @Input() isRouterMulti = false;

  @Input() page = null;

  constructor(
    breakpointObserver: BreakpointObserver,
    private translateService: TranslateService,
    private hotelService: HotelService,
    private portalService: PortalService,
  ) {
    breakpointObserver.observe('(max-width: 959px)').subscribe(value => {
      this.isMobile = value.matches;
    });
  }

  _data: YandexMapData[] | any;

  @Input() set data(data: Array<YandexMapData> | any) {
    if (data) {
      this._data = data;
      setTimeout(async () => {
        if (!this.isInit) {
          await this.init();
        }
        this.addMarkers();
      }, 0);
    }
  }

  @Input() set initialFocusCoordinates(coordinates: Array<number>) {
    if (coordinates && coordinates.length > 0) {

      this._latestCoordinates = coordinates;
      setTimeout(() => {
        if (this.isInit && this.map) {
          this.map.setCenter(coordinates, 10);
        }
      }, 0);
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    /**
     * To set options for single objects and clusters,
     * we refer to child collections of ObjectManager.
     */
    // objectManager.objects.options.set('preset', 'islands#greenDotIcon');
    // objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
    // this.map.geoObjects.add(objectManager);
  }

  async init() {
    this.isInit = true;

    await this.portalService.createScript({ src: 'https://api-maps.yandex.ru/2.1/?lang=en_US&apikey=a3d45d9a-d7b8-459f-a26a-73daa787594b', sync: true });

    await timer(200).toPromise();

    // @ts-ignore
    const resp = await ymaps.ready();

    if (this.isRouterMulti) {
      // @ts-ignore
      const multiRoute = new ymaps.multiRouter.MultiRoute({
        referencePoints: [...this._data]
      }, {
        boundsAutoApply: true
      });

      // @ts-ignore
      this.map = new ymaps.Map('map', {
        center: [0, 0],
        zoom: 0
      });

      this.map.geoObjects.add(multiRoute);
    } else {
      // @ts-ignore
      this.map = new ymaps.Map('map', {
        center: [0, 0],
        zoom: this._data.length === 1 ? 15 : 10,
        controls: this.mapType === 'Route' ? ['routePanelControl'] : ['fullscreenControl']
      });
    }

    if (this.mapType === 'Route') {
      if (!this.isRouterMulti) {
        this.control = this.map.controls.get('routePanelControl');
        this.control.routePanel.state.set({
          from: this._data[0],
          to: this._data[1]
        });
      }
    }

    if (this.mapType === 'Points') {
      // @ts-ignore
      this.objectManager = new ymaps.ObjectManager({
        // Setting an option to make placemarks start clusterizing.
        // ObjectManager accepts the same options as the clusterer.
        //gridSize: 32
      });
    }

    if (!this.isRouterMulti && this._latestCoordinates) {

      this.map.setCenter(this._latestCoordinates, this._data.length === 1 ? 15 : 10);
    }

    /**
     * To set options for single objects and clusters,
     * we refer to child collections of ObjectManager.
     */
    if (this.mapType === 'Points') {
      // this.objectManager.objects.options.set('preset', 'islands#greenDotIcon');
      this.objectManager.objects.options.set('preset', 'islands#redStretchyIcon');
      // this.objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');
      this.map.geoObjects.add(this.objectManager);

      this.addMarkers();
      const that = this;
      this.objectManager.objects.overlays.events.add('click', function (e) {
        that.selectedHotel.emit(that._data[e.get('objectId')]);
      });

      // TODO MOVE yandexSeeDetail btn
      document.addEventListener('yandexSeeDetail', (dd) => that.selectHotel(dd));

    }

    // this.objectManager.objects.overlays.events.add('btnClick', function (e) {
    //   that.selectedHotel.emit(that._data[e.get('objectId')]);
    // });
  }

  addMarkers() {

    if (this.mapType === 'Points') {
      const that = this;
      this.objectManager.removeAll();
      this.objectManager.add({
        'type': 'FeatureCollection',
        'features': this._data.map((x, i) => {
          return {
            'type': 'Feature',
            'id': i,
            'geometry': { 'type': 'Point', 'coordinates': x.coordinates.map(y => +y) },
            'properties': x.properties || {
              'balloonContentHeader': `<span>${x.Name}</span> <img src="${x.PhotoUrl}" alt="${x.Name}" [taCoreImageOnError]="'Hotel'" />`,
              'balloonContentBody': `
              <b>
               ${this.createBalloonContentBody(x.Stars)}
              </b>`,
              // tslint:disable-next-line:max-line-length
              'balloonContentFooter': `
        <button mat-raised-button class="mat-raised-button mat-primary" id="hotelDetailMarkerBtn"
        onclick="document.dispatchEvent(new CustomEvent('yandexSeeDetail',{ detail: {id: ${i}} }))"
         value="${i}" style="width: 100%;display: ${this.page === null ? 'none' : ''}" color="primary">${this.translateService.getKey('LBL_SEE_DETAILS')}</button>`,
              'clusterCaption': x.Name,
              'hintContent': `<b>${x.Name}</b>`,
              'iconContent': `<b style="font-size:9px;">${x.Price || x.Name}</b>`,
              'preset': 'islands#redStretchyIcon'
            }
          };
        }),
      });
    }

    if (this.mapType === 'Route') {
      if (!this.isRouterMulti) {
        this.control.routePanel.state.set({
          from: this._data[0],
          to: this._data[1]
        });

        this.map.setCenter(this._latestCoordinates, this._data.length === 1 ? 15 : 10);
      }
    }
  }

  createBalloonContentBody(count: number) {
    let content = '';
    if (count != null) {
      count = Math.floor(Math.abs(+count));
      for (let i = 0; i < count; i++) {
        content += `<mat-icon class="material-icons" style="color: #ffd740">star</mat-icon>`;
      }
      return content;
    }
  }

  // TODO(Hotel) - high MOVE yandex-map make a (selectedObject) event emit
  selectHotel(ddd) {
    if (this.mapType === 'Points') {
      return;
    }
  }

  createBalloonContentFooter(seoUrl: string) {
    const content = '';

    // tslint:disable-next-line:max-line-length
    // content = `<button mat-raised-button class="mat-raised-button mat-primary" (click)="${ this.hotelService.selectHotel(seoUrl) }" style="width: 100%;" type="button" color="primary">${ this.translateService.getKey('LBL_SEE_DETAILS') }</button>`;

    return content;
  }
}
