import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaymentsService } from './payment.service';
import { Payment } from './payment.types';


@Injectable({
    providedIn: 'root'
})
export class PaymentsResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _paymentsService: PaymentsService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    {
        return this._paymentsService.paymentPagination(0,10);
    }
}

@Injectable({
    providedIn: 'root'
})
export class PaymentsPaymentResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _paymentsService: PaymentsService,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Payment>
    {
        return this._paymentsService.getPaymentById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested payment is not available
                       catchError((error) => {

                           // Log the error
                           console.error(error);

                           // Get the parent url
                           const parentUrl = state.url.split('/').slice(0, -1).join('/');

                           // Navigate to there
                           this._router.navigateByUrl(parentUrl);

                           // Throw an error
                           return throwError(error);
                       })
                   );
    }
}

