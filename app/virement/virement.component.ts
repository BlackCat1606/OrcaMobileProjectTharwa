import { Component, ViewChild } from "@angular/core";
import { Virement } from "~/shared/virement/virement";
import { UserService } from "~/shared/user/user.service";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular";
import { VirementData } from "../utils/virementData";
import { tharwaAnimations } from "~/utils/animations";
import { AbstractVirementComponent } from "~/utils/abstractVirement.component";

@Component({
  selector: "page-virement",
  moduleId: module.id,
  providers: [UserService],
  templateUrl: "./virement.component.html",
  styleUrls: ["virement-common.css"],
  animations: [tharwaAnimations]

})
export class VirementComponent extends AbstractVirementComponent {

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected userService: UserService) {
    super(router, route, userService);
  }

  ngOnInit() {
    this.virement = new Virement();
    this._virementData = new VirementData();
    this.getComptesInfo();
    this.comission = "1%";
  }
  @ViewChild("myDataForm") dataFormComp: RadDataFormComponent;

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
          "'destinataire'": this._virementData.numCompte,
          "'montant'": this._virementData.montant,
          "'justificatif'": this.justificatif
        }
      };
      this.router.navigate(["/virementMotif"], navigationExtras);
    }
  }

}
