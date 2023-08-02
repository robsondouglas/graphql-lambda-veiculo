import Mocked from "../adapters/topic/mocked";
import App from "."
import { Fabricante } from "./fabricante/fabricante";
import { Modelo } from "./modelo/modelo";
import { Veiculo } from "./veiculo/veiculo";
import { mask2String } from "../libs/utils";
import { randomUUID } from "crypto";
import { IData as IDataVeiculo} from "./veiculo/models";

describe('APP', ()=>{
    const app = new App( new Fabricante(), new Modelo(), new Veiculo(), new Mocked() );

    const mockData = (owner:string) : IDataVeiculo => ({
        Placa: mask2String('@@@#?##'),
        IdProprietario: owner,
        Chassis: mask2String('#@@@@##@@########'),
        Ano: Math.round(Math.random() * 23) + 2000,
        IdFabricante: '844c56840b5fc26d414cf238381a5f1a',
        IdModelo: 'f7591a779adc8af5c021be754564532a',
        Cor : 'AZUL',        
    });

    it('ADD VEÍCULO', async()=>{
        await expect(app.addVeiculo( mockData(randomUUID()) )).resolves.not.toThrow()
    })



    it('LIST FABRICANTE', async()=>{
        expect(app.listFabricantes({Nome: ''})).resolves.toHaveLength(12);
    })
})