import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { HistoriqueRoutingModule } from "./historique-routing.module";
import { HistoriqueComponent } from "./historique.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        HistoriqueRoutingModule
    ],
    declarations: [
        HistoriqueComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class  HistoriqueModule { }
