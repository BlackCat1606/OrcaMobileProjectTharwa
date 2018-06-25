import { ViewContainerRef } from "@angular/core";
import { isIOS } from "platform";
import { ModalDialogOptions, ModalDialogService } from "nativescript-angular";
import { InfoModalComponent } from "./info-modal/info-modal";
import { PluginInfoWrapper } from "./shared/plugin-info-wrapper";
import { Config } from "./shared/config";
import { AppComponent } from "~/app.component";
import { CFAlertDialog } from "nativescript-cfalert-dialog";
import { FancyalertHelper } from "~/helpers/fancyalert-helper";
import { CFAlertDialogHelper } from "~/helpers/cfalertdialog-helper";
import { FeedbackHelper } from "~/helpers/feedback-helper";
import { LocalNotificationsHelper } from "~/helpers/localnotifications-helper";
import { SnackbarHelper } from "~/helpers/snackbar-helper";
import { ToastHelper } from "~/helpers/toast-helper";

export abstract class AbstractMenuPageComponent {
  cfalertDialog: CFAlertDialog;
  fancyAlertHelper: FancyalertHelper;
  cfalertDialogHelper: CFAlertDialogHelper;
  feedbackHelper: FeedbackHelper;
  localNotificationsHelper: LocalNotificationsHelper = new LocalNotificationsHelper();
  snackbarHelper: SnackbarHelper;
  toastHelper: ToastHelper;
  isIOS: boolean = isIOS;
  isTablet: boolean = Config.isTablet;

  constructor(protected appComponent: AppComponent,
    protected vcRef: ViewContainerRef,
    protected modalService: ModalDialogService) {
      this.fancyAlertHelper = new FancyalertHelper();
      this.cfalertDialog = new CFAlertDialog();
      this.cfalertDialogHelper = new CFAlertDialogHelper();
      this.feedbackHelper = new FeedbackHelper();
  }

  protected abstract getPluginInfo(): PluginInfoWrapper;

  toggleTheMenu(): void {
    this.appComponent.toggleMenu();
  }

  showPluginInfo(): void {
    const info = this.getPluginInfo();
    if (info === null) {
      return;
    }

    const options: ModalDialogOptions = {
      viewContainerRef: this.vcRef,
      context: info,
      fullscreen: false // iPhones will ignore this
    };

    if (!this.isTablet && this.isIOS) {
      UIApplication.sharedApplication.setStatusBarHiddenWithAnimation(true, UIStatusBarAnimation.Fade);
    }

    this.modalService.showModal(InfoModalComponent, options).then(() => {
      if (!this.isTablet && this.isIOS) {
        UIApplication.sharedApplication.setStatusBarHiddenWithAnimation(false, UIStatusBarAnimation.Fade);
      }
    });
  }
}
