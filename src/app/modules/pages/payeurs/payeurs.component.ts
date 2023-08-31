import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'payeurs',
    templateUrl    : './payeurs.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayeursComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
