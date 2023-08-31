import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PayeursService } from './payeurs.service';
import { Payeur, Country, Tag } from './payeurs.types';


@Injectable({
    providedIn: 'root'
})
export class PayeursResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _payeursService: PayeursService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Payeur[]>
    {
        return this._payeursService.getPayeurs();
    }
}

@Injectable({
    providedIn: 'root'
})
export class PayeursPayeurResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _payeursService: PayeursService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Payeur>
    {
        return this._payeursService.getPayeurById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested payeur is not available
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

