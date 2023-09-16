import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'classes',
    templateUrl    : './classes.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassesComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
