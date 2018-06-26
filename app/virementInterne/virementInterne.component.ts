import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Virement } from '../shared/virement/virement';
import { ListPicker } from "ui/list-picker";
import { UserService } from '../shared/user/user.service';
import { Config } from '../shared/config';
import { Compte } from '../shared/compte/compte';
import { AbstractVirementComponent } from '~/utils/abstractVirement.component';
import { unit1, unit2, unit3 } from '~/utils/units';
import { color1, colorGrise, color2, color3, color4 } from '~/utils/accountsColors';
import { tharwaAnimations } from '~/utils/animations';

@Component({
  moduleId: module.id,
  selector: 'virementInterne',
  providers: [UserService],
  templateUrl: './virementInterne.component.html',
  styleUrls: ['./virementInterne.css'],
  animations: [tharwaAnimations]
})
export class VirementInterneComponent extends AbstractVirementComponent implements OnInit {

  virement: Virement;
  typeVirement: String;
  virementInterne: boolean;
  accountList = ["Compte Courant", "Compte Epargene", "Compte Devise Euro", "Compte Devise Dollar"];
  accounts: Array<string>;
  picker;
  compte: Compte;
  myAccount: Compte;
  justificatif;
  myAccountDest: Compte;
  unit;
  numCompteExterne;
  balance: String;
  comptes: Array<any>;
  balanceAfter: number;
  comissionChiffre: number;
  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected userService: UserService) {
    super(router, route, userService);
  }

  ngOnInit() {
    this.virement = new Virement();
    this.comission = "";
    this.route.queryParams.subscribe((params) => {
      this.virementInterne = params["'virementInterne'"];
      this.virement.emetteur = params["'accountType'"];
      this.typeVirement = params["'typeVirement'"];
    });


    this.accounts = [];
    let i = 0;

    if (this.virement.emetteur === "0") {
      for (i = 0; i < this.accountList.length; i++) {
        if (i.toString() !== this.virement.emetteur) {
          console.log(i.toString());
          this.accounts.push(this.accountList[i]);
        }
      }

    } else {
      this.accounts.push(this.accountList[0]);
    }
    this.setUnit();
    this.getComptesInfo();
    this.balance = new String();
    this.balance = this.comptes[this.virement.emetteur].balance;



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
            console.log(res["comptes"][i]["TypeCompte"]);
            if (this.virement.emetteur === this.compte.type.toString()) {
              this.myAccount = new Compte();
              this.myAccount.numCompte = this.compte.numCompte;
              this.myAccount.etat = this.compte.etat;
              this.myAccount.balance = this.compte.balance;
              this.myAccount.type = this.compte.type;
            }
            if (this.virement.destinataire === this.compte.type.toString()) {
              this.myAccountDest = new Compte();
              this.myAccountDest.numCompte = this.compte.numCompte;
              this.myAccountDest.etat = this.compte.etat;
              this.myAccountDest.balance = this.compte.balance;
              this.myAccountDest.type = this.compte.type;
            }

            i++;
          }
          console.log(res["comptes"][0]["Num"]);



        },
        (error) => {
          alert('home erreur getInfo: ' + error);
          console.log("home erreur getInfo: " + error);
        });

  }

  selectedIndexChanged(args) {
    let i = 0;
    const picker = <ListPicker>args.object;
    console.log("picker selection: " + picker.selectedIndex);

    if (this.virement.emetteur === "0") {
      i = picker.selectedIndex + 1;
      this.virement.destinataire = i.toString();
    } else {
      this.virement.destinataire = "0";
    }
  }

  Next() {
    if ((this.virement.montant)) {
      if (this.virement.montant > 0) {
        if (this.virement.montant < this.comptes[this.virement.emetteur].balance) {
          if (this.virement.montant > 200000) {
            this.justificatif = 1;
          }
          else {
            this.justificatif = 0;
          }
          let navigationExtras: NavigationExtras;
          navigationExtras = {
            queryParams: {
              "'accountType'": this.virement.emetteur,
              "'destinType'": this.virement.destinataire,
              "'montant'": this.virement.montant,
              "'justificatif'": this.justificatif
            }
          };

          this.router.navigate(["/virementInterneMotif"], navigationExtras);

        }
        else {
          this.feedbackHelper.showError("Opération non autorisée!", "Le Montant dépasse la balance");
        }
      }
      else {
        this.feedbackHelper.showError("Montant incorrect", "Montant doit étre supérieur à 0 !");
      }
    } else {
      this.feedbackHelper.showError("Champs manquants", "Veuillez remplir tous les champs");
    }
  }
  setUnit() {
    switch (this.virement.emetteur) {

      case "0": this.unit = unit1;
        break;
      case "1": this.unit = unit1;
        break;
      case "2": this.unit = unit2;
        break;
      case "3": this.unit = unit3;
        break;

    }
  }
  getAccountStyle(i): String {
    if (i === 0) {
      if (this.myAccount.etat === "0") {
        return colorGrise;
      }
      else {


        if (this.myAccount.type === 0) {
          return color1;

        }
        else if (this.myAccount.type === 1) {
          return color2;
        }
        else if (this.myAccount.type === 2) {
          return color3;
        }
        else if (this.myAccount.type === 3) {
          return color4;
        }
      }
    }
    else {
      if (this.myAccountDest.etat === "0") {
        return colorGrise;
      }
      else {


        if (this.myAccountDest.type === 0) {
          return color1;

        }
        else if (this.myAccountDest.type === 1) {
          return color2;
        }
        else if (this.myAccountDest.type === 2) {
          return color3;
        }
        else if (this.myAccountDest.type === 3) {
          return color4;
        }
      }
    }
  }
  liveBalance(i): String {
    if (i === 0) {
      let bal: number = Number.parseFloat(this.myAccount.balance);
      ////////////////////////// Appelez un service de simulation BackEnd pour aboutir aux balances si le virement est effictué
      return (this.virement.montant + (-this.myAccount.balance) - (  bal * this.comissionChiffre)).toString();
    } else {
      return (this.virement.montant + (this.myAccountDest.balance)).toString();
    }
  }
  getComission(): String {
     if (this.myAccount.type === 0 && this.myAccountDest.type === 1) {
       this.comission = "0 %" ;
        this.comissionChiffre = 0;
     }
     else if (this.myAccount.type === 1 && this.myAccountDest.type === 0 ) {
        this.comission = "0.10 %";
        this.comissionChiffre = 0.0001;
     }
     else if ((this.myAccount.type === 2 || this.myAccount.type === 3) && this.myAccountDest.type === 0 ) {
      this.comission = "1.5 %";
      this.comissionChiffre = 0.015;
     }
     else if ((this.myAccountDest.type === 2 || this.myAccountDest.type === 3) && this.myAccount.type === 0 ) {
      this.comission = "2 %";
      this.comissionChiffre = 0.02;
     }
     return this.comission;
    }

}
