import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { EleveActionComponent } from './eleveAction.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
    declarations: [
        EleveActionComponent
    ],
    imports     : [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatTooltipModule,
        FuseDrawerModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatSelectModule,
        MatNativeDateModule,
        FuseHighlightModule,
        SharedModule,
        MatAutocompleteModule
    ] ,exports     : [
        EleveActionComponent
    ]
    
    
})
export class EleveActionsModule
{
}
