import { AttributeValue, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { IPK, IFK, IKey, IData } from './models';
import { MESSAGES } from '../../libs/messages';
import { Base } from '../base';

export class Veiculo extends Base<IKey, IData> {
    constructor() {
        super(process.env.tblVeiculo)
    }

    protected pk2db(pk: IKey): Record<string, AttributeValue> {
        return {
            IdProprietario: { S: pk.IdProprietario },
            Placa: { S: pk.Placa },
        }
    }

    protected mdl2db(mdl: IData): Record<string, AttributeValue> {
        return {
            ...this.pk2db(mdl),
            Ano: { N: mdl.Ano.toString() },
            Chassis: { S: mdl.Chassis },
            IdFabricante: { S: mdl.IdFabricante },
            IdModelo: { S: mdl.IdModelo },
            Cor: { S: mdl.Cor }
        }
    }

    protected db2mdl(itm: Record<string, AttributeValue>): IData {
        return {
            IdProprietario: itm.IdProprietario.S,
            Placa: itm.Placa.S,
            Ano: Number.parseInt(itm.Ano.N),
            Chassis: itm.Chassis.S,
            IdFabricante: itm.IdFabricante.S,
            IdModelo: itm.IdModelo.S,
            Cor: itm.Cor.S
        }
    }

    async get(key: IKey) {
        return await super._get(key)
    }

    async post(itm: IData) {
        if (!itm.IdProprietario) { throw new Error(MESSAGES.VEICULO.OWNER_REQUIRED) }

        if (!itm.Placa) { throw new Error(MESSAGES.VEICULO.PLATE_REQUIRED) }

        if (!(itm.Placa.toUpperCase().match(/^[A-Z]{3}[0-9][0-9|A-Z][0-9]{2}$/))) { throw new Error(MESSAGES.VEICULO.PLATE_FORMAT) }
        
        if (!itm.Chassis) { throw new Error(MESSAGES.VEICULO.VIN_REQUIRED) }
        
        if (itm.Chassis.length != 17) { throw new Error(MESSAGES.VEICULO.VIN_LENGTH) }

        if (!itm.IdFabricante) { throw new Error(MESSAGES.VEICULO.MAKER_REQUIRED) }

        if (!itm.IdModelo) { throw new Error(MESSAGES.VEICULO.MODEL_REQUIRED) }

        if(await this.find( itm )) { throw new Error(MESSAGES.VEICULO.PLATE_UNIQUE) }

        await super._post(itm);
    }

    async del(pk: IKey) {
        await super._del(pk)
    }

    async list(filter?: IFK){
        
        if(filter?.IdProprietario)
        {
            const {Items} = await this.ddb().send(new QueryCommand({
                TableName: this.tblName,
                KeyConditionExpression: 'IdProprietario=:v1',
                ExpressionAttributeValues: { ":v1": {S: filter.IdProprietario} }
            }));
            
            return Items.map(m=>this.db2mdl(m));
        }
        else{
            const {Items} = await this.ddb().send(new ScanCommand({
                TableName: this.tblName
            }));

            return Items.map(m=>this.db2mdl(m));
        }
    }


    async find(filter: IPK){
        
        const {Items} = await this.ddb().send(new QueryCommand({
            TableName: this.tblName,
            IndexName: `${this.tblName}_GSI1`,
            KeyConditionExpression: 'Placa=:v1',
            ExpressionAttributeValues: {
                ":v1": {S: filter.Placa}, 
            },
        }));
        const itm = Items.at(0);
        
        return itm ? this.db2mdl(itm) : null;
    }
}