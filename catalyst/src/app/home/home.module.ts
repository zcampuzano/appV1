import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from "@angular/common/http";
import { AthleteFabComponent } from "../athlete-fab/athlete-fab.component";

import { HomePage } from './home.page';
import { NgCircleProgressModule } from "ng-circle-progress";
import { DragAndDropModule } from "angular-draggable-droppable";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
    DragAndDropModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, AthleteFabComponent]
})
export class HomePageModule {}
