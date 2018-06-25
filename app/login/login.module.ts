import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";


import { LoginRoutingModule } from "./login-routing.module";
import { LoginComponent } from "./login.component";
import {FloatLabel} from "../utils/float-label/float-label.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        LoginRoutingModule,
        FloatLabel,
    ],
    declarations: [
    LoginComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class LoginModule { }
