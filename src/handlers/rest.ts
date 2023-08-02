import { Fabricante } from 'src/app/fabricante/fabricante';
import App from '../app';
import { Modelo } from 'src/app/modelo/modelo';
import { Veiculo } from 'src/app/veiculo/veiculo';
import Mocked from 'src/adapters/topic/mocked';

const success = (body:any)=>({
   isBase64Encoded: false,
   statusCode: 200,
   body: JSON.stringify(body),
   headers: { "content-type": "application/json"}
 });

 const fail = (err:Error)=>({
   isBase64Encoded: false,
   statusCode: 500,
   body: err.message,
   headers: { "content-type": "application/json"}
 });

const exec = async(hnd:(app:App)=>any)=>{
   try
   { return success(await hnd(new App(new Fabricante(), new Modelo(), new Veiculo(), new Mocked()))); }
   catch(ex)
   { return fail(ex); }
}

export const addVeiculo       = async (event) => await exec((app) => app.addVeiculo(JSON.parse(event.body)));
export const getVeiculo       = async (event) => await exec((app) => app.getVeiculo(JSON.parse(event.body)));
export const listVeiculos     = async (event) => await exec((app) => app.listVeiculos(JSON.parse(event.body)));

export const getFabricante    = async (event) => await exec((app) => app.getFabricante(JSON.parse(event.body)));
export const listFabricantes  = async (event) => await exec((app) => app.listFabricantes(JSON.parse(event.body)));

export const getModelo        = async (event) => await exec((app) => app.getFabricante(JSON.parse(event.body)));
export const listModelos      = async (event) => await exec((app) => app.listModelos(JSON.parse(event.body)));
