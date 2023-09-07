import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawer, MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import * as alertFunctions from 'app/config/sweet-alerts';
import { ElevesService } from '../../eleves/eleves.service';
import { Eleve } from '../../eleves/eleves.types';
import { PaymentsService } from '../payment.service';
import { Payment } from '../payment.types';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentObject } from '../payment-object.enum';


@Component({
    selector       : 'payment-details',
    templateUrl    : './details.component.html',
    styleUrls      : ['./details.component.scss'],

    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentDetailsComponent implements OnInit, OnDestroy
{
    editMode: boolean = false;
    tagsEditMode: boolean = false;
    eleveForm: FormGroup;
    payments: Payment[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    payeurOptions: Object;
    classOptions: Object;
    selectedFile: File;
    url = null;
    paidMonths:{ year: number; months: { month: number; date: string }[] }[] = [];
    months: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
    paymentMode:boolean =false;
    selectedPaymentObject: PaymentObject;


    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elevesService: ElevesService,

        private _paymentsService :PaymentsService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        @Inject(MAT_DIALOG_DATA) public eleve: Eleve,

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
     
       this.getpayment(this.eleve.id);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
       // this._unsubscribeAll.next();
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
     
    }
    
getpayment(id){
    
    this._paymentsService.getPaymentByEleve(id).subscribe(
        (payments:Payment[])=>{

             this.payments = payments;   
            this.paidMonths =this._paymentsService.transformData(payments)
           this._changeDetectorRef.markForCheck();

        }, error => {
            console.error('Error:', error);
        }
    )

}

   

    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    public payeurChange(value: string) {
                
        this._elevesService.payeurAutoComplet(value).subscribe(data=>{
            
            this.payeurOptions = data;
        });
}

public classChange(value: string) {

this._elevesService.classAutoComplet(value).subscribe(data=>{
    
    this.classOptions = data;
});
}

displayP(option) {
    return option ? `${option.nom} ${option.prenom}` : '';
  }

  displayC(option) {
    return option ? `${option.nom}` : '';
  }




  
 
 
  currentYear: number = new Date().getFullYear();

  changeYear(change: number): void {
    this.currentYear += change;
  }

  isMonthPaid(year: number, monthNumber: number): boolean {
 

    return this._paymentsService.isMonthPaid(year,monthNumber,this.paidMonths);
}

getDate (year: number, monthNumber: number) : string | null {
    const paidYear = this.paidMonths.find(paid => paid.year === year);

    if (paidYear) {
        const monthEntry = paidYear.months.find(p => p.month === monthNumber);
        if (monthEntry) {
            return monthEntry.date;
        }
    }

    return null;
}






}
  

  
  

