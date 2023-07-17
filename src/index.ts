import { handlerPath } from './libs/handler-resolver';

export const auth = {
  handler: `${handlerPath(__dirname)}/handler.auth`,
  description: 'MIDLEWARE PARA AUTORIZAÇÃO DOS SERVIÇOS DE API',
  memorySize: 128,
  timeout: 3
}

export const graphqlHandler = {
  handler: `${handlerPath(__dirname)}/handler.graphqlHandler`,
  description: "Graphql handler.", 
  memorySize: 128,
  timeout: 3,
  events: [
    { httpApi: {path: '/', method: 'POST'} },
    { httpApi: {path: '/', method: 'GET'} }
  ]
      
};
