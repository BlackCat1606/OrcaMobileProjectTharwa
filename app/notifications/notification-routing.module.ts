import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { NotificationComponent } from "~/notifications/notification.component";

const routes: Routes = [
    { path: "", component: NotificationComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class NotificationRoutingModule { }
