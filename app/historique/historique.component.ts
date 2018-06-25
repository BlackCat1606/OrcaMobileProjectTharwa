import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { UserService } from "../shared/user/user.service";
import { User } from "../shared/user/user";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { InfoService } from "../shared/info/info.service";
import { Info } from "../shared/info/info";
import { TabView, SelectedIndexChangedEventData } from "ui/tab-view";
import { VirementService } from '../shared/virement/virement.service';
import { Virement } from '../shared/virement/virement';
import { Historical } from '../shared/Historical/historical';
import { HistoricalService } from '../shared/Historical/historical.service';
import { NULL_INJECTOR } from '@angular/core/src/render3/component';
import { tharwaAnimations } from '~/utils/animations';
import { Config } from '~/shared/config';
import { PluginInfoWrapper } from '~/shared/plugin-info-wrapper';
import { FeedbackHelper } from '~/helpers/feedback-helper';
import { CFAlertDialogHelper } from '~/helpers/cfalertdialog-helper';
import { CFAlertDialog } from 'nativescript-cfalert-dialog';
import { FancyalertHelper } from '~/helpers/fancyalert-helper';
import { ModalDialogService } from 'nativescript-angular';
import { AppComponent } from '~/app.component';
import { SnackbarHelper } from '~/helpers/snackbar-helper';
import { ToastHelper } from '~/helpers/toast-helper';
import { LocalNotificationsHelper } from '~/feedback/helpers/localnotifications-helper';
import { AbstractMenuPageComponent } from '~/abstract-menu-page-component';
import { PluginInfo } from '~/shared/plugin-info';

@Component({
    moduleId: module.id,
    selector: 'Historique',
    templateUrl: './historique.component.html',
    providers: [UserService, InfoService, VirementService, HistoricalService],
    styleUrls: ["./historique-common.css", "./historique.css"],
    animations: [tharwaAnimations]
})
export class HistoriqueComponent extends AbstractMenuPageComponent implements OnInit {

    @ViewChild('scrollView') scrollView: ElementRef;

    virements: Array<Virement> = [];
    cfalertDialog: CFAlertDialog;
    fancyAlertHelper: FancyalertHelper;
    cfalertDialogHelper: CFAlertDialogHelper;
    feedbackHelper: FeedbackHelper;
    localNotificationsHelper: LocalNotificationsHelper = new LocalNotificationsHelper();
    snackbarHelper: SnackbarHelper;
    toastHelper: ToastHelper;
    isLoading = false;
    cpt = 0;
    user: User;
    info: Info;
    historicalArray: Array<Historical> = new Array<Historical>();
    historical: Historical;
    date: string;
    hour: string;
    avatar: string;

