import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import * as alertFunctions from 'app/config/sweet-alerts';
import { MatDialog } from '@angular/material/dialog';
import { PaymentStatusComponent } from '../../payment/payment-status/status.component';
import { Payment } from '../payment.types';
import { PaymentsListComponent } from '../list/list.component';
import { PaymentsService } from '../payment.service';
import { ModernComponent } from '../../invoice/modern.component';


@Component({
    selector       : 'payments-details',
    templateUrl    : './details.component.html',
    styles:['.backdropBackground{    backdrop-filter: blur(9px); }'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tagsEditMode: boolean = false;
    payment: Payment;
    paymentForm: FormGroup;
    payments: Payment[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    payeurOptions: Object;
    classOptions: Object;
    selectedFile: File;
    url = null;
    paymentMode ;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _paymentsListComponent: PaymentsListComponent,
        private _paymentsService: PaymentsService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        public dialog: MatDialog,
        
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
        
        // Open the drawer
        this._paymentsListComponent.matDrawer.open();
         //   this.paymentMode = this._paymentsService.payment$.getValue();
        // Create the payment form
        this.paymentForm = this._formBuilder.group({
            id          : [''],
            image      : [null],
            nom        : ['', [Validators.required]],
            prenom       : ['', [Validators.required]],
            idMassar     : ['', [Validators.required]],
            dateNaissance:[null, [Validators.required]],
            payeur : [null, [Validators.required]],
            classe : [null, [Validators.required]]

        });

    

        // Get the payment
        this._paymentsService.payment$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((payment: Payment) => {

                // Open the drawer in case it is closed
                this._paymentsListComponent.matDrawer.open();

                // Get the payment
                this.payment = payment;
                // Patch values to the form
                this.paymentForm.patchValue(payment);


             

                // Toggle the edit mode on creat payment
            
                
                
                this.toggleEditMode(  this.payment?.id === "NewPayment");

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
       // this._unsubscribeAll.next();
    //   this._paymentsService.paymentMode$.next(false);

        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
     
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
    
        return this._paymentsListComponent.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void
    {
        if ( editMode === null  )
        {
            this.editMode = !this.editMode;
        }
        else
        {
            this.editMode = editMode;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Update the payment
     */
    addOrupdate(): void
    {
        // Get the payment object
        const payment = this.paymentForm.getRawValue();
       // payment.image = this.payment.image;
        // Update the payment on the server
        this._paymentsService.updatePayment(payment.id, payment,this.selectedFile).subscribe((newPayment:Payment) => {

         

            this._router.navigate(['../', newPayment.id], {relativeTo: this._activatedRoute});

            // Toggle the edit mode off
            this.toggleEditMode(false);

            this._changeDetectorRef.markForCheck();

        });

    }

    /**
     * Delete the payment
     */
    deletePayment(): void
    {
        const id = this.payment.id;
        // Open the confirmation dialog
        alertFunctions.confirmText().then((result) => {
            if (result['isConfirmed']) {


                // Get the current payment's id
                 const id = this.payment.id;
                 // Get the next/previous payment's id

              
                this._paymentsService.deletePayment(id)
                .subscribe((isDeleted) => {


                    const currentPaymentIndex = this.payments.findIndex(item => item.id == id);
                    const nextPaymentIndex = currentPaymentIndex + ((currentPaymentIndex === (this.payments.length - 1)) ? -1 : 1);
                    const nextPaymentId = (this.payments.length === 1 && this.payments[0].id === id) ? null : this.payments[nextPaymentIndex].id;

                    // Return if the payment wasn't deleted...
                
                    // Navigate to the next payment if available
                    
                    if ( nextPaymentId )
                    {

                        this._router.navigate(['../', nextPaymentId], {relativeTo: this._activatedRoute});
                    }
                    // Otherwise, navigate to the parent
                    else
                    {
                        this._router.navigate(['../'], {relativeTo: this._activatedRoute});
                      
                    }

                    // Toggle the edit mode off
                    this.toggleEditMode(false);
                });

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    });

    }





  


    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    public payeurChange(value: string) {
                
        this._paymentsService.paymentAutoComplet(value).subscribe(data=>{
            
            this.payeurOptions = data;
        });
}

public classChange(value: string) {

this._paymentsService.classAutoComplet(value).subscribe(data=>{
    
    this.classOptions = data;
});
}

displayP(option) {
    return option ? `${option.nom} ${option.prenom}` : '';
  }

  displayC(option) {
    return option ? `${option.nom}` : '';
  }


  makePayment(){

     this.dialog.open(ModernComponent, {
        width:'1000px',   // Set width to 600px
  height:'100%',  // Set height to 530px
        data:this.payment,
        backdropClass: 'backdropBackground',
      });
       // this._paymentsService.paymentMode$.next(true);

}
}
