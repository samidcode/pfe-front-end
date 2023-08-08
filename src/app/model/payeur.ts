import { Payments } from "./payments";

export class Payeur {
    id: number;
    cin: string;
    nom: string;
    prenom: string;
    tele: number;
    mail: string;
    adresse: string;
    payments: Payments[];
  
   
  }
  