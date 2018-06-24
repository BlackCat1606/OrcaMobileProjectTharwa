import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular/dataform-directives";
import { CommonDirectivesModule } from "~/shared/directives/common-directives.module";
import { VirementExterneComponent } from "~/virementExterne/virementExterne.component";
import { VirementExterneRoutingModule } from "~/virementExterne/virementExterne-routing.module";
@NgModule({
  imports: [
    NativeScriptCommonModule,
    VirementExterneRoutingModule,
    TNSFontIconModule,
    NativeScriptUIDataFormModule,
    CommonDirectivesModule
  ],
  declarations: [
    VirementExterneComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class VirementExterneModule { }
