import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EleveService {


  private baseUrl = 'http://localhost:8080/api'; 
  drawerData: any;

  constructor(private http: HttpClient) { }

  getData() {
    const url = `${this.baseUrl}/eleves`; 
    return this.http.get(url);
  }

  private eleveSubject = new Subject<any>();
  eleve$ = this.eleveSubject.asObservable();

  sendDataToChild(data: any) {
    this.eleveSubject.next(data);
  }
  
  addData(data) {

    const formData = new FormData() ;
      formData.append('eleve', JSON.stringify( data.eleve)  );
      formData.append('image',data.image);
    const url = `${this.baseUrl}/eleves`; 
    return this.http.post(url,formData);
  }

  deletEleve(id: string) {

    const url = `${this.baseUrl}/eleves/${id}`; 
    return this.http.delete(url);
  }

  payeurAutoComplet(cin: string) {

    const url = `${this.baseUrl}/payeurs/autocomplet`; 
    return this.http.post(url,cin);
  }
  classAutoComplet(name: string) {

    const url = `${this.baseUrl}/classes/autocomplet`; 
    return this.http.post(url,name);
  }
}
