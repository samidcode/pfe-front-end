import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { PaymentDetailsComponent } from './details/details.component';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivatePaymentsDetails implements CanDeactivate<PaymentDetailsComponent>
{
    canDeactivate(
        component: PaymentDetailsComponent,
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

        // If the next state doesn't contain '/payments'
        // it means we are navigating away from the
        // payments app
        if ( !nextState.url.includes('/payments') )
        {
            // Let it navigate
            return true;
        }

        // If we are navigating to another payment...
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
