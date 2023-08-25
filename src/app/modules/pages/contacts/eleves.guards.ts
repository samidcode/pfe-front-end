import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ElevesDetailsComponent } from './details/details.component';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateElevesDetails implements CanDeactivate<ElevesDetailsComponent>
{
    canDeactivate(
        component: ElevesDetailsComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
        // Get the next route
        let nextRoute: ActivatedRouteSnapshot = nextState.root;
        while ( nextRoute.firstChild )
        {
            nextRoute = nextRoute.firstChild;
        }

        // If the next state doesn't contain '/eleves'
        // it means we are navigating away from the
        // eleves app
        if ( !nextState.url.includes('/eleves') )
        {
            // Let it navigate
            return true;
        }

        // If we are navigating to another eleve...
        if ( nextRoute.paramMap.get('id') )
        {
            // Just navigate
            return true;
        }
        // Otherwise...
        else
        {
            // Close the drawer first, and then navigate
            return component.closeDrawer().then(() => true);
        }
    }
}
