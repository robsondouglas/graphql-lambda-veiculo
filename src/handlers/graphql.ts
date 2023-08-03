import { ApolloServer, gql } from "apollo-server-lambda";
import { buildSubgraphSchema } from '@apollo/subgraph';
import ql from '../schema.graphql'

import resolvers from '../resolvers'
import App from '../app';
import { Fabricante } from '../app/fabricante/fabricante';
import { Modelo } from '../app/modelo/modelo';
import { Veiculo } from '../app/veiculo/veiculo';
import { default as TopickMocked } from "src/adapters/topic/mocked";
import { SNS } from "src/adapters/topic/sns";
import { IIdentity } from "src/adapters/identity/models";
import Cognito from "src/adapters/identity/cognito";

const DEV_MODE = process.env.STAGE === 'DEV'

//------- SETUP APPLICATION CONTEXT -------
const fabricante = new Fabricante();
const modelo = new Modelo();
const veiculo = new Veiculo();
const topic = DEV_MODE ? new TopickMocked() : new SNS();
const app = new App(fabricante, modelo, veiculo, topic)
//----------------------------------------- 

//--------- SETUP GRAPHQL HANDLER ---------
/********************************************** IMPORTANTE *******************************************************/
const introspection = DEV_MODE; // INTERFACE GŔAFICA DO GRAPHQLSERVER DISPONÍVEL SOMENTE EM DEV 
/*****************************************************************************************************************/

if (DEV_MODE) { console.log("RODANDO EM MODO DE DESENVOLVIMENTO!!!!") }

const typeDefs = gql(ql);
const context = async ({ event }) => {
    const tokenValue = event.headers?.authorization?.split(' ').at(1);
    
    const cgn:IIdentity = new Cognito([`https://cognito-idp.sa-east-1.amazonaws.com/${process.env.cognitoPoolId}`])
    const claims = await cgn.validateUser(tokenValue);
    
    return ({ claims, dataSources: { app } })
}

const srv = new ApolloServer({ context, introspection, schema: buildSubgraphSchema({ typeDefs, resolvers }) });
export const server = srv.createHandler()
//----------------------------------------- 
