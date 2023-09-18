import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Classe, PaginatedData } from './classes.types';

@Injectable({
    providedIn: 'root'
})
export class ClassesService
{
   
   
  classe : Classe ;
    private baseUrl = 'http://localhost:8080/api/'; 
    // Private
    private _classe: BehaviorSubject<Classe | null> = new BehaviorSubject(null);
    private _classes: BehaviorSubject<Classe[] | null> = new BehaviorSubject(null);
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
     * Getter for classe
     */
    get classe$(): Observable<Classe>
    {
        return this._classe.asObservable();
    }

    /**
     * Getter for classes
     */
    get classes$(): Observable<Classe[]>
    {
       
        return this._classes.asObservable();
    }
    get paymentMode$()
    {
       
        return this._paymentMode;
    }

    

    /**
     * Get classes
     */
    classePagination(pageIndex: number, pageSize: number): Observable<PaginatedData<Classe>> {
        const url = `${this.baseUrl}classes/classePagination?page=${pageIndex}&size=${pageSize}`;
        return this._httpClient.get<PaginatedData<Classe>>(url).pipe(
            tap((classes) => {
                
                 this._classes.next(classes["content"]);
                 return classes;

            })
        ); 
       }

    /**
     * Search classes with given query
     *
     * @param query
     */
    searchClasses(keyword: string): Observable<Classe[]>
    {
        return this._httpClient.get<Classe[]>(this.baseUrl+'classes/classeSearch', {
            params: {keyword}
        }).pipe(
            tap((classes) => {
                this._classes.next(classes);
            })
        );
    }

    /**
     * Get classe by id
     */
    getClasseById(id: string): Observable<Classe>
    {
        return this._classes.pipe(
            take(1),
            map((classes) => {

                if (id=="NewClasse") {
                     this.classe = {
                        id: "NewClasse",
                        nom: null,
                        niveau: null,
                        dateDeCreation:null,
    
                    } ;
                } else {

                     this.classe = classes.find(item => item.id == id) || null;

                }

                // Find the classe
                   
                    
                // Update the classe
                this._classe.next(this.classe);

                // Return the classe
                return this.classe;
            }),
            switchMap((classe) => {

                if ( !classe )
                {
                    return throwError('Could not found classe with id of ' + id + '!');
                }

                return of(classe);
            })
        );
    }

    /**
     * Update classe
     *
     * @param id
     * @param classe
     */
    updateClasse( classe: Classe)
    {
        if (classe.id == "NewClasse") {
            classe.id = null ;
        }
        

      const url = `${this.baseUrl}classes`; 
      return this._httpClient.post(url,classe).pipe(
        tap((newClasse:Classe) => {

            let classes = this._classes.getValue()

            if (classe.id != null) {
                let classes = this._classes.getValue()

                // Find the index of the updated classe
                   const index = classes.findIndex(item => item.id === classe.id);

                   // Update the classe
                   classes[index] = newClasse;
                   this._classes.next(classes);
                   // Update the classes
                
            }else{
                
                this._classes.next([newClasse, ...classes]);


            }
            this._classe.next(newClasse);

              return newClasse;
        })
    );
    }

    /**
     * Delete the classe
     *
     * @param id
     */
    deleteClasse(id: string): Observable<boolean>
    {
        const url = `${this.baseUrl}classes/${id}`; 
    
        return this.classes$.pipe(
            take(1),
            switchMap(classes => this._httpClient.delete(url).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted classe
                    const index = classes.findIndex(item => item.id === id);

                    // Delete the classe
                    classes.splice(index, 1);

                    // Update the classes
                    this._classes.next(classes);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

   

  




    exportToExcel(classeId,classeName) {
         

        const url = `${this.baseUrl}classes/export/${classeId}`; 
        this._httpClient.get(url, { responseType: 'blob' }).subscribe((response) => {
          this.downloadFile(response,classeName);
        });
      }
    
      private downloadFile(data: any,classeName) {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = classeName+'.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }





}