    myItems: Array<string> = [];
    counter = 0;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private historicalService: HistoricalService,
        protected appComponent: AppComponent,
        protected vcRef: ViewContainerRef,
        protected modalService: ModalDialogService,
        protected routerExtensions: RouterExtensions) {
        super(appComponent, vcRef, modalService);
        this.fancyAlertHelper = new FancyalertHelper();
        this.cfalertDialog = new CFAlertDialog();
        this.cfalertDialogHelper = new CFAlertDialogHelper();
        this.feedbackHelper = new FeedbackHelper();
        this.historicalArray = [];
    }

    ngOnInit(): void {
        this.showHistorical(Config.access_token, "0");
    }

    showHistorical(accessToken, typeCompte) {
        console.log("attente");
        this.historicalService.getHistorical(accessToken, typeCompte)
            .subscribe(
                (response) => {
                    response = response.json();
                    let i = 0;
                    console.log("attente de connexion");
                    while (response["historique"][i] != null) {
                        console.log("booooocle" + i);
                        this.historical = new Historical();
                        this.historical.montant = response["historique"][i]["montant"].toFixed(2).replace(/./g, function (c, i, a) {
                            return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                        });

                        console.log(response["historique"][i]["Interlocuteur"]);
                        if (response["historique"][i]["Interlocuteur"] === null) {
                            if (response["historique"][i]["em_rec"] === 0) {
                                this.historical.montant = "-" + this.historical.montant;
                                if (response["historique"][i]["typeem"] === 0) {
                                    this.historical.montant = this.historical.montant + " DZD";
                                    this.historical.commission = "commission = " + response["historique"][i]["commission"] + " DZD";
                                }
                                if (response["historique"][i]["typeem"] === 1) {
                                    this.historical.montant = this.historical.montant + " DZD";
                                    this.historical.commission = "commission = " + response["historique"][i]["commission"] + " DZD";
                                }
                                if (response["historique"][i]["typeem"] === 2) {
                                    this.historical.montant = this.historical.montant + " €";
                                    this.historical.commission = "commission = " + response["historique"][i]["commission"] + " €";
                                }
                                if (response["historique"][i]["typeem"] === 3) {
                                    this.historical.montant = this.historical.montant + " $";
                                    this.historical.commission = "commission = " + response["historique"][i]["commission"] + " $";
                                }
                                if (response["historique"][i]["typedest"] === 0) {
                                    this.historical.interlocuteur = "Compte Courant";
                                    this.historical.avatar = "res://av_cmpt_courant";
                                }
                                if (response["historique"][i]["typedest"] === 1) {
                                    this.historical.interlocuteur = "Compte Epargne";
                                    this.historical.avatar = "res://av_cmpt_epargne";
                                }
                                if (response["historique"][i]["typedest"] === 2) {
                                    this.historical.interlocuteur = "Compte Devise EURO";
                                    this.historical.avatar = "res://av_cmpt_euro";
                                }
                                if (response["historique"][i]["typedest"] === 3) {
                                    this.historical.interlocuteur = "Compte Devise DOLLAR";
                                    this.historical.avatar = "res://av_cmpt_dollar";
                                }
                            } else {
                                this.historical.commission = "";
                                this.historical.montant = "+" + this.historical.montant;
                                if (response["historique"][i]["typeem"] === 0) {
                                    this.historical.interlocuteur = "Compte Courant";
                                    this.historical.montant = this.historical.montant + " DZD";
                                    this.historical.avatar = "res://av_cmpt_courant";
                                }
                                if (response["historique"][i]["typeem"] === 1) {
                                    this.historical.interlocuteur = "Compte Epargne";
                                    this.historical.montant = this.historical.montant + " DZD";
                                    this.historical.avatar = "res://av_cmpt_epargne";
                                }
                                if (response["historique"][i]["typeem"] === 2) {
                                    this.historical.interlocuteur = "Compte Devise EURO";
                                    this.historical.montant = this.historical.montant + " €";
                                    this.historical.avatar = "res://av_cmpt_euro";
                                }
                                if (response["historique"][i]["typeem"] === 3) {
                                    this.historical.interlocuteur = "Compte Devise DOLLAR";
                                    this.historical.montant = this.historical.montant + " $";
                                    this.historical.avatar = "res://av_cmpt_dollar";
                                }
                            }

                            this.historical.dateTime = response["historique"][i]["date"];
                            this.historical.typeEm = response["historique"][i]["typeem"];
                            this.historical.typeDest = response["historique"][i]["typedest"];
                            this.historical.type = response["historique"][i]["type"];
                            this.historical.emRec = response["historique"][i]["em_rec"];
                            this.historical.date = this.historical.dateTime.substring(0, 10);
                            this.historical.time = this.historical.dateTime.substring(11, 16);

                            this.historicalArray.push(this.historical);

                        } else {
                            console.log("Historique Externe");
                            if (response["historique"][i]["em_rec"] === 0) {
                                this.historical.montant = "-" + this.historical.montant + " DZD";
                                this.historical.commission = "commission = " + response["historique"][i]["commission"] + " DZD";

                            } else {
                                this.historical.commission = "";
                                this.historical.montant = "+" + this.historical.montant + " DZD";
                            }

                            this.historical.interlocuteur = response["historique"][i]["Interlocuteur"];
                            this.historical.dateTime = response["historique"][i]["date"];
                            this.historical.emRec = response["historique"][i]["em_rec"];
                            this.historical.avatar = "res://ic_avatar";
                            this.historical.date = this.historical.dateTime.substring(0, 10);
                            this.historical.time = this.historical.dateTime.substring(11, 16);

                            this.historicalArray.push(this.historical);
                        }
                        i++;
                    }
                });
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
