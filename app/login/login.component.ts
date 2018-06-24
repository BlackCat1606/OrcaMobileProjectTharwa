import { Component, OnInit, ViewChild, ElementRef, NgZone, ViewContainerRef } from "@angular/core";
import { Router, NavigationExtras, ActivatedRoute } from "@angular/router";
import { User } from "../shared/user/user";
import { UserService } from "../shared/user/user.service";
import { Page } from "ui/page";
import * as dialogs from "ui/dialogs";
import { CurrentUser } from "../shared/CurrentUser";
import { Config } from "../shared/config";
import { isIOS } from "platform";

import { ModalDialogService, RouterExtensions } from "nativescript-angular";
import { AppComponent } from "~/app.component";
import { tharwaAnimations } from "~/utils/animations";

@Component({
  selector: "login",
  templateUrl: "./login.html",
  providers: [UserService],
  styleUrls: ["./login-common.css", "./login.css"],
  animations: [tharwaAnimations]
})
export class LoginComponent  implements OnInit {
  public user: User;
  isLoggingIn = true;
  viaSMS = false;
  choice: string = "";
  viaMail = false;
  username = "";
  public myCode;
  public access_token;
  public refresh_token;
  isIOS: boolean = isIOS;
  isTablet: boolean = Config.isTablet;
  constructor(
    private router: Router,
    private userService: UserService,
    private page: Page,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    protected vcRef: ViewContainerRef,
    protected appComponent: AppComponent,
    protected modalService: ModalDialogService,
    protected routerExtensions: RouterExtensions) {
    this.user = new User(0);
    this.choice = "";
  }
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

  submit() {
    dialogs.action({
      title: "Confirmation",
      message: "Veuillez Choisir l'option pour recevoir un code pour confirmer votre authentification ",
      cancelButtonText: "ANNULER",
      actions: ["Email", "SMS"]
    }).then(result => {
      if (result === "Email") {
        this.choice = "0";
        this.viaMail = true;
        this.toNextPage();
      } else if (result === "SMS") {
        this.choice = "1";
        this.viaSMS = true;
        this.toNextPage();
      }
    });

  }
  public toNextPage() {
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
            alert("something went wrong : " + error);
            console.log(error);
          }
        );
    }
  }
  public register() {
    this.router.navigate(["/register"]);
  }

}