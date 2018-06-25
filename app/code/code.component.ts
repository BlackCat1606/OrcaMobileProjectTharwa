import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { UserService } from "../shared/user/user.service";
import { Location } from "@angular/common";
import { User } from "../shared/user/User";
import { Page } from "ui/page";
import { Config } from "../shared/config";
import { SocketIO } from "nativescript-socketio";
import { FeedbackHelper } from "~/helpers/feedback-helper";
import { CFAlertDialogHelper } from "~/helpers/cfalertdialog-helper";
import { CFAlertDialog } from "nativescript-cfalert-dialog";
import { FancyalertHelper } from "~/helpers/fancyalert-helper";
import { tharwaAnimations } from "~/utils/animations";
@Component
    ({
        selector: "code",
        moduleId: module.id,
        providers: [UserService],
        templateUrl: "./code.html",
        styleUrls: ["./code-common.css", "./code.css"],
        animations: [tharwaAnimations]
    }
    )
export class CodeComponent implements OnInit {
    time: TimeRanges; input: any; tel: string; entered: string;
    mail: string; user: User; expires;
    access_token; refresh_token;
    fancyAlertHelper: FancyalertHelper; cfalertDialog: CFAlertDialog;
    cfalertDialogHelper: CFAlertDialogHelper; feedbackHelper: FeedbackHelper;
    public goBack() {
        this.location.back();
    }
    ngOnInit() {
        this.page.actionBarHidden = false;
        this.route.queryParams.subscribe(params => {
            this.tel = params["phone"];
                this.mail = params["mail"];
                this.myCode = params["code"];
        });
        this.input = {
            recipient: this.tel,
            message: this.myCode
        };
    }
    public myCode: string;
    public constructor(private location: Location,
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private socketIO: SocketIO,
        private page: Page) {
        this.fancyAlertHelper = new FancyalertHelper();
        this.cfalertDialog = new CFAlertDialog();
        this.cfalertDialogHelper = new CFAlertDialogHelper();
        this.feedbackHelper = new FeedbackHelper();
    }
    /// Verification du code de confirmation et redirection vers la page d'acceuil
     confirm() {
        if (this.entered) {
            if (this.entered.length !== 4) {
                this.userService.sendCode(this.mail, this.entered)
                    .subscribe(
                        (response) => {
                            response = response.json();
                            this.access_token = response["access_token"];
                            Config.access_token = this.access_token;
                            this.refresh_token = response["refresh_token"];
                            Config.access_token = this.refresh_token;
                            this.expires = response["expires_in"];
                            Config.expiration = this.expires;
                            console.log(this.expires);
                            this.login(Config.access_token);
                            let navigationExtras: NavigationExtras = {
                                queryParams: {
                                    "access_token": this.access_token,
                                    "refresh_token": this.refresh_token,
                                    "expires": this.expires
                                }
                            };
                            this.router.navigate(["/home"], navigationExtras);
                        },
                        (error) => {
                            console.log("Code Error" + error);
                            this.gestionErrors(error);
                        }
                    );
            }
            else {
                this.feedbackHelper.showError("Format Incorrect!", "Le code de confirmation est de 4 chiffres !");
            }
        }
        else {
            this.feedbackHelper.showError("Champs Manquants", "Veuillez remplir tous les champs");
        }
    }
    public gestionErrors(error: any) {
        /////// Gestion des erreurs;
        this.fancyAlertHelper.showError("Erreur !", error.message);
    }
    /// Initialisation des notifications lors de l'authentification du client
    login(token: String) {
        this.socketIO.emit("connexion", token);
    }
    logout() {
        this.socketIO.emit('deconnexion', 'Salut serveur, ça va ?');
    }
}
