import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Payeur, Country, Tag } from '../payeurs.types';
import { PayeursListComponent } from '../list/list.component';
import { PayeursService } from '../payeurs.service';
import * as alertFunctions from 'app/config/sweet-alerts';
import { Eleve } from 'app/model/eleve';
import { ElevesService } from '../../eleves/eleves.service';


@Component({
    selector       : 'payeurs-details',
    templateUrl    : './details.component.html',
    styleUrls      : ['./details.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayeursDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;
    showPayeurEleves=false;
    editMode: boolean = false;
    
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    payeur: Payeur;
    payeurForm: FormGroup;
    payeurs: Payeur[];
    countries: Country[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    payeurOptions: Object;
    classOptions: Object;
    selectedFile: File;
    url = null;
    PayeurEleves: Object;
  

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _payeursListComponent: PayeursListComponent,
        private _payeursService: PayeursService,
        private _elevesService: ElevesService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private payeurService: PayeursService,
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
        this._payeursListComponent.matDrawer.open();

        // Create the payeur form
        this.payeurForm = this._formBuilder.group({
            id          : [''],
            cin      :  ['', [Validators.required]],
            nom        : ['', [Validators.required]],
            prenom       : ['', [Validators.required]],
            mail     : ['', [Validators.required]],
            tele:[null, [Validators.required]],
            adresse : [null, [Validators.required]],

        });

    

        // Get the payeur
        this._payeursService.payeur$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((payeur: Payeur) => {
                // Open the drawer in case it is closed
                this._payeursListComponent.matDrawer.open();
                // Get the payeur
                this.payeur = payeur;
                // Patch values to the form
                this.payeurForm.patchValue(payeur);

                // Toggle the edit mode on creat payeur
            
                this.toggleEditMode(  this.payeur?.id === "NewPayeur");

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });



                this._payeursService.getElevesbyPayeur().subscribe((eleves:Eleve[]) =>{

                        this.PayeurEleves =eleves;
  

                })



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
        if ( this._tagsPanelOverlayRef )
        {
            this._tagsPanelOverlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult>
    {
        return this._payeursListComponent.matDrawer.close();
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
     * Update the payeur
     */
    addOrupdate(): void
    {
        // Get the payeur object
        const payeur = this.payeurForm.getRawValue();
        // Update the payeur on the server
        this._payeursService.updatePayeur(payeur.id, payeur,this.selectedFile).subscribe((newPayeur:Payeur) => {

         

            this._router.navigate(['../', newPayeur.id], {relativeTo: this._activatedRoute});

            // Toggle the edit mode off
            this.toggleEditMode(false);

            this._changeDetectorRef.markForCheck();

        });

    }

    /**
     * Delete the payeur
     */
    deletePayeur(): void
    {
        const id = this.payeur.id;
        // Open the confirmation dialog
        alertFunctions.confirmText().then((result) => {
            if (result['isConfirmed']) {


                // Get the current payeur's id
                 const id = this.payeur.id;
                 // Get the next/previous payeur's id

              
                this._payeursService.deletePayeur(id)
                .subscribe((isDeleted) => {


                    const currentPayeurIndex = this.payeurs.findIndex(item => item.id == id);
                    const nextPayeurIndex = currentPayeurIndex + ((currentPayeurIndex === (this.payeurs.length - 1)) ? -1 : 1);
                    const nextPayeurId = (this.payeurs.length === 1 && this.payeurs[0].id === id) ? null : this.payeurs[nextPayeurIndex].id;

                    // Return if the payeur wasn't deleted...
                
                    // Navigate to the next payeur if available
                    
                    if ( nextPayeurId )
                    {

                        this._router.navigate(['../', nextPayeurId], {relativeTo: this._activatedRoute});
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
                
        this._payeursService.payeurAutoComplet(value).subscribe(data=>{
            
            this.payeurOptions = data;
        });
}

public classChange(value: string) {

this._payeursService.classAutoComplet(value).subscribe(data=>{
    
    this.classOptions = data;
});
}

displayP(option) {
    return option ? `${option.nom} ${option.prenom}` : '';
  }

  displayC(option) {
    return option ? `${option.nom}` : '';
  }

  showEleves(){

        this.showPayeurEleves = !this.showPayeurEleves;
    
    // Mark for check
    this._changeDetectorRef.markForCheck();

  }
  etatDePayment(id){

    this._elevesService.paymentMode$.next(true);

this._router.navigate(['../eleves/',id]);
                    
}


}
