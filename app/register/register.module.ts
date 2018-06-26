import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { RegisterRoutingModule } from "~/register/register-routing.model";
import { RegisterComponent } from "~/register/register.component";
import { FloatLabelModule } from "~/utils/float-label/float-label.module";
@NgModule({
    imports: [
        NativeScriptCommonModule,
        RegisterRoutingModule,
    ],
    declarations: [
    RegisterComponent,
        ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class RegisterModule { }
