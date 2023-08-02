import {modelos} from '../modelos.json'; 
import { IPK, IData, IFilter } from './models';

export class Modelo
{   
    async get(pk:IPK) : Promise<IData>{
        return new Promise( res => res( modelos.find( m=> m.Id === pk.Id) ) ) 
    }

    async list(filter:IFilter): Promise<IData[]>{
        return new Promise( res => res( modelos.filter( f=> f.IdFabricante === filter.Id && f.Nome.startsWith(filter.Nome || '') ) ) )
    }
}