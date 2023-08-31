import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Eleve, PaginatedData } from '../eleves.types';
import { ElevesService } from '../eleves.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';


@Component({
    selector       : 'eleves-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElevesListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource<Eleve>();

    eleves$: Observable<Eleve[]>;

    elevesCount: number = 0;
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedEleve: Eleve;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    recentTransactionsTableColumns: string[] = [
        'image',
        'amount',
        'date',
        'name',
        'status',
        'action',
    ];
    eleves: Eleve[];
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _elevesService: ElevesService,
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

        // Get the eleves
        this.eleves$ = this._elevesService.eleves$;
        this._elevesService.eleves$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((eleves: Eleve[]) => {

                // Update the counts
                this.elevesCount = eleves.length;
                    this.eleves = eleves;
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


            // Connect the paginator to the data source
            this.dataSource.paginator = this.paginator;
            this.loadData(0,5);
        // Get the eleve
        this._elevesService.eleve$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((eleve: Eleve) => {
                // Update the selected eleve
                this.selectedEleve = eleve;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

     


        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected eleve when drawer closed
                this.selectedEleve = null;

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
                this.createEleve();
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
     * Create eleve
     */
    createEleve(): void
    {
        // Create the eleve
                   

            // Go to the new eleve
            this._router.navigate(['./', "NewEleve"], {relativeTo: this._activatedRoute});

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

    pEleve;
      
      
      
      onPageChange(event: PageEvent) {
    this.loadData(event.pageIndex, event.pageSize);
  }

  loadData(pageIndex: number, pageSize: number) {
    this._elevesService.elevePagination(pageIndex, pageSize).subscribe((elevesPagination:PaginatedData<Eleve>)=>{

            this.pEleve = elevesPagination.totalElements ; 
            


    });
  }

    paymentMode(){

            this._elevesService.paymentMode$.next(true);

    }

}
