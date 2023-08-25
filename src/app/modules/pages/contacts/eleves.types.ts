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