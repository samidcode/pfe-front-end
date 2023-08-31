import { Eleve } from "app/model/eleve";
import { Payeur } from "app/model/payeur";

export interface Payment
{
    id: string;
  
    date: string;
     montant: number;
     moisP:string;

     yearP:string;
  objet:string;

   
    payeur :Payeur;

  eleve: Eleve;
}