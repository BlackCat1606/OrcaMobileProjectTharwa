import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from "@angular/core";
import { Location } from "@angular/common";
import { User } from "../shared/user/user";
import { UserService } from "../shared/user/user.service";
import { Router, NavigationExtras } from "@angular/router";
import { Page } from "ui/page";
import { tharwaAnimations } from "~/utils/animations";
import { FeedbackHelper } from "~/helpers/feedback-helper";
@Component
    ({
        moduleId: module.id,
        selector: "register",
        providers: [UserService],
        templateUrl: "./register.component.html",
        styleUrls: ["./register.css"],
        animations: [tharwaAnimations]
    })
export class RegisterComponent implements OnInit {
    public user: User;
    feedbackHelper: FeedbackHelper;
    ngOnInit() {
        this.page.actionBarHidden = true;
        this.user = new User(0);

    }
    public static us: User;
    public constructor(
        private location: Location,
        private router: Router,
        private page: Page) {
        this.user = new User(1);
        this.feedbackHelper = new FeedbackHelper();

    }
    public getUser() {
        return this.user;
    }

    public setUser(user: User) {
        this.user = user;
    }
    public goBack() {
        this.location.back();
    }
    public goSuivant() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "firstname": this.user.firstname,
                "lastname": this.user.lastname,
                "email": this.user.email,
                "password": this.user.password
            }
        };
        this.router.navigate(["/page2"], navigationExtras);

    }

    private validateEmail(email: any) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

}