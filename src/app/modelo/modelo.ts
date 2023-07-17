import {modelos} from '../modelos.json'; 
import { IPK } from './models';
import { IPK as IFK } from '../fabricante/models';

export class Modelo
{
    
    async get(pk:IPK){
        return modelos.find( m=> m.Id === pk.Id)
    }

    async list(fk:IFK){
        return modelos.filter( f => f.IdFabricante === fk.Id )
    }
}