import { ViewContainerRef } from "@angular/core";
import { Config } from "../shared/config";
import { FancyalertHelper } from "~/helpers/fancyalert-helper";
import { CFAlertDialogHelper } from "~/helpers/cfalertdialog-helper";
import { FeedbackHelper } from "~/helpers/feedback-helper";
import { Virement } from "~/shared/virement/virement";
import { Compte } from "~/shared/compte/compte";
import { UserService } from "~/shared/user/user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { VirementData } from "~/virementExterne/virementData";
export abstract class AbstractVirementComponent {
    fancyAlertHelper: FancyalertHelper;
    cfalertDialogHelper: CFAlertDialogHelper;
    feedbackHelper: FeedbackHelper;
    virement: Virement;
    typeVirement: String;
    virementInterne: boolean;
    comission;
    compte: Compte;
    justificatif;
    unit;
    numCompteExterne;
    balance;
    comptes: Array<any>; balanceAfter: number;
    monNumCompte;

    constructor(
        protected router: Router,
        protected route: ActivatedRoute,
        protected userService: UserService) {
        this.fancyAlertHelper = new FancyalertHelper();
        this.cfalertDialogHelper = new CFAlertDialogHelper();
        this.feedbackHelper = new FeedbackHelper();
        this.comptes = [];
    }
    getComptesInfo = () => {
        this.userService.getInfo(Config.access_token)
            .subscribe(
                (res) => {
                    res = res.json();
                    let i = 0;
                    while (res["comptes"][i] != null) {
                        this.compte = new Compte();
                        this.compte.numCompte = res["comptes"][i]["Num"];
                        this.compte.etat = res["comptes"][i]["Etat"];
                        this.compte.balance = res["comptes"][i]["Balance"];
                        this.compte.type = res["comptes"][i]["TypeCompte"];
                        console.log(this.compte.numCompte);
                        console.log(this.compte.balance);
                        console.log(this.compte.etat);
                        this.comptes.push(this.compte);
                        if (i === 0) {

                            this.balance = new String();
                            this.balance = res["comptes"][i]["Balance"];
                            this.monNumCompte = res["comptes"][i]["Num"];
                            console.log("Votre balance" + this.balance);
                        }
                        console.log(res["comptes"][i]["TypeCompte"]);
                        i++;
                    }


                },
                (error) => {

                    this.feedbackHelper.showError("Erreur", "Chargement de donnée échoué");
                    console.log("virement erreur getInfo: " + error);
                });

    }
    liveBalance(i): String {
        ////////// Appelez un service de simulation BackEnd pour aboutir aux balances si le virement est effictué
        return (this.balance - this._virementData.montant - 0.1 * this._virementData.montant).toString();
      }
      getComission(): String {
          return (this._virementData.montant * 0.1).toString();
      }
      get virementData(): VirementData {
        return this._virementData;
      }
      _virementData: VirementData;

}
