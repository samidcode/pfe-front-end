import { Route } from '@angular/router';
import { ElevesComponent } from './eleves.component';
import { ElevesListComponent } from './list/list.component';
import { ElevesEleveResolver, ElevesResolver } from './eleves.resolvers';
import { ElevesDetailsComponent } from './details/details.component';
import { CanDeactivateElevesDetails } from './eleves.guards';


export const elevesRoutes: Route[] = [
    {
        path     : '',
        component: ElevesComponent,
       
        children : [
            {
                path     : '',
                component: ElevesListComponent,
                resolve  : {
                    tasks    : ElevesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ElevesDetailsComponent,
                        resolve      : {
                            task     : ElevesEleveResolver
                        },
                        canDeactivate: [CanDeactivateElevesDetails]
                    }
                ]
            }
        ]
    }
];
