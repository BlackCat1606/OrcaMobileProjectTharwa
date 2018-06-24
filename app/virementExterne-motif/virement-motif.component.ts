import { Component, OnInit } from '@angular/core';
import { Virement } from '../shared/virement/virement';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { VirementService } from "../shared/virement/virement.service";
import { Config } from '../shared/config';
import * as dialogs from "ui/dialogs";
import { Location } from "@angular/common";
import * as camera from "nativescript-camera";
import { isAndroid } from "tns-core-modules/platform";
import * as fs from "file-system";
import * as imageSource from "image-source";
import { FeedbackHelper } from "../helpers/feedback-helper";
import { FancyalertHelper } from "../helpers/fancyalert-helper";
import { LocalNotificationsHelper } from "../helpers/localnotifications-helper";
import { CFAlertDialogHelper } from "../helpers/cfalertdialog-helper";
import { session, Session } from "nativescript-background-http";
import { Subject } from "rxjs/Subject";
import { tharwaAnimations } from '~/utils/animations';

@Component({
  moduleId: module.id,
  selector: 'app-virementExterne-motif',
  templateUrl: './virementExterne-motif.component.html',
  providers: [VirementService],
  styleUrls: ['./virementExterne-motif.css'],
  animations: [tharwaAnimations]
})
export class VirementExterneMotifComponent implements OnInit {

  virement: Virement;
  succe: string;
  picture: any;
  justificatif;
  file: string;
  url: string;
  counter: number;
  session: any;
  public type: string;
  path: any;
  image: any;
  saved: any;
  private UploadSession: Session;
  usedId: number = 0;
  fancyAlertHelper: FancyalertHelper;
  cfalertDialogHelper: CFAlertDialogHelper;
  feedbackHelper: FeedbackHelper;
  localNotificationsHelper: LocalNotificationsHelper;
  pictureTaken: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute,
    private virementService: VirementService, private location: Location) {
    this.fancyAlertHelper = new FancyalertHelper();
    this.cfalertDialogHelper = new CFAlertDialogHelper();
    this.feedbackHelper = new FeedbackHelper();
    this.localNotificationsHelper = new LocalNotificationsHelper();
    this.UploadSession = session('file-upload');

  }

  public goBack() {
    this.location.back();
  }
  ngOnInit() {
    this.virement = new Virement();
    this.route.queryParams.subscribe((params) => {
      this.virement.destinataire = params["'destinataire'"];
      this.virement.montant = params["'montant'"];
      this.justificatif = params["'justificatif'"];
    });
  }
  cameraOpen() {
    camera.requestPermissions();
    camera.takePicture({
      saveToGallery: true,
      cameraFacing: 'front'
    })
      .then(imageAsset => {
        let image: any;
        this.picture = imageAsset;

        if (isAndroid) {
          image = <any>{
            fileUri: imageAsset.android
          };
          this.image = image;
          this.picture = imageAsset;
          this.pictureTaken = true;

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
              this.picture = imageAsset;
              this.pictureTaken = true;
              console.log(saved);
            });
        }
      })
      .catch(function (err) {
        console.log("Error -> " + err.message);
      });
  }

  private envoyer(justif) {
    if (isAndroid) {
      this.uploadMultipartImagePicker(this.image, justif)
        .subscribe({
          next: (e) => {
            console.log(`Upload: ${(e.currentBytes / e.totalBytes) * 100}`);
          },
          error: (e) => {
            console.log(JSON.stringify(e));
            this.gererMessages(e["status"]);
          },
          complete: () => {
            console.log("complete");
            this.fancyAlertHelper.showSuccess("Virement vers un compte Tharwa", "Virement Effectué avec Succés");
            this.router.navigate(["acceuil"]);

          }
        });
    }
    else {
      if (this.saved) {
        this.uploadMultipartImagePicker({ fileUri: this.path }, justif)
          .subscribe({
            next: (e) => {
              console.log(`Upload: ${(e.currentBytes / e.totalBytes) * 100}`);
            },
            error: (e) => {
              console.log(JSON.stringify(e));
              this.gererMessages(e);
            },
            complete: () => {
              console.log("complete");
              this.fancyAlertHelper.showSuccess("Virement Tharwa", "Virement Effectué avec Succés");
            }
          });
      }
    }
  }



  private uploadMultipartImagePicker(image: any, justif: boolean): Subject<any> {
    let fileUri;
    let filename;
    let mimetype;
    let uploadType;
    let request;
    if (justif) {
      let fileUri = image.fileUri;
      let filename = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      let mimetype = filename.substring(filename.lastIndexOf('.') + 1);
    }
    else {
      let fileUri = "";
      let filename = "";
      let mimetype = "";
    }
    uploadType = "image";
    request = {
      url: Config.apiAddress + "/virement/VirementClientTh",
      method: "POST",
      headers: {
        "Content-Type": "application/form-data",
        "token": Config.access_token
      }
    };

    let params = [
      { name: "Montant", value: this.virement.montant },
      { name: "CompteDestinataire", value: this.virement.destinataire },
      { name: "Motif", value: this.virement.motif },
      { name: "avatar", filename: fileUri, mimeType: "jpg" }];
    console.log(JSON.stringify(params));
    let subject = new Subject<any>();
    let task = this.UploadSession.multipartUpload(params, request);
    task.on('progress', (e: any) => subject.next(e));

    task.on('error', (e) => subject.error(e));

    task.on('complete', (e) => subject.complete());

    return subject;
  }

  submit() {
    if (this.virement.motif) {

      if (this.justificatif === 1) {
        if (this.pictureTaken) {
          let options = {
            title: "Confirmation de Virement",
            message: "Confirmer le virement?",
            okButtonText: "Oui",
            cancelButtonText: "Non"
          };
          dialogs.confirm(options).then((result) => {
            if (result) {

              this.envoyer(true);
            }
          });
        } else {
          this.feedbackHelper.showError("Justificatif Monquant!", "Veuillez joindre un justificatif car votre virement dépasse 200000 DA");
        }

      }
      else {

        let options = {
          title: "Confirmation de Virement",
          message: "Confirmer le virement?",
          okButtonText: "Oui",
          cancelButtonText: "Non"
        };
        dialogs.confirm(options).then((result) => {
          if (result) {

            this.envoyer(false);
          }
        });
      }
    }
    else { this.feedbackHelper.showError("Motif Monquant!", "Veuillez Remplir le motif"); }
  }

  gererMessages(code) {
    switch (code) {
      case 200: this.fancyAlertHelper.showSuccess("Virement vers un compte Tharwa", "Virement Effectué avec Succés");
        break;
      case 401: this.fancyAlertHelper.showError("Opération non autorisée !", "Utilisateur non autorisé à faire un virement !");
        break;
      case 404: this.fancyAlertHelper.showError("Erreur !", "Service introuvable !");
        break;
      case 403: this.fancyAlertHelper.showError("Opération impossible", "Balance insuffisante!");
        break;
      case 500: this.fancyAlertHelper.showError("Erreur Serveur ", "Le serveur est en panne !");
        break;

    }
  }
  getMargin() {
    if (this.justificatif === 1) {
      return "32px";
    }
    else {
      return "200px";
    }
  }


}
