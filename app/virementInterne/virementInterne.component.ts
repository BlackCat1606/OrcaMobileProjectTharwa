import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { Virement } from '../shared/virement/virement';
import { ListPicker } from "ui/list-picker";
import { UserService } from '../shared/user/user.service';
import { Config } from '../shared/config';
import { Compte } from '../shared/compte/compte';

@Component({
  moduleId: module.id,
  selector: 'virementInterne',
  providers: [UserService],
  templateUrl: './virementInterne.component.html',
  styleUrls: ['./virementInterne.css']
})
export class VirementInterneComponent implements OnInit {

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService) {
    this.comptes = [];
  }

  ngOnInit() {
    this.virement = new Virement();

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
  getComptesInfo() {
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
    if ((this.virement.destinataire) && (this.virement.montant)) {
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
          alert("Opération non autorisée! Montant dépasse la balance");
        }
      }
      else {
        alert("Montant doit étre supérieur à 0 !");
      }
    } else {
      alert("Veuillez remplir tous les champs");
    }
  }
  setUnit() {
    switch (this.virement.emetteur) {

      case "0": this.unit = "DZD";
        break;
      case "1": this.unit = "DZD";
        break;
      case "2": this.unit = "EUR";
        break;
      case "3": this.unit = "USD";
        break;

    }
  }
  getAccountStyle(i): String {
    if (i === 0) {
      if (this.myAccount.etat === "0") {
        return "#cec6c6";
      }
      else {


        if (this.myAccount.type === 0) {
          return "#900c3f";

        }
        else if (this.myAccount.type === 1) {
          return "#c70039";
        }
        else if (this.myAccount.type === 2) {
          return "#e29e9e";
        }
        else if (this.myAccount.type === 3) {
          return "#D19B76";
        }
      }
    }
    else {
      if (this.myAccountDest.etat === "0") {
        return "#cec6c6";
      }
      else {


        if (this.myAccountDest.type === 0) {
          return "#900c3f";

        }
        else if (this.myAccountDest.type === 1) {
          return "#c70039";
        }
        else if (this.myAccountDest.type === 2) {
          return "#e29e9e";
        }
        else if (this.myAccountDest.type === 3) {
          return "#D19B76";
        }
      }
    }
  }
  liveBalance(i): String {
    if (i === 0) {
      ////////////////////////// Appelez un service de simulation BackEnd pour aboutir aux balances si le virement est effictué
      return (this.virement.montant + (-this.myAccount.balance)).toString();
    } else {
      return (this.virement.montant + (this.myAccountDest.balance)).toString();
    }
  }

}
