import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Classe, PaginatedData } from '../classes.types';
import { ClassesService } from '../classes.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PaymentsService } from '../../payment/payment.service';


@Component({
    selector       : 'classes-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassesListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource = new MatTableDataSource<Classe>();

    classes$: Observable<Classe[]>;

    classesCount: number = 0;
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedClasse: Classe;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    recentTransactionsTableColumns: string[] = [
        'id',
        'nom',
        'niveau',
        'dateDeCreation',
        'action',
    ];
    classes: Classe[];
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _classesService: ClassesService,
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
        // Get the classes
        this.classes$ = this._classesService.classes$;
        this._classesService.classes$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((classes: Classe[]) => {

                // Update the counts
                this.classesCount = classes.length;
                    this.classes = classes;
                        console.log(this.classes);
                        
                    
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


            // Connect the paginator to the data source
            this.dataSource.paginator = this.paginator;
            this.loadData(0,10);
        // Get the classe
        this._classesService.classe$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((classe: Classe) => {
                // Update the selected classe
                this.selectedClasse = classe;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

     
            this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap(query =>

                    // Search
                    this._classesService.searchClasses(query)
                )
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            if ( !opened )
            {
                // Remove the selected classe when drawer closed
                this.selectedClasse = null;

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
                this.createClasse();
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
     * Create classe
     */
    createClasse(): void
    {
        // Create the classe
                   

            // Go to the new classe
            this._router.navigate(['./', "NewClasse"], {relativeTo: this._activatedRoute});

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

    pClasse;
      
      
      
      onPageChange(event: PageEvent) {
    this.loadData(event.pageIndex, event.pageSize);
  }

  loadData(pageIndex: number, pageSize: number) {
    this._classesService.classePagination(pageIndex, pageSize).subscribe((classesPagination:PaginatedData<Classe>)=>{

            this.pClasse = classesPagination.totalElements ; 
            


    });
  }
  exportToExcel(classeId){

this._classesService.exportToExcel(classeId);



  }

}
