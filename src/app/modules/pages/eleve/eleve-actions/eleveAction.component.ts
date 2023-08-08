import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config';
import { AppConfig, Scheme, Theme, Themes } from 'app/core/config/app.config';
import { Layout } from 'app/layout/layout.types';
import { EleveService } from 'app/services/eleve.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector     : 'EleveAction',
    templateUrl  : './EleveAction.component.html',
    styleUrls: ['./eleveAction.component.scss'],

    styles       : [
        `
            Action {
                position: static;
                display: block;
                flex: none;
                width: auto;
            }

            @media (screen and min-width: 1280px) {

                empty-layout + settings .settings-cog {
                    right: 0 !important;
                }
            }
        `
    ],
    encapsulation: ViewEncapsulation.None
})
export class EleveActionComponent implements OnInit, OnDestroy
{
    formFieldHelpers: string[] = [''];


    payeurOptions;
    classOptions
    config: AppConfig;
    layout: Layout;
    scheme: 'dark' | 'light';
    theme: string;
    themes: Themes;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    filteredOptions: Observable<string[]>;
    myControl = new FormControl('');
    selectedFile: File | null = null;
    myForm: FormGroup;



  
        nom;
        prenom;
        dateNaissance;
        idMassare;
        pCin;
        eClass;
        

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _fuseConfigService: FuseConfigService,
        private _eleveService : EleveService,
        private fb: FormBuilder
    )
    {


    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------


    
  url = '';
  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url
      this.selectedFile = event.target.files[0];  
      console.log("image", this.selectedFile);
      
      reader.onload = (event:any) => { // called once readAsDataURL is completed
        this.url = event.target.result;
      }
    }
  }
  public delete(){
    this.url = null;
  }
    /**
     * On init
     */
    ngOnInit(): void
    {
       
     

    }
    public payeurChange(value: string) {
                
                this._eleveService.payeurAutoComplet(value).subscribe(data=>{
                    
                    this.payeurOptions = data;
                });
      }

      public classChange(value: string) {
        
        this._eleveService.classAutoComplet(value).subscribe(data=>{
            console.log("dataclass",data);
            
            this.classOptions = data;
        });
}
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onSubmit(): void
    {
    
  let eleve = {
        nom : this.nom,
        prenom:this.prenom,
        idMassar : this.idMassare,
        dateNaissance : this.dateNaissance,
        classe : this.eClass,
        payeur : this.pCin
  }

  this._eleveService.addData({eleve:eleve,image:this.selectedFile}).subscribe(data =>{

    console.log("dataclass",data);


  })


    }

    displayP(option) {
        return option ? `${option.nom} ${option.prenom}` : '';
      }

      displayC(option) {
        return option ? `${option.nom}` : '';
      }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set the layout on the config
     *
     * @param layout
     */
    setLayout(layout: string): void
    {
        // Clear the 'layout' query param to allow layout changes
        this._router.navigate([], {
            queryParams        : {
                layout: null
            },
            queryParamsHandling: 'merge'
        }).then(() => {

            // Set the config
            this._fuseConfigService.config = {layout};
        });
    }

    /**
     * Set the scheme on the config
     *
     * @param scheme
     */
    setScheme(scheme: Scheme): void
    {
        this._fuseConfigService.config = {scheme};
    }

    /**
     * Set the theme on the config
     *
     * @param theme
     */
    setTheme(theme: Theme): void
    {
        this._fuseConfigService.config = {theme};
    }
}
