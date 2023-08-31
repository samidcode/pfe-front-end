import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Eleve} from '../eleves.types';
import { ElevesListComponent } from '../list/list.component';
import { ElevesService } from '../eleves.service';
import { EleveService } from 'app/services/eleve.service';
import * as alertFunctions from 'app/config/sweet-alerts';


@Component({
    selector       : 'eleves-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ElevesDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tagsEditMode: boolean = false;
    eleve: Eleve;
    eleveForm: FormGroup;
    eleves: Eleve[];
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
        private _elevesListComponent: ElevesListComponent,
        private _elevesService: ElevesService,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
        private _renderer2: Renderer2,
        private _router: Router,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private eleveService: EleveService,
        
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
        this._elevesListComponent.matDrawer.open();
            this.paymentMode = this._elevesService.paymentMode$.getValue();
        // Create the eleve form
        this.eleveForm = this._formBuilder.group({
            id          : [''],
            image      : [null],
            nom        : ['', [Validators.required]],
            prenom       : ['', [Validators.required]],
            idMassar     : ['', [Validators.required]],
            dateNaissance:[null, [Validators.required]],
            payeur : [null, [Validators.required]],
            classe : [null, [Validators.required]]

        });

    

        // Get the eleve
        this._elevesService.eleve$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((eleve: Eleve) => {

                // Open the drawer in case it is closed
                this._elevesListComponent.matDrawer.open();

                // Get the eleve
                this.eleve = eleve;
                // Patch values to the form
                this.eleveForm.patchValue(eleve);


             

                // Toggle the edit mode on creat eleve
            
                
                
                this.toggleEditMode(  this.eleve?.id === "NewEleve");

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
       this._elevesService.paymentMode$.next(false);

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
        return this._elevesListComponent.matDrawer.close();
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
     * Update the eleve
     */
    addOrupdate(): void
    {
        // Get the eleve object
        const eleve = this.eleveForm.getRawValue();
        eleve.image = this.eleve.image;
        // Update the eleve on the server
        this._elevesService.updateEleve(eleve.id, eleve,this.selectedFile).subscribe((newEleve:Eleve) => {

         

            this._router.navigate(['../', newEleve.id], {relativeTo: this._activatedRoute});

            // Toggle the edit mode off
            this.toggleEditMode(false);

            this._changeDetectorRef.markForCheck();

        });

    }

    /**
     * Delete the eleve
     */
    deleteEleve(): void
    {
        const id = this.eleve.id;
        // Open the confirmation dialog
        alertFunctions.confirmText().then((result) => {
            if (result['isConfirmed']) {


                // Get the current eleve's id
                 const id = this.eleve.id;
                 // Get the next/previous eleve's id

              
                this._elevesService.deleteEleve(id)
                .subscribe((isDeleted) => {


                    const currentEleveIndex = this.eleves.findIndex(item => item.id == id);
                    const nextEleveIndex = currentEleveIndex + ((currentEleveIndex === (this.eleves.length - 1)) ? -1 : 1);
                    const nextEleveId = (this.eleves.length === 1 && this.eleves[0].id === id) ? null : this.eleves[nextEleveIndex].id;

                    // Return if the eleve wasn't deleted...
                
                    // Navigate to the next eleve if available
                    
                    if ( nextEleveId )
                    {

                        this._router.navigate(['../', nextEleveId], {relativeTo: this._activatedRoute});
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




    /**
     * Upload avatar
     *
     * @param fileList
     */
    uploadAvatar(event): void {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            this.selectedFile = event.target.files[0];
            this.eleve.imageType =  this.selectedFile.type;

            reader.onload = (event: any) => { // Move the onload assignment before readAsDataURL
                this.eleve.image = event.target.result;

               
                
                this._changeDetectorRef.markForCheck();
            };
            reader.readAsDataURL(event.target.files[0]); // read file as data URL
            
    
           
        }
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void
    {
        this.eleve.image = null ;
        this.url = null ;
      
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
}
