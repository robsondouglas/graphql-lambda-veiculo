import {fabricantes} from '../modelos.json'; 
import { IPK } from './models';

export class Fabricante
{
    
    async get(pk:IPK){
        return fabricantes.find( m=> m.Id === pk.Id)
    }

    async list(){
        return fabricantes
    }
}