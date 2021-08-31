import { BreakpointObserver } from "@angular/cdk/layout";
import { Component, OnInit } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "../api.service";
import { HotelConfig } from "../types";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  isMobile: boolean =false;
  xs: boolean = false;

  langs = [
    { value: "Turkish", viewValue: "TR" },
    { value: "English", viewValue: "EN" },
    { value: "Russian", viewValue: "RU" },
  ];

  currencys = [
    { value: "TL", viewValue: "TL" },
    { value: "USD", viewValue: "USD" },
    { value: "EUR", viewValue: "EUR" },
    { value: "GBP", viewValue: "GBP" },
  ];

  constructor(
    breakpointObserver: BreakpointObserver,
    public apiService : ApiService,
    ) {
    breakpointObserver
      .observe(["(max-width: 959px)", "(max-width: 599px)"])
      .subscribe((value) => {
        this.isMobile = value.breakpoints["(max-width: 959px)"];
        this.xs = value.breakpoints["(max-width: 599px)"];
      });
  }

  ngOnInit(): void {
    window.onscroll = function() {
      if(window.pageYOffset>50) {
        (<HTMLInputElement>document.querySelector(".sidenav")).style.top="0px";
      } else {
        (<HTMLInputElement>document.querySelector(".sidenav")).style.top="50px";
      }      
    };    
  }
}
