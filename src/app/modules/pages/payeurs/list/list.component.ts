import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Payeur, Country, PaginatedData } from '../payeurs.types';
import { PayeursService } from '../payeurs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
    selector       : 'payeurs-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayeursListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource<Payeur>();

    payeurs$: Observable<Payeur[]>;

    payeursCount: number = 0;
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedPayeur: Payeur;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    recentTransactionsTableColumns: string[] = [
       'id',
        'nom',
        'prenom',
        'cin',
        'tele',
        'mail',
        'adresse',
        'action',
    ];
    payeurs: Payeur[];
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _payeursService: PayeursService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService
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

    

        // Get the payeurs
        this.payeurs$ = this._payeursService.payeurs$;
        this._payeursService.payeurs$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((payeurs: Payeur[]) => {

                // Update the counts
                this.payeursCount = payeurs.length;
                    this.payeurs = payeurs;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


            // Connect the paginator to the data source
            this.dataSource.paginator = this.paginator;
            this.loadData(0,10);
        // Get the payeur
        this._payeursService.payeur$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((payeur: Payeur) => {

                // Update the selected payeur
                this.selectedPayeur = payeur;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

     

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>

                    // Search
                    this._payeursService.searchPayeurs(query)
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected payeur when drawer closed
                this.selectedPayeur = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
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
                this.createPayeur();
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
     * Create payeur
     */
    createPayeur(): void
    {
        // Create the payeur
                   

            // Go to the new payeur
            this._router.navigate(['./', "NewPayeur"], {relativeTo: this._activatedRoute});

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

    pPayeur;
      
      
      
      onPageChange(event: PageEvent) {
    this.loadData(event.pageIndex, event.pageSize);
  }

  loadData(pageIndex: number, pageSize: number) {
    this._payeursService.payeurPagination(pageIndex, pageSize).subscribe((payeursPagination:PaginatedData<Payeur>)=>{

            this.pPayeur = payeursPagination.totalElements ; 
            


    });
  }
}
