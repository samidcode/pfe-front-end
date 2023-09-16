import { Route } from '@angular/router';
import { ClassesComponent } from './classes.component';
import { ClassesListComponent } from './list/list.component';
import { ClassesClasseResolver, ClassesResolver } from './classes.resolvers';
import { ClassesDetailsComponent } from './details/details.component';
import { CanDeactivateClassesDetails } from './classes.guards';


export const classesRoutes: Route[] = [
    {
        path     : '',
        component: ClassesComponent,
       
        children : [
            {
                path     : '',
                component: ClassesListComponent,
                resolve  : {
                    tasks    : ClassesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ClassesDetailsComponent,
                        resolve      : {
                            task     : ClassesClasseResolver
                        },
                        canDeactivate: [CanDeactivateClassesDetails]
                    }
                ]
            }
        ]
    }
];
