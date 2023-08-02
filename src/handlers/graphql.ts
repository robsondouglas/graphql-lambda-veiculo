import { ApolloServer, gql } from "apollo-server-lambda";
import { buildSubgraphSchema } from '@apollo/subgraph';
import ql from '../schema.graphql'

import resolvers from '../resolvers'
import App from '../app';
import { Fabricante } from '../app/fabricante/fabricante';
import { Modelo } from '../app/modelo/modelo';
import { Veiculo } from '../app/veiculo/veiculo';
import Mocked from '../adapters/topic/mocked';

//------- SETUP APPLICATION CONTEXT -------
const fabricante = new Fabricante();
const modelo = new Modelo();
const veiculo = new Veiculo();
const topic = new Mocked();
const app = new App(fabricante, modelo, veiculo, topic)
//----------------------------------------- 

//--------- SETUP GRAPHQL HANDLER ---------
/********************************************** IMPORTANTE *******************************************************/
const introspection = process.env.STAGE === 'DEV'; // INTERFACE GŔAFICA DO GRAPHQLSERVER DISPONÍVEL SOMENTE EM DEV 
/*****************************************************************************************************************/

const typeDefs = gql(ql) ;
const context = async({event}) =>  { 
    const [_, data] = event.headers?.authorization?.split(' ').at(1).split('.');
    const claims = data ? JSON.parse( Buffer.from(data, 'base64').toString('ascii') ) : {};
       
    return ({ claims, dataSources: { app  } })
}

const srv = new ApolloServer({ context, introspection, schema: buildSubgraphSchema({ typeDefs, resolvers  })});
export const server = srv.createHandler()
//----------------------------------------- 
