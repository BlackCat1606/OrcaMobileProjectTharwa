import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { RouterExtensions } from 'nativescript-angular/router';
import * as dialogs from "ui/dialogs";
import { Location } from "@angular/common";
import { UserService } from "../shared/user/user.service";
import { User } from "../shared/user/user";
import { InfoService } from "../shared/info/info.service";

@Component({
    moduleId: module.id,
    providers: [UserService, InfoService],
    selector: 'ns-editProfil',
    templateUrl: './editProfil.component.html',
    styleUrls: ["./editProfil-common.css", "./editProfil.css"]
})
export class EditProfilComponent implements OnInit {
    user: User;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private location: Location,
        private userService: UserService,
        private infoService: InfoService) { }

    ngOnInit() {
        this.user = new User(1);
        this.route.queryParams.subscribe((params) => {
            this.user.firstname = params["'firstname'"];
            this.user.lastname = params["'lastname'"];
            this.user.email = params["'email'"];
            this.user.job = params["'job'"];
            this.user.address = params["'address'"];
            this.user.phone = params["'phone'"];
        });
    }
    goBack() {
    this.location.back();
    }
    goProfile() {
        this.router.navigate(["/profile"]);
    }
    goNotifications() {
        this.router.navigate(["/notifications"]);
    }

    changePWD() {
        dialogs.prompt({
            title: "Changer Mot De Passe",
            message: "Veuillez inserer votre nouveau mot de passe",
            okButtonText: "CONFIRMER",
            cancelButtonText: "ANNULER",
            inputType: dialogs.inputType.password
        });
    }
}
