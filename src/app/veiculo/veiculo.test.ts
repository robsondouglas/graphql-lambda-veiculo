import { randomUUID } from "crypto";
import { IData } from "./models";
import { MESSAGES } from "../../libs/messages";
import { Veiculo } from "./veiculo";
import { mask2String } from "../../libs/utils";

describe('VEICULO', ()=>{
    const veiculo = new Veiculo();
    
    
    

    const mockData = (owner:string) : IData => ({
        Placa: mask2String('@@@#?##'),
        IdProprietario: owner,
        Chassis: mask2String('#@@@@##@@########'),
        Ano: Math.round(Math.random() * 23) + 2000,
        IdFabricante: '844c56840b5fc26d414cf238381a5f1a',
        IdModelo: 'f7591a779adc8af5c021be754564532a',
        Cor : 'AZUL',        
    });
    
        
    it('POST',async()=>{
        const itm = mockData(randomUUID());
        
        await expect(veiculo.post({...itm, IdProprietario: null})).rejects.toThrow(MESSAGES.VEICULO.OWNER_REQUIRED);
        await expect(veiculo.post({...itm, Chassis: null})).rejects.toThrow(MESSAGES.VEICULO.VIN_REQUIRED);
        await expect(veiculo.post({...itm, Chassis: 'aaakslc12'})).rejects.toThrow(MESSAGES.VEICULO.VIN_LENGTH);
        await expect(veiculo.post({...itm, Placa: null})).rejects.toThrow(MESSAGES.VEICULO.PLATE_REQUIRED);
        await expect(veiculo.post({...itm, Placa: 'AA-8080'})).rejects.toThrow(MESSAGES.VEICULO.PLATE_FORMAT);
        await expect(veiculo.post({...itm, IdFabricante: null})).rejects.toThrow(MESSAGES.VEICULO.MAKER_REQUIRED);
        await expect(veiculo.post({...itm, IdModelo: null})).rejects.toThrow(MESSAGES.VEICULO.MODEL_REQUIRED);
        
        await expect(veiculo.post(itm)).resolves.not.toThrow();

        await expect(veiculo.post({...itm, IdProprietario: randomUUID()})).rejects.toThrow(MESSAGES.VEICULO.PLATE_UNIQUE);
        
    });

    it('GET', async()=>{
        const itm = mockData(randomUUID());
        await veiculo.post(itm);

        await expect(veiculo.get({IdProprietario: randomUUID(), Placa: itm.Placa})).resolves.toBeNull();
        await expect(veiculo.get({IdProprietario: itm.IdProprietario, Placa: randomUUID()})).resolves.toBeNull();
        
        await expect(veiculo.get({IdProprietario: itm.IdProprietario, Placa: itm.Placa })).resolves.toMatchObject(itm);
    });

    it('DELETE', async()=>{
        const itm = mockData(randomUUID());
        await veiculo.post(itm);
        const pk:{IdProprietario, Placa}  = itm;
        
        await expect(veiculo.get({...pk})).resolves.not.toBeNull();
        await expect(veiculo.del({...pk})).resolves.not.toThrow();
        await expect(veiculo.get({...pk})).resolves.toBeNull();
    })
    
    it('LIST', async()=>{
        const szOwners      = 2;
        const szVehicles    = 3;
        
        expect(veiculo.list(  )).resolves.not.toThrow();
        
        const owners    = Array.from({length: szOwners}).map((_) => randomUUID());
        const vehicles : IData[]  = [];
        
        for(let o of owners)
        { vehicles.push( ...Array.from({length: szVehicles}).map( (_) => mockData(o) ) ) }

        await Promise.all(vehicles.map(v=> veiculo.post(v) ));

        for(let o of owners)
        {
            await expect( veiculo.list( { IdProprietario: o } ) ).resolves.toHaveLength(szVehicles);
            const ls = await veiculo.list( { IdProprietario: o } );
            
            for(let itm of ls)
            { await expect(itm).toMatchObject( { IdProprietario: o } ) }
        }
        
    });

    it('FIND', async()=>{
        const szOwners      = 2;
        const szVehicles    = 3;
        
        const owners    = Array.from({length: szOwners}).map((_) => randomUUID());
        const vehicles : IData[]  = [];
        
        for(let o of owners)
        { vehicles.push( ...Array.from({length: szVehicles}).map( (_) => mockData(o) ) ) }

        await Promise.all(vehicles.map(v=> veiculo.post(v) ));

        for (let v of vehicles)
        {  
            await expect(veiculo.find({Placa: v.Placa})).resolves.toMatchObject( v );
        }
        
    });

})