import { IPK as IFK } from '../fabricante/models';

export interface IPK{ 
    Id: string,     
}

export interface IData extends IPK{
    Nome:string
}

export interface IFilter extends IFK{
    Nome:string
}