import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    eleve: Eleve;
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
       this.getpayment()
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
    
getpayment(){
    
    this._paymentsService.getPaymentByEleve(51).subscribe(
        (payments:Payment[])=>{

             this.payments = payments;   
            this.paidMonths =this.transformData(payments)
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
    const paidYear = this.paidMonths.find(paid => paid.year === year);

    if (paidYear) {
        const isMonthIncluded = paidYear.months.some(p => p.month === monthNumber);
        return isMonthIncluded;
    }

    return false;
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


   transformData(inputData: any[]): { year: number; months: { month: number; date: string }[] }[] {
    const transformedData: { [year: string]: { [month: string]: string } } = {};
  
    inputData.forEach(payment => {
      const year = parseInt(payment.yearP);
      const month = new Date(`${payment.moisP} 1, ${year}`).getMonth() + 1;
  
      if (!transformedData[year]) {
        transformedData[year] = {};
      }
  
      transformedData[year][month] = payment.date;
    });
  
    return Object.keys(transformedData).map(year => ({
      year: parseInt(year),
      months: Object.keys(transformedData[year]).map(month => ({
        month: parseInt(month),
        date: transformedData[year][month],
      })),
    }));
  }
  
}
  

  
  

