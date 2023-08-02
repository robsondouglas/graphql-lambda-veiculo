import ITopic from "../adapters/topic/models";
import { Fabricante } from "./fabricante/fabricante";
import { Modelo } from "./modelo/modelo";
import { Veiculo } from "./veiculo/veiculo";

import {IPK as IPKFabricante, IData as IDataFabricante, IFilter as IFilterFabricante} from './fabricante/models'
import {IPK as IPKModelo, IData as IDataModelo, IFilter as IFilterModelo} from './modelo/models'
import {IPK as IPKVeiculo, IKey as IKeyVeiculo, IFK as IFKVeiculo, IData as IDataVeiculo, IKey} from './veiculo/models'
import { MESSAGES } from "src/libs/messages";

export default class App {
    constructor(
        private fabricante:Fabricante, 
        private modelo:Modelo,
        private veiculo:Veiculo,
        private topic: ITopic)
        {  }

    getFabricante(pk:IPKFabricante): Promise<IDataFabricante>{
        return this.fabricante.get(pk);
    }
    
    listFabricantes(filter:IFilterFabricante): Promise<IDataFabricante[]>{
        return this.fabricante.list(filter);
    }

    getModelo(pk:IPKModelo): Promise<IDataModelo>{
        return this.modelo.get(pk);
    }
    
    listModelos(filter:IFilterModelo): Promise<IDataModelo[]>{
        return this.modelo.list(filter);
    }

    getVeiculo(pk:IKeyVeiculo):Promise<IDataVeiculo>{
        return this.veiculo.get(pk)
    }

    listVeiculos(fk:IFKVeiculo):Promise<IDataVeiculo[]>{
        return this.veiculo.list(fk)
    }

    findVeiculo(pk:IPKVeiculo):Promise<IDataVeiculo>{
        return this.veiculo.find(pk)
    }

    async addVeiculo(itm:IDataVeiculo){
        
        if(!await this.fabricante.get({ Id: itm.IdFabricante }))
        { throw new Error(MESSAGES.FABRICANTE.NOT_FOUND) }

        if(!await this.modelo.get({ Id: itm.IdModelo }))
        { throw new Error(MESSAGES.MODELO.NOT_FOUND) }

        const res = await this.veiculo.post(itm);
        await this.topic.publish(process.env.topicVeiculo, 'INSERTED', res)
        return true;
    }

    async delVeiculo(key:IKey){
        const res = await this.veiculo.del(key);
        await this.topic.publish(process.env.topicVeiculo, 'DELETED', res)
        return res;
    }

}