import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Payeur, Country, Tag, PaginatedData } from './payeurs.types';

@Injectable({
    providedIn: 'root'
})
export class PayeursService
{
   
  payeur : Payeur ;
    private baseUrl = 'http://localhost:8080/api/'; 
    // Private
    private _payeur: BehaviorSubject<Payeur | null> = new BehaviorSubject(null);
    private _payeurs: BehaviorSubject<Payeur[] | null> = new BehaviorSubject(null);
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        this.getPayeurs()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for payeur
     */
    get payeur$(): Observable<Payeur>
    {
        return this._payeur.asObservable();
    }

    /**
     * Getter for payeurs
     */
    get payeurs$(): Observable<Payeur[]>
    {
       
        return this._payeurs.asObservable();
    }

    

    /**
     * Getter for tags
     */
    get tags$(): Observable<Tag[]>
    {
        return this._tags.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get payeurs
     */
    getPayeurs(): Observable<Payeur[]>
    {
        return this._httpClient.get<Payeur[]>(this.baseUrl+'payeurs').pipe(
            tap((payeurs) => {
                this._payeurs.next(payeurs);
            })
        );
    }


    payeurPagination(pageIndex: number, pageSize: number): Observable<PaginatedData<Payeur>> {
        const url = `${this.baseUrl}payeurs/payeurPagination?page=${pageIndex}&size=${pageSize}`;
        return this._httpClient.get<PaginatedData<Payeur>>(url).pipe(
            tap((payeurs) => {
                
                 this._payeurs.next(payeurs["content"]);
                 return payeurs;

            })
        ); 
       }

    /**
     * Search payeurs with given query
     *
     * @param query
     */
    searchPayeurs(keyword: string): Observable<Payeur[]>
    {
        return this._httpClient.get<Payeur[]>(this.baseUrl+'payeurs/payeurSearch', {
            params: {keyword}
        }).pipe(
            tap((payeurs) => {
                this._payeurs.next(payeurs);
            })
        );
    }

    /**
     * Get payeur by id
     */
    getPayeurById(id: string): Observable<Payeur>
    {
        return this._payeurs.pipe(
            take(1),
            map((payeurs) => {

                if (id=="NewPayeur") {
                     this.payeur = {
                        id: "NewPayeur",
                        nom: null,
                        prenom: null,
                        cin: null,
                        tele:null,
                        mail:null,
                        adresse:null,
                        payments:null,
    
                    } ;
                } else {

                     this.payeur = payeurs.find(item => item.id == id) || null;

                }

                // Find the payeur
                   
                    
                // Update the payeur
                this._payeur.next(this.payeur);

                // Return the payeur
                return this.payeur;
            }),
            switchMap((payeur) => {

                if ( !payeur )
                {
                    return throwError('Could not found payeur with id of ' + id + '!');
                }

                return of(payeur);
            })
        );
    }

    /**
     * Create payeur
     */
    createPayeur(): Observable<Payeur>
    {
        return this.payeurs$.pipe(
            take(1),
            switchMap(payeurs => this._httpClient.post<Payeur>('api/apps/payeurs/payeur', {}).pipe(
                map((newPayeur: Payeur) => {
                 
                    payeurs.push(newPayeur);
                    // Update the payeurs with the new payeur
                    this._payeurs.next(payeurs);

                    // Return the new payeur
                    return newPayeur;
                })
            ))
        );
    }

    /**
     * Update payeur
     *
     * @param id
     * @param payeur
     */
    updatePayeur(id: string, payeur: Payeur,image)
    {
        if (payeur.id == "NewPayeur") {
            payeur.id = null ;
        }
        
        const formData = new FormData() ;
        formData.append('payeur', JSON.stringify(payeur));
        
      const url = `${this.baseUrl}payeurs`; 
      return this._httpClient.post(url,formData).pipe(
        tap((newPayeur:Payeur) => {

            let payeurs = this._payeurs.getValue()

            if (payeur.id != "NewPayeur") {
                let payeurs = this._payeurs.getValue()

                // Find the index of the updated payeur
                   const index = payeurs.findIndex(item => item.id === id);

                   // Update the payeur
                   payeurs[index] = newPayeur;

                   // Update the payeurs
                
            }
            this._payeurs.next([newPayeur, ...payeurs]);
            this._payeur.next(newPayeur);

              return newPayeur;
        })
    );
    }

    /**
     * Delete the payeur
     *
     * @param id
     */
    deletePayeur(id: string): Observable<boolean>
    {
        const url = `${this.baseUrl}payeurs/${id}`; 
    
        return this.payeurs$.pipe(
            take(1),
            switchMap(payeurs => this._httpClient.delete(url).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted payeur
                    const index = payeurs.findIndex(item => item.id === id);

                    // Delete the payeur
                    payeurs.splice(index, 1);

                    // Update the payeurs
                    this._payeurs.next(payeurs);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    

    getElevesbyPayeur(){

        const url = `${this.baseUrl}payeurs/findelevesbypayeur/${this.payeur.id}`; 

             return this._httpClient.get(url);   


    }
  



    payeurAutoComplet(cin: string) {

        const url = `${this.baseUrl}payeurs/autocomplet`; 
        return this._httpClient.post(url,cin);
      }
      classAutoComplet(name: string) {
    
        const url = `${this.baseUrl}classes/autocomplet`; 
        return this._httpClient.post(url,name);
      }
}
