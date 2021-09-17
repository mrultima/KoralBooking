import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  // crypto.createHash( "sha512" ).update(Buffer.from( "asd123" , "ucs-2"  )).digest('hex').toLowerCase();
  secretKey = "XUt7WxF28kzmRHE5XEcpwCfbg2KfqYBR";
  constructor() { }

  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, this.secretKey.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  decryptSha512(textToDecrypt : string) {
    return CryptoJS.SHA512(textToDecrypt);
  }
}