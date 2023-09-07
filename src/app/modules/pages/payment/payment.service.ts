import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { Payment } from './payment.types';
import { PaginatedData } from '../payeurs/payeurs.types';

@Injectable({
    providedIn: 'root'
})
export class PaymentsService
{
   
  payment : Payment ;
    private baseUrl = 'http://localhost:8080/api/'; 
    // Private
    private _payment: BehaviorSubject<Payment | null> = new BehaviorSubject(null);
    private _payments: BehaviorSubject<Payment[] | null> = new BehaviorSubject(null);


    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
        this.getPayments()
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for payment
     */
    get payment$(): Observable<Payment>
    {
        return this._payment.asObservable();
    }

    /**
     * Getter for payments
     */
    get payments$(): Observable<Payment[]>
    {
       
        return this._payments.asObservable();
    }

    


    /**
     * Get payments
     */
    getPayments(): Observable<Payment[]>
    {
        return this._httpClient.get<Payment[]>(this.baseUrl+'payments').pipe(
            tap((payments) => {
                this._payments.next(payments);
            })
        );
    }


    paymentPagination(pageIndex: number, pageSize: number): Observable<PaginatedData<Payment>> {
        const url = `${this.baseUrl}payments/paymentPagination?page=${pageIndex}&size=${pageSize}`;
        return this._httpClient.get<PaginatedData<Payment>>(url).pipe(
            tap((payments) => {
                
                 this._payments.next(payments["content"]);
                 return payments;

            })
        ); 
       }

    /**
     * Search payments with given query
     *
     * @param query
     */
    searchPayments(keyword: string): Observable<Payment[]>
    {
        return this._httpClient.get<Payment[]>(this.baseUrl+'payments/paymentSearch', {
            params: {keyword}
        }).pipe(
            tap((payments) => {
                this._payments.next(payments);
            })
        );
    }

    /**
     * Create payment
     */
    createPayment(): Observable<Payment>
    {
        return this.payments$.pipe(
            take(1),
            switchMap(payments => this._httpClient.post<Payment>('api/apps/payments/payment', {}).pipe(
                map((newPayment: Payment) => {
                 
                    payments.push(newPayment);
                    // Update the payments with the new payment
                    this._payments.next(payments);

                    // Return the new payment
                    return newPayment;
                })
            ))
        );
    }

    /**
     * Update payment
     *
     * @param id
     * @param payment
     */
    updatePayment(id: string, payment: Payment,image)
    {
        if (payment.id == "NewPayment") {
            payment.id = null ;
        }
        
        const formData = new FormData() ;
        formData.append('payment', JSON.stringify(payment));
        
      const url = `${this.baseUrl}payments`; 
      return this._httpClient.post(url,formData).pipe(
        tap((newPayment:Payment) => {

            let payments = this._payments.getValue()

            if (payment.id != "NewPayment") {
                let payments = this._payments.getValue()

                // Find the index of the updated payment
                   const index = payments.findIndex(item => item.id === id);

                   // Update the payment
                   payments[index] = newPayment;

                   // Update the payments
                
            }
            this._payments.next([newPayment, ...payments]);
            this._payment.next(newPayment);

              return newPayment;
        })
    );
    }

    /**
     * Delete the payment
     *
     * @param id
     */
    deletePayment(id: string): Observable<boolean>
    {
        const url = `${this.baseUrl}payments/${id}`; 
    
        return this.payments$.pipe(
            take(1),
            switchMap(payments => this._httpClient.delete(url).pipe(
                map((isDeleted: boolean) => {

                    // Find the index of the deleted payment
                    const index = payments.findIndex(item => item.id === id);

                    // Delete the payment
                    payments.splice(index, 1);

                    // Update the payments
                    this._payments.next(payments);

                    // Return the deleted status
                    return isDeleted;
                })
            ))
        );
    }

    

    getPaymentByEleve(id){

        const url = `${this.baseUrl}payments/findPayment/${id}`; 

             return this._httpClient.get(url);   


    }
  



    paymentAutoComplet(cin: string) {

        const url = `${this.baseUrl}payments/autocomplet`; 
        return this._httpClient.post(url,cin);
      }
      classAutoComplet(name: string) {
    
        const url = `${this.baseUrl}classes/autocomplet`; 
        return this._httpClient.post(url,name);
      }



      transformData(inputData: any[]): { year: number; months: { month: number; date: string }[] }[] {
        const transformedData: { [year: string]: { [month: string]: string } } = {};
      
        inputData.forEach(payment => {
          const year = parseInt(payment.yearP);
          const month = new Date(`${payment.moisP} 1, ${year}`).getMonth() + 1;
      
          if (!transformedData[year]) {
            transformedData[year] = {};
          }
      
          transformedData[year][month] = payment.date;
        });
      
        return Object.keys(transformedData).map(year => ({
          year: parseInt(year),
          months: Object.keys(transformedData[year]).map(month => ({
            month: parseInt(month),
            date: transformedData[year][month],
          })),
        }));
      }



      isMonthPaid(year: number, monthNumber: number, paidMonths): boolean {
        const paidYear = paidMonths.find(paid => paid.year === year);
    
        if (paidYear) {
            const isMonthIncluded = paidYear.months.some(p => p.month === monthNumber);
            return isMonthIncluded;
        }
    
        return false;
    }


 
    /**
     * Get payment by id
     */
    getPaymentById(id: string): Observable<Payment>
    {
        return this._payments.pipe(
            take(1),
            map((payments) => {

                if (id=="NewEleve") {
                     this.payment = {
                        id: null,
  
                        date: null,
                         montant: null,
                         moisP:null,
                    
                         yearP:null,
                      objet:null,
                    
                       
                        payeur :null,
                    
                      eleve: null,
    
                    } ;
                } else {

                     this.payment = payments.find(item => item.id == id) || null;

                }

                // Find the payment
                   
                    
                // Update the payment
                this._payment.next(this.payment);

                // Return the payment
                return this.payment;
            }),
            switchMap((payment) => {

                if ( !payment )
                {
                    return throwError('Could not found payment with id of ' + id + '!');
                }

                return of(payment);
            })
        );
    }


}
