import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Eleve, PaginatedData } from './eleves.types';

@Injectable({
    providedIn: 'root'
})
export class ElevesService
{
   
   
  eleve : Eleve ;
    private baseUrl = 'http://localhost:8080/api/'; 
    // Private
    private _eleve: BehaviorSubject<Eleve | null> = new BehaviorSubject(null);
    private _eleves: BehaviorSubject<Eleve[] | null> = new BehaviorSubject(null);
    private _paymentMode:BehaviorSubject<boolean | null> = new BehaviorSubject(null);
    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for eleve
     */
    get eleve$(): Observable<Eleve>
    {
        return this._eleve.asObservable();
    }

    /**
     * Getter for eleves
     */
    get eleves$(): Observable<Eleve[]>
    {
       
        return this._eleves.asObservable();
    }
    get paymentMode$()
    {
       
        return this._paymentMode;
    }

    

    /**
     * Get eleves
     */
    elevePagination(pageIndex: number, pageSize: number): Observable<PaginatedData<Eleve>> {
        const url = `${this.baseUrl}eleves/elevePagination?page=${pageIndex}&size=${pageSize}`;
        return this._httpClient.get<PaginatedData<Eleve>>(url).pipe(
            tap((eleves) => {
                
                 this._eleves.next(eleves["content"]);
                 return eleves;

            })
        ); 
       }

    /**
     * Search eleves with given query
     *
     * @param query
     */
    searchEleves(keyword: string): Observable<Eleve[]>
    {
        return this._httpClient.get<Eleve[]>(this.baseUrl+'eleves/eleveSearch', {
            params: {keyword}
        }).pipe(
            tap((eleves) => {
                this._eleves.next(eleves);
            })
        );
    }

    /**
     * Get eleve by id
     */
    getEleveById(id: string): Observable<Eleve>
    {
        return this._eleves.pipe(
            take(1),
            map((eleves) => {

                if (id=="NewEleve") {
                     this.eleve = {
                        id: "NewEleve",
                        idMassar: null,
                        nom: null,
                        prenom: null,
                        dateNaissance: null,
                        payeur:null,
                        classe:null,
                        image:null,
                        imageType:null,
                        statue:null,
    
                    } ;
                } else {

                     this.eleve = eleves.find(item => item.id == id) || null;

                }

                // Find the eleve
                   
                    
                // Update the eleve
                this._eleve.next(this.eleve);

                // Return the eleve
                return this.eleve;
            }),
            switchMap((eleve) => {

                if ( !eleve )
                {
                    return throwError('Could not found eleve with id of ' + id + '!');
                }

                return of(eleve);
            })
        );
    }

    /**
     * Update eleve
     *
     * @param id
     * @param eleve
     */
    updateEleve(id: string, eleve: Eleve,image)
    {
        if (eleve.id == "NewEleve") {
            eleve.id = null ;
        }
        
      const url = `${this.baseUrl}eleves`; 
      return this._httpClient.post(url,eleve).pipe(
        tap((newEleve:Eleve) => {

            let eleves = this._eleves.getValue()

            if (eleve.id != null) {
                let eleves = this._eleves.getValue()

                // Find the index of the updated eleve
                   const index = eleves.findIndex(item => item.id === id);

                   // Update the eleve
                   eleves[index] = newEleve;
                   this._eleves.next(eleves);
                   // Update the eleves
                
            }else{
                console.log("newEleve",newEleve);
                
                this._eleves.next([newEleve, ...eleves]);


            }
            this._eleve.next(newEleve);

              return newEleve;
        })
    );
    }

    /**
     * Delete the eleve
     *
     * @param id
     */
    deleteEleve(id: string): Observable<boolean>
    {
        const url = `${this.baseUrl}eleves/${id}`; 
    
        return this.eleves$.pipe(
            take(1),
            switchMap(eleves => this._httpClient.delete(url).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted eleve
                    const index = eleves.findIndex(item => item.id === id);

                    // Delete the eleve
                    eleves.splice(index, 1);

                    // Update the eleves
                    this._eleves.next(eleves);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
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
