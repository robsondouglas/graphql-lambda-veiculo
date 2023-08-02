import { handlerPath } from './libs/handler-resolver';

export const authMiddleware = {
  handler: `${handlerPath(__dirname)}/handlers/auth.middleware`,
  description: 'MIDLEWARE PARA AUTORIZAÇÃO DOS SERVIÇOS DE API',
  memorySize: 128,
  timeout: 3
}

const auth = {};//{authorizer: {name: 'authMiddleware'}}

export const graphqlHandler = {
  handler: `${handlerPath(__dirname)}/handlers/graphql.server`,
  description: "Graphql API", 
  memorySize: 128,
  timeout: 3,
  events: [
    { httpApi: {path: '/', method: 'POST', ...auth} },
    { httpApi: {path: '/', method: 'GET',  ...auth} }
  ]
};


export const restHandler = {
  listFabricantesHandler: {
    handler: `${handlerPath(__dirname)}/handlers/rest.listFabricantes`,
    description: "Lista de fabricantes", 
    memorySize: 128,
    timeout: 3,
    events: [
      { httpApi: {path: '/fabricantes', method: 'POST', ...auth} }
    ]
  },
  listModelosHandler:{
    handler: `${handlerPath(__dirname)}/handlers/rest.listModelos`,
    description: "Lista de modelos", 
    memorySize: 128,
    timeout: 3,
    events: [
      { httpApi: {path: '/modelos', method: 'POST', ...auth} }
    ]
  }
  
};
