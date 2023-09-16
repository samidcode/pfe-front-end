import { Payeur } from "app/model/payeur";

export interface Classe
{
    id: string;
    nom: string;
    dateDeCreation: string;
    niveau:string;
}

export interface PaginatedData<T>
{
    content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}


