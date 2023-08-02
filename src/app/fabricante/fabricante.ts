import {fabricantes} from '../modelos.json'; 
import { IData, IFilter, IPK } from './models';

export class Fabricante
{
    
    async get(pk:IPK) : Promise<IData>{
        return new Promise( res => res( fabricantes.find( m=> m.Id === pk.Id) ) ) 
    }

    async list(filter:IFilter): Promise<IData[]>{
        return new Promise( res => res( fabricantes.filter( f=> f.Nome.startsWith(filter?.Nome || '') ) ) )
    }
}