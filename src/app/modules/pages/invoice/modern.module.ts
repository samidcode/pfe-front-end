import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { modernRoutes } from './modern.routing';
import { ModernComponent } from './modern.component';
import { SharedModule } from 'app/shared/shared.module';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { CommonModule } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser';
import { NgxPrintModule } from 'ngx-print';
;


@NgModule({
    declarations: [
        ModernComponent
    ],
    imports     : [
        RouterModule.forChild(modernRoutes),
        SharedModule,
        CommonModule,
        BrowserModule,
        NgxPrintModule
    

    ]
})
export class ModernModule
{
}
