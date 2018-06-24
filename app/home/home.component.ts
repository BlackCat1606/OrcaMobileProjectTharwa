import { Component, OnInit, ViewContainerRef } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { AbstractMenuPageComponent } from "../abstract-menu-page-component";
import { Config } from "../shared/config";
import { ModalDialogService, RouterExtensions } from "nativescript-angular";
import { PluginInfo } from "../shared/plugin-info";
import { PluginInfoWrapper } from "../shared/plugin-info-wrapper";
import { AppComponent } from "~/app.component";
import { tharwaAnimations } from "~/utils/animations";

@Component({
  selector: "page-home",
  moduleId: module.id,
  templateUrl: "./home.component.html",
  styleUrls: ["home-common.css"],
  animations: [tharwaAnimations]
})
export class HomeComponent extends AbstractMenuPageComponent implements OnInit {
  constructor(
    protected appComponent: AppComponent,
    protected vcRef: ViewContainerRef,
    protected modalService: ModalDialogService,
    protected routerExtensions: RouterExtensions
  ) {
    super(appComponent, vcRef, modalService);
  }

  ngOnInit(): void {
    // for quick dev-nav
    if (!Config.isProdMode && Config.DEBUG_MODE.firstPage !== "/menu") {
      setTimeout(() => {
        this.routerExtensions.navigate([Config.DEBUG_MODE.firstPage], {
          animated: false
        });
      }, 200);
    }
  }

  protected getPluginInfo(): PluginInfoWrapper {
    return new PluginInfoWrapper(
      "This NativeScript plugin showcases app has an info-icon on every page, showing which plugins are used. Those listed below are used app-wide. Like these plugins, this app is open source as well: goo.gl/7HUAXa",
      Array.of(
        new PluginInfo(
          "nativescript-gradient",
          "Gradient",
          "https://github.com/EddyVerbruggen/nativescript-gradient",
          "All pages (including the menu) have a nice top-to-bottom gradient. You obviously need to have this to be taken seriously as an app. 🤔"),

        new PluginInfo(
          "nativescript-appavailability",
          "App Availability",
          "https://github.com/EddyVerbruggen/nativescript-appavailability",
          "Used at the bottom ↙️ of the menu to determine whether or not you have the Twitter app installed."
        ),

        new PluginInfo(
          "nativescript-ui-sidedrawer",
          "NativeScript UI SideDrawer",
          "https://www.npmjs.com/package/nativescript-ui-sidedrawer",
          "The SideDrawer is one of the components that used to be part of Progress NativeScript UI, but now lives on its own. For other components see https://www.npmjs.com/package/nativescript-pro-ui."
        ),

        new PluginInfo(
          "nativescript-ngx-fonticon",
          "Font icon",
          "https://github.com/NathanWalker/nativescript-ngx-fonticon",
          "Makes it easy to use font icons with NativeScript. We're using materialdesignicons.com"
        )
      )
    );
  }
}
