import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'payments',
    templateUrl    : './payment.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
