import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";


import { CodeRoutingModule } from "./code-routing.module";
import { CodeComponent } from "./code.component";
import { FloatLabel } from "~/utils/float-label/float-label.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        CodeRoutingModule,
    ],
    declarations: [
        CodeComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class CodedModule { }
