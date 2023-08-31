import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EleveComponent } from './eleve.component';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { NgApexchartsModule } from 'ng-apexcharts';
import { EleveActionComponent } from './eleve-actions/eleveAction.component';
import { EleveActionsModule } from './eleve-actions/eleveAction.module';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from 'app/shared/shared.module';

const eleveRoutes: Route[] = [
  {
      path     : '',
      component: EleveComponent
  }
];

@NgModule({
  declarations: [EleveComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(eleveRoutes),
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTableModule,
    NgApexchartsModule,
    EleveActionsModule,
    MatInputModule,
    SharedModule,

    
  ]
})
export class EleveModule { }
