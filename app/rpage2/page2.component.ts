import { Component, OnInit, ViewChild, Input, AfterViewInit, NgZone } from "@angular/core";
import { Location } from "@angular/common";
import { User } from "../shared/user/user";
import { UserService } from "../shared/user/user.service";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Page } from "ui/page";
import { session, Session } from "nativescript-background-http";
import * as camera from "nativescript-camera";
import { Subject } from "rxjs/Subject";
import { isAndroid } from "tns-core-modules/platform";
import * as fs from "file-system";
import * as imageSource from "image-source";
import * as dialogs from "ui/dialogs";
import { Config } from "../shared/config";
import { Http } from "@angular/http";
import { FeedbackHelper } from "~/helpers/feedback-helper";
import { FancyalertHelper } from "~/helpers/fancyalert-helper";
import * as bgHttp from "nativescript-background-http";
import { CFAlertDialog } from "nativescript-cfalert-dialog";


@Component
    ({
        moduleId: module.id,
        selector: "ns-page2",
        providers: [UserService],
        templateUrl: "page2.component.html",
        styleUrls: ["./page2.css"]
    })
export class Page2Component implements OnInit {
    UploadSession: Session;
    user: User;
    usedId: number = 0;
    picture: any;
    type: string;
    path: any;
    image: any;
    saved: any;
    public tasks: bgHttp.Task[] = [];
    public events: { eventTitle: string, eventData: any }[] = [];
    private file: string;
    private url: string;
    private counter: number = 0;
    private session: any;
    private cfalertDialog: CFAlertDialog;
    feedbackHelper: FeedbackHelper;
    fancyAlertHelper:   FancyalertHelper;
    ngOnInit() {

        this.page.actionBarHidden = true;
        this.picture = "res://login_logo";
        this.user = new User(0);
        this.route.queryParams.subscribe(params => {
        this.user.firstname = params["firstname"],
        this.user.lastname = params["lastname"],
        this.user.email = params["email"],
        this.user.password = params["password"];
        } );

    }

    public constructor(
        private location: Location,
        private router: Router,
        private userService: UserService,
        private page: Page,
        private route: ActivatedRoute) {
        this.feedbackHelper = new FeedbackHelper();
        this.cfalertDialog = new CFAlertDialog();
        this.UploadSession = bgHttp.session('file-upload');
        this.fancyAlertHelper =  new FancyalertHelper();
    }
    public goBack() {
        this.location.back();
    }
    public NumCompte;
    public confirmer() {
        dialogs.action({
            title: "Confirmation",
            message: "Veuillez Choisir l'option pour recevoir un code pour confirmer votre authentification ",
            cancelButtonText: "ANNULER",
            actions: ["Particulier", "Employeur"]
        }).then(result => {
            if (result === "Particulier") {
                this.type = "0";
                this.register();
            } else if (result === "Employeur") {
                this.type = "1";
                this.register();
            }
        });
    }
    public register() {
        if (this.user.firstname && this.user.lastname && this.user.email && this.user.password &&
            this.user.job && this.user.phone && this.user.address) {

            if (isAndroid) {
                this.uploadMultipartImagePicker(this.image)
                    .subscribe({
                        next: (e) => {
                            console.log(`Upload: ${(e.currentBytes / e.totalBytes) * 100}`);
                        },
                        error: (e) => {
                            console.log(JSON.stringify(e));
                            this.feedbackHelper.showError("Erreur d'inscription", JSON.stringify(e));
                        },
                        complete: () => {
                            console.log("complete");
                            this.user.picture = this.image;
                            this.feedbackHelper.showSuccess("Inscription réussite", "Bienvenu a Tharwa");
                            this.goSuivant();
                        }
                    });
            }
            else {
                if (this.saved) {
                    this.uploadMultipartImagePicker({ fileUri: this.path })
                        .subscribe({
                            next: (e) => {
                                console.log(`Upload: ${(e.currentBytes / e.totalBytes) * 100}`);
                            },
                            error: (e) => {
                                console.log(JSON.stringify(e));
                                this.feedbackHelper.showError("Erreur d'inscription", JSON.stringify(e));
                            },
                            complete: () => {
                                console.log("complete");
                                alert("inscription réussite");
                                this.feedbackHelper.showSuccess("Inscription réussite", "Bienvenu a Tharwa");
                                this.user.picture = this.image;
                                this.goSuivant();
                            }
                        });
                }
            }
        }
        else {
            this.feedbackHelper.showError("Champs Manquants", "Veuillez remplir tous les champs");
        }

    }

    public goSuivant() {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                "lastname": this.user.lastname,
                "firstname": this.user.firstname,
                "picture": this.user.picture,
                "address": this.user.address,
                "password": this.user.password,
                "phone": this.user.phone,
                "mail": this.user.email,
                "job": this.user.job
            }
        };
        this.router.navigate(["/login"], navigationExtras);
    }

    private validateEmail(email: any) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    cameraOpen() {
        camera.requestPermissions();
        camera
            .takePicture({
                saveToGallery: true,
                cameraFacing: 'front'
            })
            .then(imageAsset => {
                let image: any;
                this.picture = imageAsset;
                this.user.picture = this.picture;
                if (isAndroid) {
                    image = <any>{
                        fileUri: imageAsset.android
                    };
                    this.image = image;
                    this.picture = imageAsset;

                }
                else {

                    let source = new imageSource.ImageSource();
                    source.fromAsset(imageAsset)
                        .then(imageSource => {
                            let folder = fs.knownFolders.documents();
                            let path = fs.path.join(folder.path, "Temp" + Date.now() + ".jpg");
                            this.path = path;
                            let saved = imageSource.saveToFile(path, "jpg");
                            this.saved = saved;
                            console.log(saved);
                        });
                }
            })
            .catch(function (err) {
                console.log("Error -> " + err.message);
            });
    }

    private uploadMultipartImagePicker(image: any): Subject<any> {

        let fileUri = image.fileUri;
        let filename = fileUri.substring(fileUri.lastIndexOf('/') + 1);
        let mimetype = filename.substring(filename.lastIndexOf('.') + 1);
        let uploadType;
        let request;
        let http: Http = new Http(null, null);
        uploadType = "image";
        request = {
            url: Config.apiAddress + "/users/ClientInscription",
            method: "POST",
            headers: {
                "Content-Type": "application/form-data",
            }
        };
        let params = [
            { name: "userId", value: this.user.email },
            { name: "Nom", value: this.user.lastname },
            { name: "Prenom", value: this.user.firstname },
            { name: "UserName", value: this.user.lastname + this.user.firstname },
            { name: "Pwd", value: this.user.password },
            { name: "Tel", value: this.user.phone },
            { name: "type", value: this.type },
            { name: "Adresse", value: this.user.address },
            { name: "Fonction", value: this.user.job },
            { name: "avatar", filename: fileUri, mimeType: `${uploadType}/${mimetype}` }];
        console.log(JSON.stringify(params));
        let subject = new Subject<any>();
        let task = this.UploadSession.multipartUpload(params, request);
        task.on('progress', (e: any) => subject.next(e));
        task.on('error', (e) => subject.error(e));
        task.on('complete', (e) => subject.complete());

        return subject;
    }

    gererMessages(error) {
     this.fancyAlertHelper.showSuccess("Erreur !", error.message);
  }

}