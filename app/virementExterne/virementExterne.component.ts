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
  selector: "page-virement",
  moduleId: module.id,
  providers: [UserService],
  templateUrl: "./virement.component.html",
  styleUrls: ["virement-common.css"],
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
   /* let isValid = true;

    let p1 = this.dataFormComp.dataForm.getPropertyByName("numCompte");

    if (p1.valueCandidate === this.monNumCompte) {
      p1.errorMessage = "Vous ne pouvez pas virez vers le méme compte";
      this.dataFormComp.dataForm.notifyValidated("numCompte", false);
      isValid = false;
    } else {
      this.dataFormComp.dataForm.notifyValidated("numCompte", true);
    }*/

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
          "'nomDestinataire'":  this._virementData.name,
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

  liveBalance(): String {
    return (this.balance - this._virementData.montant - 0.02 * this._virementData.montant).toString();
  }
  getComission(): String {
      return (this._virementData.montant * 0.02).toString();
  }

}
