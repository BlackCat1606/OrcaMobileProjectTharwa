import { Component, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { UserService } from "../shared/user/user.service";
import { User } from "../shared/user/user";
import { Router , ActivatedRoute, NavigationExtras} from "@angular/router";
import { Compte } from "../shared/compte/compte";
import { InfoService } from "../shared/info/info.service";
import { Info } from "../shared/info/info";
import { TabView, SelectedIndexChangedEventData } from "ui/tab-view";
import { registerElement } from "nativescript-angular/element-registry";
import { Config } from "~/shared/config";
import { AbstractMenuPageComponent } from "~/abstract-menu-page-component";
import { AppComponent } from "~/app.component";
import { ModalDialogService } from "nativescript-angular";
import { PluginInfoWrapper } from "~/shared/plugin-info-wrapper";
import { PluginInfo } from "~/shared/plugin-info";
registerElement("Fab", () => require("nativescript-floatingactionbutton").Fab);

@Component({
    selector: "profile",
    moduleId: module.id,
    providers : [UserService, InfoService],
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.css"]
})
export class ProfileComponent extends AbstractMenuPageComponent implements OnInit {

    refresh_token;
    access_token;
    expires;
    user: User;
    fullName: string;
    info: Info;
    comptes: Array<any>;
    titles: Array<any>;
    compte: Compte;
    title: string;

    students = ["Courant", "Epargne", "Devise Euro", "Devise Dollar"];
    constructor(private router: Router,
        private route:  ActivatedRoute,
        protected menuComponent: AppComponent,
        protected vcRef: ViewContainerRef,
        protected modalService: ModalDialogService,
        private userService: UserService,
        private infoService: InfoService) {
        super(menuComponent, vcRef, modalService);
    }
    cpt = 0;
    ngOnInit(): void {
        this.user = new User(1);
      // Get user Info
        console.log("Attente de connexion");
        this.userService.getInfo( Config.access_token)
            .subscribe(
                (response) => {
                    console.log("récupération des données en cours");
                    response = response.json();

                    this.user.firstname = response["Prenom"];
                    this.user.lastname = response["Nom"];
                    this.fullName = this.user.firstname + " " + this.user.lastname;
                    console.log(this.fullName);
                    this.user.email = response["id"];
                    this.user.address = response["Adresse"];
                    this.user.job = response["Etudiante"];
                    this.user.phone = response["Tel"];

                    let i = 0;

                    while (response["comptes"][i] != null) {
                        console.log("indeeex ", i);
                        this.compte = new Compte();
                        this.compte.numCompte = response["comptes"][i]["Num"];
                        this.compte.etat = response["comptes"][i]["Etat"];
                        this.compte.type = response["comptes"][i]["TypeCompte"];
                        switch (this.compte.type) {

                            case 0: this.compte.balance = response["comptes"][i]["Balance"].toFixed(2).replace(/./g, function (c, i, a) {
                                return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                            }) + " DZD";
                                break;
                            case 1: this.compte.balance = response["comptes"][i]["Balance"].toFixed(2).replace(/./g, function (c, i, a) {
                                return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                            }) + " DZD";
                                break;
                            case 2: this.compte.balance = response["comptes"][i]["Balance"].toFixed(2).replace(/./g, function (c, i, a) {
                                return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                            }) + " EUR";
                                break;
                            case 3: this.compte.balance = response["comptes"][i]["Balance"].toFixed(2).replace(/./g, function (c, i, a) {
                                return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                            }) + " USD";
                                break;
                        }

                        console.log("num compte" + this.compte.numCompte);
                        console.log("balance " + this.compte.balance);
                        console.log("type" + this.compte.type);
                        i++;
                        this.comptes.push(this.compte);
                        // console.log(response["comptes"][i]["TypeCompte"]);

                    }
                    // console.log(response["comptes"][0]["Num"]);
                },
                (error) => {
                    this.feedbackHelper.showError("Erreur!", error);
                }
            );
    }

    Next() {
        let navigationExtras: NavigationExtras;
        navigationExtras = {
            queryParams: {
                "'lastname'": this.user.lastname,
                "'firstname'": this.user.firstname,
                "'email'": this.user.email,
                "'job'": this.user.job,
                "'adresse'": this.user.address,
                "'phone'": this.user.phone
            }
        };
        console.log("Neeeeeeeeeext");
        this.router.navigate(["/editProfil"], navigationExtras);
    }
    goNotifications() {
        this.router.navigate(["/notifications"]);
    }
    goProfie() {
    }
    protected getPluginInfo(): PluginInfoWrapper {
        return new PluginInfoWrapper(
            "Add some 💥 to your app by going beyond the default alert. So here's a couple of alternative ways to feed something back to your users.",
            Array.of(
                new PluginInfo(
                    "nativescript-feedback",
                    "Feedback",
                    "https://github.com/EddyVerbruggen/nativescript-feedback",
                    "Non-blocking textual feedback with custom icons and any colors you like. Tap to hide these babies."
                ),

                new PluginInfo(
                    "nativescript-toast",
                    "Toast",
                    "https://github.com/TobiasHennig/nativescript-toast",
                    "A sober way of providing non-blocking feedback."
                ),

                new PluginInfo(
                    "nativescript-cfalert-dialog",
                    "CFAlert Dialog",
                    "https://github.com/shiv19/nativescript-cfalert-dialog",
                    "Need an Alert, notification, or bottom dialog? Then this one's for you!"
                ),

                new PluginInfo(
                    "nativescript-fancyalert",
                    "FancyAlert",
                    "https://github.com/NathanWalker/nativescript-fancyalert",
                    "Want to get in your user's face? Throw a highly customizable alert at them."
                ),

                new PluginInfo(
                    "nativescript-snackbar",
                    "Snackbar  🍭 🍫",
                    "https://github.com/bradmartin/nativescript-snackbar",
                    "Use a Material Design Snackbar in your app."
                ),

                new PluginInfo(
                    "nativescript-local-notifications",
                    "Local Notifications",
                    "https://github.com/EddyVerbruggen/nativescript-local-notifications",
                    "Show notifications when your app is inactive 😴. Much like push notifications, but without a server."
                )
            )
        );
    }
}
