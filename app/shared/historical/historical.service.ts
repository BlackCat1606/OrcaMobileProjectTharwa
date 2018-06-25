import { Injectable, OnInit } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Historical } from "./historical";

import { Config } from "../config";

@Injectable()
export class HistoricalService implements OnInit {
  ngOnInit() {

  }
  constructor(private http: Http) { }
  getHistorical(accessToken: string, typeCompte: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("token", accessToken);
    let body = "type=" + typeCompte;
    return this.http.post(Config.apiAddress + '/clients/historique', body, { headers: headers });
  }
}