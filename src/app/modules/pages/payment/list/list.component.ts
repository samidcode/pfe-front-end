import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { PaymentsService } from '../../payment/payment.service';
import { PaginatedData, Payment } from '../payment.types';


@Component({
    selector       : 'payments-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource<Payment>();

    payments$: Observable<Payment[]>;

    paymentsCount: number = 0;
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedPayment: Payment;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    recentTransactionsTableColumns: string[] = [
        'Eleve',
        'Mois',
        'Année',
        'Montant',
        'Type',
        'CIN',
        "date",
        "action",
    ];
    payments: Payment[];
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _paymentsService: PaymentsService,
        private _paymentService: PaymentsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
   
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
        this.loadData(0,10);
        // Get the payments
        this.payments$ = this._paymentsService.payments$;
        this._paymentsService.payments$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((payments: Payment[]) => {

                // Update the counts
                this.paymentsCount = payments.length;
                    this.payments = payments;
                        console.log("payment",this.payments);
                        
                    
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


            // Connect the paginator to the data source
            this.dataSource.paginator = this.paginator;
            this.loadData(0,10);
        // Get the payment
        this._paymentsService.payment$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((payment: Payment) => {
                // Update the selected payment
                this.selectedPayment = payment;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

     
            this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>

                    // Search
                    this._paymentsService.searchPayments(query)
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected payment when drawer closed
                this.selectedPayment = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>(event =>
                    (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                    && (event.key === '/') // '/'
                )
            )
            .subscribe(() => {
                this.createPayment();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
       // this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        
        // Go back to the list
        this._router.navigate(['./'], {relativeTo: this._activatedRoute});
            
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create payment
     */
    createPayment(): void
    {
        // Create the payment
                   

            // Go to the new payment
            this._router.navigate(['./', "NewPayment"], {relativeTo: this._activatedRoute});

            // Mark for check
        
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    pPayment;
      
      
      
      onPageChange(event: PageEvent) {
    this.loadData(event.pageIndex, event.pageSize);
  }

  loadData(pageIndex: number, pageSize: number) {
    this._paymentsService.paymentPagination(pageIndex, pageSize).subscribe((paymentsPagination:PaginatedData<Payment>)=>{

            this.pPayment = paymentsPagination.totalElements ; 
            


    });
  }


}
