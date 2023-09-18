import { Payeur } from "app/model/payeur";

export interface Eleve
{
    id: string;
    idMassar: number;
    nom: string;
    prenom: string;
    dateNaissance: string;
    payeur:Payeur;
    classe:any;
    image:string;
    imageType:string;
    statue:boolean;
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


