import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { VirementInterneRoutingModule } from "./virementInterne-routing.module";
import { VirementInterneComponent } from "./virementInterne.component";
import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular/dataform-directives";
import { CommonDirectivesModule } from "~/shared/directives/common-directives.module";

@NgModule({
  imports: [
    NativeScriptCommonModule,
    VirementInterneRoutingModule,
    TNSFontIconModule,
    NativeScriptUIDataFormModule,
    CommonDirectivesModule
  ],
  declarations: [
    VirementInterneComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class VirementInterneModule { }
