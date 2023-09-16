import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ClassesDetailsComponent } from './details/details.component';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateClassesDetails implements CanDeactivate<ClassesDetailsComponent>
{
    canDeactivate(
        component: ClassesDetailsComponent,
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

        // If the next state doesn't contain '/classes'
        // it means we are navigating away from the
        // classes app
        if ( !nextState.url.includes('/classes') )
        {
            // Let it navigate
            return true;
        }

        // If we are navigating to another classe...
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
