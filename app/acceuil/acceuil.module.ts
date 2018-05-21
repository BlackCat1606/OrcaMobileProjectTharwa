import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { AcceuilRoutingModule } from "./acceuil-routing.module";
import { AcceuilComponent } from "./acceuil.component";
import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import {registerElement} from "nativescript-angular";
registerElement("FAB", () => require("nativescript-floatingactionbutton").Fab);

@NgModule({
  imports: [
    NativeScriptCommonModule,
    AcceuilRoutingModule,
    TNSFontIconModule,
  ],
  declarations: [
    AcceuilComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AcceuilModule { }

