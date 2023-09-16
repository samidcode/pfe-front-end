import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClassesService } from './classes.service';
import { Classe } from './classes.types';


@Injectable({
    providedIn: 'root'
})
export class ClassesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _classesService: ClassesService)
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
        return this._classesService.classePagination(0,10);
    }
}

@Injectable({
    providedIn: 'root'
})
export class ClassesClasseResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(
        private _classesService: ClassesService,
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
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Classe>
    {
        return this._classesService.getClasseById(route.paramMap.get('id'))
                   .pipe(
                       // Error here means the requested classe is not available
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

