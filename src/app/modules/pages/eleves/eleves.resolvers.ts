import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ElevesService } from './eleves.service';
import { Eleve } from './eleves.types';


@Injectable({
    providedIn: 'root'
})
export class ElevesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _elevesService: ElevesService)
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Eleve[]>
    {
        return this._elevesService.getEleves();
    }
}

@Injectable({
    providedIn: 'root'
})
export class ElevesEleveResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _elevesService: ElevesService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Eleve>
    {
        return this._elevesService.getEleveById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested eleve is not available
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

