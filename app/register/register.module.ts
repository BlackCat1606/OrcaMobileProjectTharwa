import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import {FloatLabel} from "../utils/float-label/float-label.component";
import { RegisterRoutingModule } from "~/register/register-routing.model";
import { RegisterComponent } from "~/register/register.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        RegisterRoutingModule,
    ],
    declarations: [
    RegisterComponent,
    FloatLabel,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class RegisterModule { }
