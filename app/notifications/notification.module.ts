import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NotificationComponent } from "~/notifications/notification.component";
import { NotificationRoutingModule } from "~/notifications/notification-routing.module";
import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular/listview-directives";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NotificationRoutingModule,
        TNSFontIconModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        NotificationComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class NotificationModule { }
