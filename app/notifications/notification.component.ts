import { Component, OnInit, ViewChild, ElementRef, ViewContainerRef, NgZone } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { UserService } from "../shared/user/user.service";
import { User } from "../shared/user/user";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Info } from "../shared/info/info";
import { Virement } from '../shared/virement/virement';
import { Notification } from '../shared/notification/notification';
import { tharwaAnimations } from '~/utils/animations';
import { Config } from '~/shared/config';
import { ModalDialogService } from 'nativescript-angular';
import { AppComponent } from '~/app.component';
import { AbstractMenuPageComponent } from '~/abstract-menu-page-component';
import { PluginInfo } from '~/shared/plugin-info';
import { NotificationService } from '~/shared/notification/notifications.service';
import { PluginInfoWrapper } from '~/shared/plugin-info-wrapper';
import { RadListViewComponent } from 'nativescript-ui-listview/angular/listview-directives';
import { ListViewEventData } from 'nativescript-ui-listview';
import { Color } from 'tns-core-modules/color/color';
import { View, layout } from 'tns-core-modules/ui/page/page';

@Component({
    moduleId: module.id,
    selector: 'notification',
    templateUrl: './notification.component.html',
    providers: [UserService, NotificationService],
    styleUrls: ["./notification-common.css", "./notification.css"],
    animations: [tharwaAnimations]
})
export class NotificationComponent extends AbstractMenuPageComponent implements OnInit {

    @ViewChild('scrollView') scrollView: ElementRef;
    virements: Array<Virement> = [];
    isLoading = false;
    cpt = 0;
    user: User;
    info: Info;
    notificationArray: Array<Notification> = new Array<Notification>();
    notification: Notification;
    date: string;
    hour: string;
    avatar: string;
    myItems: Array<string> = [];
    counter = 0;
    suppressAppIconChangedNotification: boolean = false;
    private animationApplied = false;
    private leftItem: View;
    private rightItem: View;
    private mainView: View;
    loadingUser: boolean = true;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private zone: NgZone,
        private userService: UserService,
        private NotificationService: NotificationService,
        protected appComponent: AppComponent,
        protected vcRef: ViewContainerRef,
        protected modalService: ModalDialogService,
        protected routerExtensions: RouterExtensions) {
        super(appComponent, vcRef, modalService);
        this.notificationArray = [];
    }
    @ViewChild("notificationsListView") listViewComponent: RadListViewComponent;

    ngOnInit(): void {
        this.showNotification(Config.access_token);
    }

    showNotification(accessToken) {
        console.log("attente");
        this.NotificationService.getNotifications(accessToken)
            .subscribe(
                (response) => {
                    response = response.json();
                    let i = 0;
                    console.log("attente de connexion");
                    while (response["accountNotifications"][i] != null) {
                        console.log("booooocle" + i);
                        this.notification = new Notification();
                        this.notification.idNotification = response["accountNotifications"][i]["IdNotification"];
                        this.notification.montant = response["accountNotifications"][i]["Montant"].toFixed(2).replace(/./g, function (c, i, a) {
                            return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                        });
                        this.notification.evenement = response["accountNotifications"][i]["Evenement"];
                        this.notification.typeCompteEmetteur = response["accountNotifications"][i]["TypeCompteEmetteur"];
                        this.notification.typeCompteRecepteur = response["accountNotifications"][i]["TypeCompteRecepteur"];
                        this.notification.client = response["accountNotifications"][i]["ClientCorrespondant"];
                        this.notification.etat = response["accountNotifications"][i]["ClientCorrespondant"];

                        switch (this.notification.typeCompteEmetteur) {

                            case 0: this.notification.avatar = "res://av_cmpt_courant";
                                break;
                            case 1: this.notification.avatar = "res://av_cmpt_epargne";
                                break;
                            case 2: this.notification.avatar = "res://av_cmpt_euro";
                                break;
                            case 3: this.notification.avatar = "res://av_cmpt_dollar";
                                break;
                            default: this.notification.avatar = "res://av_cmpt_courant";
                                break;
                        }
                        this.notificationArray.push(this.notification);
                    }
                    i++;
                },
                (error) => {
                    this.feedbackHelper.showError("Erreur de chargement de donées", error["message"]);
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

    onItemLoading(args: ListViewEventData) {
        args.view.backgroundColor = new Color(args.index % 2 === 0 ? "#ffa539" : "#f39c38");
    }

    onSwipeCellFinished(args: ListViewEventData) {
        if (args.data.x > 200) {
            console.log("Perform left action");
        } else if (args.data.x < -200) {
            console.log("Perform right action");
        }
        this.animationApplied = false;
    }

    onSwipeCellStarted(args: ListViewEventData) {
        const swipeLimits = args.data.swipeLimits;
        swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.2; // 20% of whole width
        swipeLimits.left = args['mainView'].getMeasuredWidth() * 0.65; // 65% of whole width
        swipeLimits.right = args['mainView'].getMeasuredWidth() * 0.35; // 35% of whole width
    }

    onCellSwiping(args: ListViewEventData) {
        const swipeView = args['swipeView'];
        this.mainView = args['mainView'];
        this.rightItem = swipeView.getViewById('right-stack');

        if (args.data.x <= 0) {

            const rightDimensions = View.measureChild(
                <View>this.rightItem.parent,
                this.rightItem,
                layout.makeMeasureSpec(Math.abs(args.data.x), layout.EXACTLY),
                layout.makeMeasureSpec(this.mainView.getMeasuredHeight(), layout.EXACTLY));

            View.layoutChild(<View>this.rightItem.parent, this.rightItem, this.mainView.getMeasuredWidth() - rightDimensions.measuredWidth, 0, this.mainView.getMeasuredWidth(), rightDimensions.measuredHeight);
            this.hideOtherSwipeTemplateView("right");
        }
    }


    onRightSwipeClick(args) {
        const notification = <Notification>args.object.bindingContext;
        this.listViewComponent.listView.notifySwipeToExecuteFinished();
    }

    hideOtherSwipeTemplateView(currentSwipeView: string) {
        switch (currentSwipeView) {
            case "right":
                if (this.leftItem.getActualSize().width !== 0) {
                    View.layoutChild(<View>this.leftItem.parent, this.leftItem, 0, 0, 0, 0);
                }
                break;
            default:
                break;
        }
    }

}
