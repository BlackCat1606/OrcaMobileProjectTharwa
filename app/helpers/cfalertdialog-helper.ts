import { alert } from "tns-core-modules/ui/dialogs";
import {
  CFAlertDialog,
  DialogOptions,
  CFAlertActionAlignment,
  CFAlertActionStyle,
  CFAlertStyle
} from "nativescript-cfalert-dialog";
import { constants } from "zlib";

export class CFAlertDialogHelper {
  private cfalertDialog: CFAlertDialog;

  constructor() {
    this.cfalertDialog = new CFAlertDialog();
  }

  showAlert(blur: boolean): void {
    this.cfalertDialog.show({
      dialogStyle: CFAlertStyle.ALERT,
      title: "Alert! Run 4 your life! 😱",
      backgroundBlur: blur,
      onDismiss: () => console.log("showAlert dismissed")
    });
  }

  showNotification(): void {
    const options: DialogOptions = {
      dialogStyle: CFAlertStyle.NOTIFICATION,
      title: "This is a notification!",
      message: "It is shown at the top of the screen, and the background is blurry (on iOS).",
      backgroundBlur: true,
      onDismiss: dialog => console.log(`Dialog was dismissed: ${dialog}`),
      buttons: [{
        text: "Okay",
        buttonStyle: CFAlertActionStyle.POSITIVE,
        buttonAlignment: CFAlertActionAlignment.END,
        textColor: "#eee",
        backgroundColor: "#888",
        onClick: response => console.log(`Button pressed: ${response}`)
      }]
    };
    this.cfalertDialog.show(options);
  }

  showBottomSheet(): void {
    const onSelection = response => {
      alert({
        title: "Your selection:",
        message: response,
        okButtonText: "OK"
      });
    };

    const options: any = {
      dialogStyle: CFAlertStyle.BOTTOM_SHEET,
      title: "This is a bottom sheet!",
      message: "It is shown at the bottom of the screen",
      buttons: [
        {
          text: "Okay",
          buttonStyle: CFAlertActionStyle.POSITIVE,
          buttonAlignment: CFAlertActionAlignment.JUSTIFIED,
          onClick: onSelection
        },
        {
          text: "Nope",
          buttonStyle: CFAlertActionStyle.NEGATIVE,
          buttonAlignment: CFAlertActionAlignment.JUSTIFIED,
          onClick: onSelection
        }]
    };
    this.cfalertDialog.show(options);
  }

  showSimpleList(): void {
    const items: any = ["Tomato", "Potato", "Carrot", "Spinach"];
    const options: DialogOptions = {
      dialogStyle: CFAlertStyle.ALERT,
      title: "This is a simple list!",
      simpleList: {
        items: items,
        onClick: (dialogInterface, index) => {
          alert({
            title: "Your selection:",
            message: items[index],
            okButtonText: "OK"
          });
        }
      }
    };
    this.cfalertDialog.show(options);
  }

  showSingleChoiceList(): void {
    const items: any = ["Vers un de Vos Comptes",
      "Vers un autre client Tharwa",
      "Vers un compte externe"];
    let selection: string;
    const options: any = {
      dialogStyle: CFAlertStyle.ALERT,
      title: "Choisissez un type de virement",
      singleChoiceList: {
        items: items,
        selectedItem: 2,
        onClick: (dialog, index) => {
          selection = items[index];
          console.log(`Option selected: ${selection}`);
        }
      },
      buttons: [
        {
          text: "Confirmer",
          buttonStyle: CFAlertActionStyle.POSITIVE,
          buttonAlignment: CFAlertActionAlignment.JUSTIFIED,
          onClick: (pressedButton: string) => {
            alert({
              title: "You selected:",
              message: selection,
              okButtonText: "OK"
            });
          }
        },
        {
          text: "Annuler",
          buttonStyle: CFAlertActionStyle.NEGATIVE,
          buttonAlignment: CFAlertActionAlignment.JUSTIFIED,
        }

      ]
    };
    this.cfalertDialog.show(options);
  }
}
