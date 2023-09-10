import { Route } from '@angular/router';
import { PaymentsComponent } from './payment.component';
import { PaymentsListComponent } from './list/list.component';
import { PaymentsPaymentResolver, PaymentsResolver } from './payment.resolvers';
import { PaymentsDetailsComponent } from './details/details.component';
import { CanDeactivatePaymentsDetails } from './payment.guards';


export const paymentsRoutes: Route[] = [
    {
        path     : '',
        component: PaymentsComponent,
       
        children : [
            {
                path     : '',
                component: PaymentsListComponent,
                resolve  : {
                    tasks    : PaymentsResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : PaymentsDetailsComponent,
                        resolve      : {
                            task     : PaymentsPaymentResolver
                        },
                        canDeactivate: [CanDeactivatePaymentsDetails]
                    }
                ]
            }
        ]
    }
];
