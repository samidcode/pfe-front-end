import { Eleve } from "./eleve";
import { Payeur } from "./payeur";

export class Payments {
    id: number;
    date: string;
    montant: number;
    moisP: string;
    objet: string;
    payeur: Payeur;
    eleve: Eleve;

  }
  

  