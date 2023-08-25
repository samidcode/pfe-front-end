import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplatePortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Contact, Country, Tag } from '../contacts.types';
import { ContactsListComponent } from '../list/list.component';
import { ContactsService } from '../contacts.service';
import { EleveService } from 'app/services/eleve.service';
import * as alertFunctions from 'app/config/sweet-alerts';


@Component({
    selector       : 'contacts-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsDetailsComponent implements OnInit, OnDestroy
{
    @ViewChild('tagsPanel') private _tagsPanel: TemplateRef<any>;
    @ViewChild('tagsPanelOrigin') private _tagsPanelOrigin: ElementRef;

    editMode: boolean = false;
    tags: Tag[];
    tagsEditMode: boolean = false;
    filteredTags: Tag[];
    contact: Contact;
    contactForm: FormGroup;
    contacts: Contact[];
    countries: Country[];
    private _tagsPanelOverlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    payeurOptions: Object;
    classOptions: Object;
    selectedFile: File;
    url = null;
  

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
        private _contactsListComponent: ContactsListComponent,
        private _contactsService: ContactsService,
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
        this._contactsListComponent.matDrawer.open();

        // Create the contact form
        this.contactForm = this._formBuilder.group({
            id          : [''],
            image      : [null],
            nom        : ['', [Validators.required]],
            prenom       : ['', [Validators.required]],
            idMassar     : ['', [Validators.required]],
            dateNaissance:[null, [Validators.required]],
            payeur : [null, [Validators.required]],
            classe : [null, [Validators.required]]

        });

    

        // Get the contact
        this._contactsService.contact$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((contact: Contact) => {

                // Open the drawer in case it is closed
                this._contactsListComponent.matDrawer.open();

                // Get the contact
                this.contact = contact;
                    console.log("d5al",this.contact);
                // Patch values to the form
                this.contactForm.patchValue(contact);


             

                // Toggle the edit mode on creat eleve
                this.toggleEditMode(this.contact.id=="NewEleve"?true:false);

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
        return this._contactsListComponent.matDrawer.close();
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
     * Update the contact
     */
    addOrupdate(): void
    {
        // Get the contact object
        const contact = this.contactForm.getRawValue();
        contact.image = this.contact.image;
        // Update the contact on the server
        this._contactsService.updateContact(contact.id, contact,this.selectedFile).subscribe((newContact:Contact) => {

            console.log("neweleve",newContact);

            this._router.navigate(['../', newContact.id], {relativeTo: this._activatedRoute});

            // Toggle the edit mode off
            this.toggleEditMode(false);

            this._changeDetectorRef.markForCheck();

        });

    }

    /**
     * Delete the contact
     */
    deleteEleve(): void
    {
        const id = this.contact.id;
        // Open the confirmation dialog
        alertFunctions.confirmText().then((result) => {
            if (result['isConfirmed']) {


                // Get the current contact's id
                 const id = this.contact.id;
                 // Get the next/previous contact's id

              
                this._contactsService.deleteContact(id)
                .subscribe((isDeleted) => {


                    const currentContactIndex = this.contacts.findIndex(item => item.id == id);
                    const nextContactIndex = currentContactIndex + ((currentContactIndex === (this.contacts.length - 1)) ? -1 : 1);
                    const nextContactId = (this.contacts.length === 1 && this.contacts[0].id === id) ? null : this.contacts[nextContactIndex].id;

                    // Return if the contact wasn't deleted...
                
                    // Navigate to the next contact if available
                    
                    if ( nextContactId )
                    {

                        this._router.navigate(['../', nextContactId], {relativeTo: this._activatedRoute});
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
            this.contact.imageType =  this.selectedFile.type;

            reader.onload = (event: any) => { // Move the onload assignment before readAsDataURL
                this.contact.image = event.target.result;

               
                
                this._changeDetectorRef.markForCheck()
            };
            reader.readAsDataURL(event.target.files[0]); // read file as data URL
            
    
           
        }
    }

    /**
     * Remove the avatar
     */
    removeAvatar(): void
    {
        this.contact.image = null ;
        this.url = null ;
      
    }

  


    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    public payeurChange(value: string) {
                
        this._contactsService.payeurAutoComplet(value).subscribe(data=>{
            
            this.payeurOptions = data;
        });
}

public classChange(value: string) {

this._contactsService.classAutoComplet(value).subscribe(data=>{
    console.log("dataclass",data);
    
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
