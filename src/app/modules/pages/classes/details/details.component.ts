import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Classe} from '../classes.types';
import { ClassesListComponent } from '../list/list.component';
import { ClassesService } from '../classes.service';
import * as alertFunctions from 'app/config/sweet-alerts';
import { MatDialog } from '@angular/material/dialog';
import { PaymentStatusComponent } from '../../payment/payment-status/status.component';
import { ModernComponent } from '../../invoice/modern.component';
import { Payment } from '../../payment/payment.types';
import { PaymentsService } from '../../payment/payment.service';
import { PaymentObject } from '../../payment/payment-object.enum';


@Component({
    selector       : 'classes-details',
    templateUrl    : './details.component.html',
    styles:['.backdropBackground{    backdrop-filter: blur(9px); }'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassesDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tagsEditMode: boolean = false;
    classe: Classe;
    classeForm: FormGroup;
    classes: Classe[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    payeurOptions: Object;
    classOptions: Object;
    selectedFile: File;
    url = null;
    paymentMode ;
    inscriptionFrais: string = '';
    inscriptionAnnee:string='';
    selectedPaymentObject= PaymentObject;
    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _classesListComponent: ClassesListComponent,
        private _classesService: ClassesService,
        private _paymentService:PaymentsService,
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
        this._classesListComponent.matDrawer.open();
            this.paymentMode = this._classesService.paymentMode$.getValue();
        // Create the classe form
        this.classeForm = this._formBuilder.group({
            id          : [''],
            nom        : ['', [Validators.required]],
            niveau       : ['', [Validators.required]],
            dateDeCreation:[{value: null, disabled: true},, [Validators.required]],
         
        });

    

        // Get the classe
        this._classesService.classe$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((classe: Classe) => {

                // Open the drawer in case it is closed
                this._classesListComponent.matDrawer.open();

                // Get the classe
                this.classe = classe;
                // Patch values to the form
                this.classeForm.patchValue(classe);


             

                // Toggle the edit mode on creat classe
            
                
                
                this.toggleEditMode(  this.classe?.id === "NewClasse");

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
       this._classesService.paymentMode$.next(false);

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
    
        return this._classesListComponent.matDrawer.close();
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
     * Update the classe
     */
    addOrupdate(): void
    {
        // Get the classe object
        const classe = this.classeForm.getRawValue();
      
        
        // Update the classe on the server
        this._classesService.updateClasse( classe).subscribe((newClasse) => {

         

            this._router.navigate(['../', newClasse.id], {relativeTo: this._activatedRoute});

            // Toggle the edit mode off
            this.toggleEditMode(false);

            this._changeDetectorRef.markForCheck();

        });

    }

    /**
     * Delete the classe
     */
    deleteClasse(): void
    {
        const id = this.classe.id;
        // Open the confirmation dialog
        alertFunctions.confirmText().then((result) => {
            if (result['isConfirmed']) {


                // Get the current classe's id
                 const id = this.classe.id;
                 // Get the next/previous classe's id

              
                this._classesService.deleteClasse(id)
                .subscribe((isDeleted) => {


                    const currentClasseIndex = this.classes.findIndex(item => item.id == id);
                    const nextClasseIndex = currentClasseIndex + ((currentClasseIndex === (this.classes.length - 1)) ? -1 : 1);
                    const nextClasseId = (this.classes.length === 1 && this.classes[0].id === id) ? null : this.classes[nextClasseIndex].id;

                    // Return if the classe wasn't deleted...
                
                    // Navigate to the next classe if available
                    
                    if ( nextClasseId )
                    {

                        this._router.navigate(['../', nextClasseId], {relativeTo: this._activatedRoute});
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






  makePayment(){

     this.dialog.open(PaymentStatusComponent, {
      
        data:this.classe,
        backdropClass: 'backdropBackground',
      });
       // this._classesService.paymentMode$.next(true);

}
}
