import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";


import {FloatLabel} from "../utils/float-label/float-label.component";
import { Page2Component } from "~/rpage2/page2.component";
import { Page2RoutingModule } from "~/rpage2/page2-routing.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        Page2RoutingModule,
    ],
    declarations: [
    Page2Component,
    FloatLabel,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class Page2Module { }
