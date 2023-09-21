import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProjectService
{
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);


    private baseUrl = 'http://localhost:8080/api/'; 
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
     * Getter for data
     */
    get data$(): Observable<any>
    {
        return this._data.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any>
    {
        const url = `${this.baseUrl}charts`; 

        return this._httpClient.get(url).pipe(
            tap((response: any) => {

                this._data.next(response);
            })
        );
    }


    getStatistics(){


        const url = `${this.baseUrl}charts/getstatistics`; 

        return this._httpClient.get(url);

    }
}
