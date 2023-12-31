import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from 'app/shared/shared.module';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import moment from 'moment';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatPaginatorModule} from '@angular/material/paginator';
import { PaymentStatusComponent } from './payment-status/status.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { PaymentsListComponent } from './list/list.component';
import { paymentsRoutes } from './payment.routing';
import { PaymentsDetailsComponent } from './details/details.component';
import { PaymentsComponent } from './payment.component';
import {MatBadgeModule} from '@angular/material/badge';

import {MatTabsModule} from '@angular/material/tabs';



@NgModule({
    declarations: [
        PaymentStatusComponent,
        PaymentsListComponent,
        PaymentsDetailsComponent,
        PaymentsComponent,
    ],
    imports     : [
        RouterModule.forChild(paymentsRoutes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatProgressBarModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatTableModule,
        MatTooltipModule,
        FuseFindByKeyPipeModule,
        SharedModule,
        MatAutocompleteModule,
        MatPaginatorModule,
        MatDialogModule,
        MatTabsModule,
        MatBadgeModule
    ],
    providers   : []
})
export class PaymentModule
{
}
