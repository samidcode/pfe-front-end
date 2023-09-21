import { Eleve } from "app/model/eleve";
import { Payeur } from "app/model/payeur";

export interface Payment
{
    id: string;
  
    dateDeCreation: string;
     montant: number;
     moisP:string;

     yearP:string;
  objet:string;

   
    payeur :Payeur;

  eleve: Eleve;
}
export interface PaginatedData<T>
{
    content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}