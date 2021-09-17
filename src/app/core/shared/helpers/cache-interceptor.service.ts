import { Injectable } from '@angular/core';
import * as moment from 'moment'; 


@Injectable({
  providedIn: 'root'
})
export class CacheInterceptorService {

  constructor() { }

  setLocalStorage(dataValue: string, mainkey: string, key?: string) {
    const storagedata = localStorage.getItem(mainkey);
    if (storagedata && storagedata.length > 0) { // Eğer Gönderilen Key storageda varsa
      const JSONValue = JSON.parse(storagedata);
      if (Object.keys(JSONValue).length > 0) {
        for (let i = 0; i < Object.keys(JSONValue).length; i++) { // tüm elemanları dön
          if (JSONValue[i].Key !== key) { // Gelen key var mı storage da yoksa gir
            const addData = {
              Date: moment().locale('en').format('YYYY-MM-DD'),
              Data: dataValue,
              Key: key
            };
            JSONValue.push(addData);
            for (let j = 0; j <= Object.keys(JSONValue).length; j++) {
              if (this.localStorageLenght(JSON.stringify(JSONValue)) > 4) { // localstorage uzunluğu 4 den büyükse birer birer baştan sil
                JSONValue.splice(0, 1);
                j = 0;
              } else { // uzunluk 4 den küçükse storage ı güncelle
                localStorage.setItem(mainkey, JSON.stringify(JSONValue));
                j = Object.keys(JSONValue).length;
                return ;
              }
            }
          } else if (JSONValue[i].Key === key && Math.abs(+moment(moment().locale('en').format('YYYY-MM-DD')).diff(JSONValue[i].Date)) > 3) {
            // gelen key storageda var ve 3 günden eski ise güncellemek için gir
            JSONValue[i].Data = dataValue;
            JSONValue[i].Date = moment().locale('en').format('YYYY-MM-DD');
            if (this.localStorageLenght(JSON.stringify(JSONValue)) > 4) {// localstorage uzunluğu 4 den büyükse birer birer baştan sil
              for (let k = 0; k <= Object.keys(JSONValue).length; k++) {
                if (this.localStorageLenght(JSON.stringify(JSONValue)) > 4) {
                  JSONValue.splice(0, 1);
                  k = 0;
                } else {  // uzunluk 4 den küçükse storage ı güncelle
                  localStorage.setItem(mainkey, JSON.stringify(JSONValue));
                  k = Object.keys(JSONValue).length;
                  return ;
                }
              }
            } else {
              localStorage.setItem(mainkey, JSON.stringify(JSONValue));
            }
          }
        }
      }

    } else { // Gelen Key hiç storage da yoksa git ekle
      if (key != null && key !== '') {
        const dataV = {
          Date: moment().locale('en').format('YYYY-MM-DD'),
          Data: dataValue,
          Key: key
        };
        if (this.localStorageLenght(JSON.stringify([dataV])) < 4) { // gelen valu 4 MB den büyükse hiç yazma
          localStorage.setItem(mainkey, JSON.stringify([dataV]));
        }
      }
    }

  }

  getLocalStorage(mainkey: string, key?: string) {
    const data = localStorage.getItem(mainkey);
    if (data && data.length > 0) {
      const returnData = JSON.parse(data).filter(x => {
        if ( x.Key === key) {
          return x.Data;
        }
      });
      if (returnData.length > 0) {
        return returnData[0].Data;
      } else {
        return null;
      }
    }
    return null;
  }

  localStorageLenght(JSONValue: string) {
    const caches = JSON.parse(JSONValue);
    return JSON.stringify(caches).length * 2 / 1024 / 1024;
  }
}
