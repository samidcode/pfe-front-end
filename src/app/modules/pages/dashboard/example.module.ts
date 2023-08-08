import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ExampleComponent } from 'app/modules/pages/dashboard/example.component';

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: ExampleComponent
    }
];

@NgModule({
    declarations: [
        ExampleComponent
    ],
    imports     : [
        RouterModule.forChild(exampleRoutes)
    ]
})
export class ExampleModule
{
}
