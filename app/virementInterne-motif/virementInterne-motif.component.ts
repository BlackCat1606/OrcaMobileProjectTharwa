import { Component, OnInit } from '@angular/core';
import { Virement } from '../shared/virement/virement';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { VirementService } from "../shared/virement/virement.service";
import { Config } from '../shared/config';
import * as dialogs from "ui/dialogs";
import { FancyalertHelper } from '~/helpers/fancyalert-helper';
import { CFAlertDialogHelper } from '~/helpers/cfalertdialog-helper';
import { FeedbackHelper } from '~/helpers/feedback-helper';

@Component({
  moduleId: module.id,
  selector: 'app-virementInterne-motif',
  templateUrl: './virementInterne-motif.component.html',
  providers: [VirementService],
  styleUrls: ['./virementInterne-motif.css']
})
export class VirementInterneMotifComponent implements OnInit {

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
  feedbackHelper: FeedbackHelper;
  fancyAlertHelper: FancyalertHelper;
  cfalertDialogHelper: CFAlertDialogHelper;

  saved: any;
  constructor(private router: Router, private route: ActivatedRoute, private virementService: VirementService) {
    this.fancyAlertHelper = new FancyalertHelper();
    this.cfalertDialogHelper = new CFAlertDialogHelper();
    this.feedbackHelper = new FeedbackHelper();
  }

  ngOnInit() {
    this.virement = new Virement();
    this.route.queryParams.subscribe((params) => {
      this.virement.emetteur = params["'accountType'"];
      this.virement.destinataire = params["'destinType'"];
      this.virement.montant = params["'montant'"];
      this.justificatif = params["'justificatif'"];
    });
    this.picture = "https://placeholdit/200*200";
  }
  submit() {
    let options = {
      title: "Confirmation de Virement",
      message: "Confirmer le virement?",
      okButtonText: "Oui",
      cancelButtonText: "Non",
      neutralButtonText: "Annuler"
    };
    dialogs.confirm(options).then((result) => {
      if (result) {
        let navigationExtras: NavigationExtras;
        navigationExtras = {
          queryParams: {
            "'accountType'": this.virement.emetteur,
            "'destinType'": this.virement.destinataire,
            "'montant'": this.virement.montant,
            "'motif'": this.virement.motif
          }
        };
        if (this.virement.motif) {
          this.virementService.sendVirement(Config.access_token, this.virement)
            .subscribe((response) => {
              response = response.json();
              this.succe = response["'succe'"];
              alert("Virement effectué avec succés!");
              this.router.navigate(["home"], navigationExtras);
            },
              (error) => {
                this.gererMessages(error["status"]);
              });
        } else {
          this.feedbackHelper.showError("Motif manquant", "Veuillez Saisir le motif");
        }
      }
      else {
        if (result === false) {
          this.router.navigate(["home"]);
        }
      }
    });
  }

  gererMessages(code) {
    switch (code) {
      case 200: this.fancyAlertHelper.showSuccess("Opération Réussite !", "Virement effectué avec succés!");
        break;
      case 401: this.fancyAlertHelper.showError("Opération Interdite !", "Utilisateur non autorisé à faire un virement !");
        break;
      case 404:  this.fancyAlertHelper.showError("Service introuvable !", "Le service est introuvable");
        break;
      case 403: this.fancyAlertHelper.showError("Balance insuffisante !", "Votre Balance est insuffisante!");
        break;
      case 500: this.fancyAlertHelper.showError("Erreur serveur !", "Veuillez Réessayer SVP");
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
