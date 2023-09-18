import { Payment } from "../payment/payment.types";

export interface Payeur
{
    id: string;
    nom: string;
    prenom: string;
    cin:string;
    tele:string;
    mail:string;
    adresse:string;
    payments :Payment;
    dateDeCreation:string;
    
}

export interface PaginatedData<T>
{
    content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}


export interface Country
{
    id: string;
    iso: string;
    name: string;
    code: string;
    flagImagePos: string;
}

export interface Tag
{
    id?: string;
    title?: string;
}
