import { Route } from '@angular/router';
import { PayeursComponent } from './payeurs.component';
import { PayeursListComponent } from './list/list.component';
import { PayeursPayeurResolver, PayeursResolver } from './payeurs.resolvers';
import { PayeursDetailsComponent } from './details/details.component';
import { CanDeactivatePayeursDetails } from './payeurs.guards';


export const payeursRoutes: Route[] = [
    {
        path     : '',
        component: PayeursComponent,
       
        children : [
            {
                path     : '',
                component: PayeursListComponent,
                resolve  : {
                    tasks    : PayeursResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : PayeursDetailsComponent,
                        resolve      : {
                            task     : PayeursPayeurResolver
                        },
                        canDeactivate: [CanDeactivatePayeursDetails]
                    }
                ]
            }
        ]
    }
];
