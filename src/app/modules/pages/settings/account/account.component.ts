import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'app/core/auth/auth.service';
import {  Users } from '../users.types';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations   : fuseAnimations

})
export class SettingsAccountComponent implements OnInit
{
    accountForm: UntypedFormGroup;
    userEmail: any;
    user: Users;
    alert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private jwtHelper: JwtHelperService,
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

        this.accountForm = this._formBuilder.group({
            id:[""],
            name : [""],
            email   : [""],
            phone   : [""],
        
        });

            const token = this._authService.accessToken.slice(7);
            
              const decodedToken = this.jwtHelper.decodeToken(token);
              this.userEmail = decodedToken.sub;
              
              this._authService.getUser(this.userEmail).subscribe((user:Users)=>{

                        this.user = user;

                      // Create the form
        this.accountForm = this._formBuilder.group({
            id:[this.user?.id],
            name : [this.user?.name],
            email   : [this.user?.email],
            phone   : [this.user?.phone],
        
        });
                    
              })
             
      
    }


    updateUser(){

        let user = this.accountForm.getRawValue();

                this._authService.updateUser(user).subscribe(user=>{

                    console.log(this.user);

                   this.alert=true;   
                   this._changeDetectorRef.markForCheck();
  

                })



    }
}
