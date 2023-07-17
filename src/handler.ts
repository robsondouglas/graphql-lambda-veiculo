import { CognitoJwtVerifier } from "aws-jwt-verify";
import typeDefs from './schema.graphql'
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers,  } from '@as-integrations/aws-lambda';
import { Fabricante } from "./app/fabricante/fabricante";
import resolvers from './resolvers'
import { Modelo } from "./app/modelo/modelo";
import { Veiculo } from "./app/veiculo/veiculo";
import { buildSubgraphSchema } from "@apollo/subgraph";

const generatePolicy = (principalId, effect, resource, data) => {
  const authResponse = {
      principalId: principalId,
      policyDocument: {
          Version: '2012-10-17',
          Statement: [{
              Action: 'execute-api:Invoke',
              Effect: effect,
              Resource: resource
          }]
      },
      context: data
  };
  return authResponse;
};

export const auth    = async(event, _, callback)=> {
  const tokenValue = (event.authorizationToken || event.headers['Authorization'])?.split(' ')[1] ;

  if(!tokenValue)
  { 
    console.log('Token não informado')
    callback('Unauthorized'); 
  }
  else
  {
    try {
      const verifier = CognitoJwtVerifier.create({
        userPoolId: 'sa-east-1_28VaLNwAP',
        clientId:   '7joob4d238qo57i2gdmnkpava2',
        tokenUse: "access"    
      });
      console.log('Verificando token')
      const payload = await verifier.verify(tokenValue);
      console.log('Token autorizado!')
      callback(null, generatePolicy(payload.sub, 'Allow', event.methodArn, payload));
    } 
    catch(e)
    {
      console.log('Erro ao validar token', e); 
      callback('Unauthorized'); 
    }
  }
}

const introspection = true;
const sg = buildSubgraphSchema({ typeDefs: [typeDefs], resolvers })

const server = new ApolloServer({ typeDefs: [typeDefs], resolvers, introspection });
//const server = new ApolloServer({ schema: buildSubgraphSchema({ typeDefs, resolvers })});

const api = handlers.createAPIGatewayProxyEventV2RequestHandler();

const context = async() => ({
  dataSources: {
    fabricante: new Fabricante(),
    modelo:     new Modelo(),
    veiculo:    new Veiculo()
  }
})

 
export const graphqlHandler = startServerAndCreateLambdaHandler( server, api, { context });