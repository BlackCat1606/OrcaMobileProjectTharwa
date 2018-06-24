import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { VirementExterneComponent } from "./virementExterne.component";

const routes: Routes = [
  { path: "", component: VirementExterneComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class VirementExterneRoutingModule {
}
