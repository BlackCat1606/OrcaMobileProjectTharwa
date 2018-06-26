import { Injectable, OnInit } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Notification } from "./notification";

import { Config } from "../config";

@Injectable()
export class NotificationService implements OnInit {
  ngOnInit() {
  }
  constructor(private http: Http) { }
  getNotifications(accessToken: string) {
    let headers = new Headers();
    headers.append("token", accessToken);
    return this.http.get (Config.apiAddress + '/notification/unread', { headers: headers });
  }
}