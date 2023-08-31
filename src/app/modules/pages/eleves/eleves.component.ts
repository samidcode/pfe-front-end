import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'eleves',
    templateUrl    : './eleves.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElevesComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
