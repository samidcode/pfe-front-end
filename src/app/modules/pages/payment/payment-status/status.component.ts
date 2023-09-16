import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';

import { ElevesService } from '../../eleves/eleves.service';
import { Eleve } from '../../eleves/eleves.types';
import { PaymentsService } from '../payment.service';
import { Payment } from '../payment.types';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PaymentObject } from '../payment-object.enum';
import { ModernComponent } from '../../invoice/modern.component';


@Component({
    selector       : 'payment-status',
    templateUrl    : './status.component.html',
    styleUrls      : ['./status.component.scss'],

    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentStatusComponent implements OnInit, OnDestroy
{
    editMode: boolean = false;
    tagsEditMode: boolean = false;
    payments: Payment[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    payeurOptions: Object;
    classOptions: Object;
    selectedMonth: String;
    url = null;
    paidMonths:{ year: number; months: { month: number; date: string }[] }[] = [];
    months: string[] = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
    paymentMode:boolean =false;
    selectedPaymentObject= PaymentObject;
    mPayment: Payment;
    tPayment: Payment;

    tPaymentForm: FormGroup;
    mPaymentForm: FormGroup;



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


payMonth(month){

this.selectedMonth = month;
    this.paymentMode=!this.paymentMode;

this._paymentsService.findPayment(month,this.currentYear,this.eleve.id,this.selectedPaymentObject.MONTHLY).subscribe(payment=>{

 this.mPayment = payment
    
})

this._paymentsService.findPayment(month,this.currentYear,this.eleve.id,this.selectedPaymentObject.TRANSPORTATION).subscribe(payment=>{

    this.tPayment = payment
       
   })
   

this.mPaymentForm = this._formBuilder.group({
      montant        : ['', [Validators.required]],
    moisP       : [{value: this.selectedMonth, disabled: true}, [Validators.required]],
    objet     : [{value:this.selectedPaymentObject.MONTHLY,disabled:true}],
    payeur : [{value:this.eleve.payeur.cin ,disabled:true}, [Validators.required]],
    yearP : [this.currentYear , [Validators.required]],
    eleve : [this.eleve]


});

this.tPaymentForm = this._formBuilder.group({
    montant        : ['', [Validators.required]],
  moisP       : [{value: this.selectedMonth, disabled: true}, [Validators.required]],
  objet     : [{value:this.selectedPaymentObject.TRANSPORTATION,disabled:true}],
  payeur : [{value:this.eleve.payeur.cin ,disabled:true}, [Validators.required]],
  yearP : [this.currentYear , [Validators.required]],
  eleve : [this.eleve]


});

}

savedpayment=null;
creatPayment(type){


if (type=="Transport") {


    this.tPaymentForm.get('payeur').setValue(this.eleve.payeur); 


     this.savedpayment = this.tPaymentForm.getRawValue()
    
} 
 else if(type=="Mensuel") {

    this.mPaymentForm.get('payeur').setValue(this.eleve.payeur); 

     this.savedpayment = this.mPaymentForm.getRawValue() 
}

  
 
 
this._paymentsService.createPayment(this.savedpayment).subscribe((payment:Payment)=>{
    
    this.dialog.closeAll();
    this.dialog.open(ModernComponent, {
        width:'1000px',   // Set width to 600px
  height:'100%',  // Set height to 530px
        data:payment,
        backdropClass: 'backdropBackground',
      });
    
   });


}


}
  

  
  

