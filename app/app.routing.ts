import { PreloadAllModules, Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HomeComponent } from "~/home/home.component";
import { VirementMotifComponent } from "~/virement-motif/virement-motif.component";
import { Component } from "@angular/core";
import { VirementExterneComponent } from "~/virementExterne/virementExterne.component";
import { LoginComponent } from "~/login/login.component";
import { RegisterComponent } from "~/register/register.component";
import { Page2Component } from "~/rpage2/page2.component";
import { VirementInterneMotifComponent } from "~/virementInterne-motif/virementInterne-motif.component";
import { VirementExterneMotifComponent } from "~/virementExterne-motif/virementExterne-motif.component";
import { CodeComponent } from "~/code/code.component";
import {NotificationModule} from "./notifications/notification.module";
import { EditProfilComponent } from "~/editProfil/editProfil.component";
const APP_ROUTES: Routes = [
  {path: "", redirectTo: "login", pathMatch: "full"},
  {
    path: "login",
    loadChildren: "./login/login.module#LoginModule"
  },
  {
    path: "register",
    loadChildren: "./register/register.module#RegisterModule"
  },
  {
    path: "page2",
    loadChildren: "./rpage2/page2.module#Page2Module"
  },
  {
    path: "feedback",
    loadChildren: "./feedback/feedback.module#FeedbackModule"
  },
  {
    path: "acceuil",
    loadChildren: "./acceuil/acceuil.module#AcceuilModule"
  },
  {
    path: "input",
    loadChildren: "./input/input.module#InputModule"
  },
  {
    path: "firebase",
    loadChildren: "./firebase/firebase.module#FirebaseModule"
  },
  {
    path: "virement",
    loadChildren: "~/virement/virement.module#VirementModule"
  },
  {
    path: "virementMotif",
    component: VirementMotifComponent
  },
  {
    path: "virementExterne",
    loadChildren: "~/virementExterne/virementExterne.module#VirementExterneModule"
  },
  {
    path: "virementExterneMotif",
    component: VirementExterneMotifComponent
  },
  {
    path: "virementInterne",
    loadChildren: "~/virementInterne/virementInterne.module#VirementInterneModule"
  },
  {
    path: "virementInterneMotif",
    component: VirementInterneMotifComponent
  },
  {
    path: "editProfil",
    component: EditProfilComponent
  },
  {
    path: "historique",
    loadChildren: "~/historique/historique.module#HistoriqueModule"
  },
  {
    path: "notification",
    loadChildren: "./notifications/notification.module#NotificationModule"
  },
  {
    path: "code",
    loadChildren: "~/code/code.module#CodedModule"
  },
  {
    path: "profile",
    loadChildren: "~/profile/profile.module#ProfileModule"
  },

];

// TODO swap
export const routing = NativeScriptRouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules });
