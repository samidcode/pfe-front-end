import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: UntypedFormGroup;
alert = false;
    userEmail: any;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private _changeDetectorRef: ChangeDetectorRef,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {


        const token = this._authService.accessToken.slice(7);
            
        const decodedToken = this._authService.decodeToken(token);
        this.userEmail = decodedToken.sub;
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentpassword  : [''],
            newpassword      : [''],
            email:[this.userEmail]
        });
    }


    updatePassword(){

let password = this.securityForm.getRawValue();
this._authService.updatePassword(password.currentpassword,password.newpassword,password.email).subscribe(()=>{

            this.alert=true;

}

)


    }
}
