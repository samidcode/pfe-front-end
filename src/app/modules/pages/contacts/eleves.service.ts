import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Eleve, Country, Tag, PaginatedData } from './eleves.types';

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
    private _countries: BehaviorSubject<Country[] | null> = new BehaviorSubject(null);
    private _tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        this.getEleves()
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
     * Get eleves
     */
    getEleves(): Observable<Eleve[]>
    {
        return this._httpClient.get<Eleve[]>(this.baseUrl+'eleves').pipe(
            tap((eleves) => {
                this._eleves.next(eleves);
            })
        );
    }


    elevePagination(pageIndex: number, pageSize: number): Observable<PaginatedData<Eleve>> {
        const url = `${this.baseUrl}eleves/elevePagination?page=${pageIndex}&size=${pageSize}`;
        return this._httpClient.get<PaginatedData<Eleve>>(url).pipe(
            tap((eleves) => {
                console.log("pag eleve",eleves);
                
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
     * Create eleve
     */
    createEleve(): Observable<Eleve>
    {
        return this.eleves$.pipe(
            take(1),
            switchMap(eleves => this._httpClient.post<Eleve>('api/apps/eleves/eleve', {}).pipe(
                map((newEleve: Eleve) => {
                 
                    eleves.push(newEleve);
                    // Update the eleves with the new eleve
                    this._eleves.next(eleves);

                    // Return the new eleve
                    return newEleve;
                })
            ))
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
        
        const formData = new FormData() ;
        formData.append('eleve', JSON.stringify(eleve));
        
      const url = `${this.baseUrl}eleves`; 
      return this._httpClient.post(url,formData).pipe(
        tap((newEleve:Eleve) => {

            let eleves = this._eleves.getValue()

            if (eleve.id != "NewEleve") {
                let eleves = this._eleves.getValue()

                // Find the index of the updated eleve
                   const index = eleves.findIndex(item => item.id === id);

                   // Update the eleve
                   eleves[index] = newEleve;

                   // Update the eleves
                
            }
            this._eleves.next([newEleve, ...eleves]);
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

    

    /**
     * Get tags
     */
   

    /**
     * Create tag
     *
     * @param tag
     */
    createTag(tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.post<Tag>('api/apps/eleves/tag', {tag}).pipe(
                map((newTag) => {

                    // Update the tags with the new tag
                    this._tags.next([...tags, newTag]);

                    // Return new tag from observable
                    return newTag;
                })
            ))
        );
    }

    /**
     * Update the tag
     *
     * @param id
     * @param tag
     */
    updateTag(id: string, tag: Tag): Observable<Tag>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.patch<Tag>('api/apps/eleves/tag', {
                id,
                tag
            }).pipe(
                map((updatedTag) => {

                    // Find the index of the updated tag
                    const index = tags.findIndex(item => item.id === id);

                    // Update the tag
                    tags[index] = updatedTag;

                    // Update the tags
                    this._tags.next(tags);

                    // Return the updated tag
                    return updatedTag;
                })
            ))
        );
    }

    /**
     * Delete the tag
     *
     * @param id
     */
    deleteTag(id: string): Observable<boolean>
    {
        return this.tags$.pipe(
            take(1),
            switchMap(tags => this._httpClient.delete('api/apps/eleves/tag', {params: {id}}).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted tag
                    const index = tags.findIndex(item => item.id === id);

                    // Delete the tag
                    tags.splice(index, 1);

                    // Update the tags
                    this._tags.next(tags);

                    // Return the deleted status
                    return isDeleted;
                }),
                filter(isDeleted => isDeleted),
                switchMap(isDeleted => this.eleves$.pipe(
                    take(1),
                    map((eleves) => {

                        // Iterate through the eleves
                        eleves.forEach((eleve) => {

                          //  const tagIndex = eleve.tags.findIndex(tag => tag === id);

                            // If the eleve has the tag, remove it
                           /*  if ( tagIndex > -1 )
                            {
                                eleve.tags.splice(tagIndex, 1);
                            } */
                        });

                        // Return the deleted status
                        return isDeleted;
                    })
                ))
            ))
        );
    }

    /**
     * Update the avatar of the given eleve
     *
     * @param id
     * @param avatar
     */
    uploadAvatar(id: string, avatar: File): Observable<Eleve>
    {
        return this.eleves$.pipe(
            take(1),
            switchMap(eleves => this._httpClient.post<Eleve>('api/apps/eleves/avatar', {
                id,
                avatar
            }, {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    'Content-Type': avatar.type
                }
            }).pipe(
                map((updatedEleve) => {

                    // Find the index of the updated eleve
                    const index = eleves.findIndex(item => item.id === id);

                    // Update the eleve
                    eleves[index] = updatedEleve;

                    // Update the eleves
                    this._eleves.next(eleves);

                    // Return the updated eleve
                    return updatedEleve;
                }),
                switchMap(updatedEleve => this.eleve$.pipe(
                    take(1),
                    filter(item => item && item.id === id),
                    tap(() => {

                        // Update the eleve if it's selected
                        this._eleve.next(updatedEleve);

                        // Return the updated eleve
                        return updatedEleve;
                    })
                ))
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
