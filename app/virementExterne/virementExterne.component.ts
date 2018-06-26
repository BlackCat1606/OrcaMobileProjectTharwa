import { Component, ViewContainerRef, ViewChild, OnInit } from "@angular/core";
import { AbstractMenuPageComponent } from "../abstract-menu-page-component";
import { FeedbackHelper } from "../helpers/feedback-helper";
import { FancyalertHelper } from "../helpers/fancyalert-helper";
import { ModalDialogService } from "nativescript-angular";
import { PluginInfo } from "../shared/plugin-info";
import { PluginInfoWrapper } from "../shared/plugin-info-wrapper";
import { CFAlertDialogHelper } from "../helpers/cfalertdialog-helper";
import { AppComponent } from "~/app.component";
import { Virement } from "~/shared/virement/virement";
import { Compte } from "~/shared/compte/compte";
import { UserService } from "~/shared/user/user.service";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Config } from "~/shared/config";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular";
import { tharwaAnimations } from "~/utils/animations";
import { AbstractVirementComponent } from "~/utils/abstractVirement.component";
import { VirementData } from "~/virementExterne/virementData";

@Component({
  selector: "virementExterne",
  moduleId: module.id,
  providers: [UserService],
  templateUrl: "./virementExterne.component.html",
  styleUrls: ["virementExterne-common.css"],
  animations: [tharwaAnimations]

})
export class VirementExterneComponent extends AbstractVirementComponent implements OnInit {

  @ViewChild("myDataForm") dataFormComp: RadDataFormComponent;

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected userService: UserService) {

    super(router, route , userService );
    this._virementData = new VirementData();
  }

  ngOnInit() {
    this.virement = new Virement();
    this.getComptesInfo();
    this.comission = "2%";
  }
  Next() {
    let hasErrors = this.dataFormComp.dataForm.hasValidationErrors();
    if (hasErrors) {
      this.feedbackHelper.showError("Erreur de Remplissage du formulaire!", "Veuillez Remplir tous les champs correctement pour continuer");
    }
    else {
      if (this._virementData.montant > 200000) {
        this.justificatif = 1;
      }
      else {
        this.justificatif = 0;
      }
      let navigationExtras: NavigationExtras;
      navigationExtras = {
        queryParams: {
          "'nomDestinataire'":  this._virementData.nom,
          "'prenomDestinataire'": this._virementData.prenom,
          "'banqueDestinataire'": this._virementData.banque,
          "'destinataire'": this._virementData.numCompte,
          "'montant'": this._virementData.montant,
          "'justificatif'": this.justificatif
        }
      };

      this.router.navigate(["/virementExterneMotif"], navigationExtras);
    }
  }
  get virementData(): VirementData {
    return this._virementData;
  }
  _virementData: VirementData;

  liveBalance(): String {
    return (this.balance - this._virementData.montant - 0.02 * this._virementData.montant).toString();
  }
  getComission(): String {
      return (this._virementData.montant * 0.02).toString();
  }

}
