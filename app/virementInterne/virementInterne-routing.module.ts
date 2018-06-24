import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { VirementInterneComponent } from "./virementInterne.component";

const routes: Routes = [
  { path: "", component: VirementInterneComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class VirementInterneRoutingModule {
}
