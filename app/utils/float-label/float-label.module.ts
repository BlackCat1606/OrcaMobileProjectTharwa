import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { FloatLabel } from "~/utils/float-label/float-label.component";
import { FloatLabelRoutingModule } from "~/utils/float-label/float-label-routing.module";



@NgModule({
    imports: [
        NativeScriptCommonModule,
        FloatLabelRoutingModule
    ],
    declarations: [
    FloatLabel,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class FloatLabelModule { }
