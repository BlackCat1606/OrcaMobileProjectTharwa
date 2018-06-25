import { Component, OnInit, ViewChild, NgZone} from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { User } from "../shared/user/user";
import { UserService } from "../shared/user/user.service";
import { Page } from "ui/page";
import * as dialogs from "ui/dialogs";
import { CurrentUser } from "../shared/CurrentUser";
import { Config } from "../shared/config";
import { isIOS } from "platform";
import { RouterExtensions } from "nativescript-angular";
import { tharwaAnimations } from "~/utils/animations";
import { FancyalertHelper } from "~/helpers/fancyalert-helper";
import { CFAlertDialogHelper } from "~/helpers/cfalertdialog-helper";
import { FeedbackHelper } from "~/helpers/feedback-helper";

import { CFAlertDialog, CFAlertStyle, CFAlertActionStyle, CFAlertActionAlignment, CFAlertGravity } from "nativescript-cfalert-dialog";
import { SocketIO } from "nativescript-socketio";
@Component({
  selector: "login",
  templateUrl: "./login.html",
  providers: [UserService],
  styleUrls: ["./login-common.css", "./login.css"],
  animations: [tharwaAnimations]
})
export class LoginComponent  implements OnInit {
  ///// Variables
  user: User; viaSMS = false; choice: string = ""; viaMail = false;
  myCode; access_token; refresh_token; isIOS: boolean = isIOS; isTablet: boolean = Config.isTablet;
  fancyAlertHelper: FancyalertHelper; cfalertDialogHelper: CFAlertDialogHelper;
  feedbackHelper: FeedbackHelper; cfalertDialog: CFAlertDialog;
  //// Constructeur
  constructor(
    private router: Router,
    private userService: UserService,
    private page: Page,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    protected routerExtensions: RouterExtensions,
    protected socketIO: SocketIO) {
    this.user = new User(0);
    this.choice = "";
    this.fancyAlertHelper = new FancyalertHelper();
    this.cfalertDialog = new CFAlertDialog();
    this.cfalertDialogHelper = new CFAlertDialogHelper();
    this.feedbackHelper = new FeedbackHelper();
  }
//// Initialisation
ngOnInit() {
    this.page.actionBarHidden = true;
    this.user.email = "em_hammi@esi.dz";
    this.user.password = "orca@2018";

    /*this.page.backgroundImage = "res://bg_login";
     this.route.queryParams.subscribe(params => {
       this.user.firstname = params["firstname"],
           this.user.lastname = params["lastname"],
           this.user.email = params["mail"],
           this.user.password = params["password"],
           this.user.picture = params["picture"],
           this.user.address = params["address"],
           this.user.job = params["job"];
   });
   CurrentUser.currentUser.firstname =this.user.firstname;
   CurrentUser.currentUser.lastname = this.user.lastname;
   CurrentUser.currentUser.email = this.user.email;
   CurrentUser.currentUser.password = this.user.password;
   CurrentUser.currentUser.picture = this.user.picture;
   CurrentUser.currentUser.address = this.user.address;
   CurrentUser.currentUser.job =  this.user.job;*/
  }
/// Validation d'input, requéte d'authenitfication et passage de paramétres vers la page prochaine
toNextPage() {
    if (this.viaMail || this.viaSMS) {
      this.userService.authentifier(this.user, this.choice)
        .subscribe(
          (response) => {
            response = response.json();
            this.myCode = response["code"];
            this.access_token = response["access_token"];
            Config.access_token = this.access_token;
            this.refresh_token = response["refresh_token"];
            Config.refresh_token = this.refresh_token;
            console.log(this.myCode);
            let navigationExtras: NavigationExtras = {
              queryParams: {
                "phone": this.user.phone,
                "mail": this.user.email,
                "code": this.myCode
              }
            };
            this.router.navigate(["/code"], navigationExtras);
          },
          (error) => {
            this.gererMessages(error);
            console.log(error);
          }
        );
    }
    else {
      this.feedbackHelper.showError("Champs Manquants", "Veuillez remplir tous les champs");
         }
  }
/// Aller vers la page d'inscription
register() {
    this.router.navigate(["/register"]);
  }
/// Gérer les messages d'erreurs du Serveur
gererMessages(error) {
    switch (error.code) {
      case 200: this.fancyAlertHelper.showSuccess("Connexion Réussite", "Bienvenu a Tharwa");
        break;
      case 400: this.fancyAlertHelper.showError("Erreur d'authentification !", error.message );
        break;
      case 404: this.fancyAlertHelper.showError("Utilisateur non trouvé !", error.message);
        break;
      case 500: this.fancyAlertHelper.showError("Erreur Serveur ", error.message);
        break;
    }
  }
/// choisir le type de validation d'authentification et faire la requéte
submit(): void {
    if (this.user.email && this.user.password) {
    const items: any = ["Email", "SMS"];
    let selection: string;
    const options: any = {
      dialogStyle: CFAlertStyle.ALERT,
      title: "Confirmation de Connexion",
      titleColor: "#F64060",
      textAlignment: CFAlertGravity.CENTER_HORIZONTAL,
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
            if (selection === "Email") {
              this.choice = "0";
              this.viaMail = true;
              this.toNextPage();
            } else if (selection === "SMS") {
              this.choice = "1";
              this.viaSMS = true;
              this.toNextPage();
            }
          }
        },
        {
          text: "Annuler",
          buttonStyle: CFAlertActionStyle.NEGATIVE,
          buttonAlignment: CFAlertActionAlignment.JUSTIFIED,
          onClick: (pressedButton: string) => {
        }, }]
    };
    this.cfalertDialog.show(options);
  }
  else {
    this.feedbackHelper.showError("Champs Manquants", "Veuillez remplir tous les champs");
  }
}
}