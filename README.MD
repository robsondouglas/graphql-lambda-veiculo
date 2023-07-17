# APRESENTAÇÃO SOBRE SERVERLESS

## AMBIENTE LOCAL
 - DEVCONTAINER INSTALE A EXTENSÃO "ms-vscode-remote.vscode-remote-extensionpack" - (https://code.visualstudio.com/docs/devcontainers/containers)
 - UTILIZE CREDENCIAIS VÁLIDAS DO AWS CLI (aws configure) E UM GRUPO DE USUÁRIOS DO COGNITO
 - PARA EXECUTAR OS TESTES, SERÁ NECESSÁRIO INICIAR O BD PRIMEIRAMENTE (yarn dbinit)
 - PARA RODAR O AMBIENTE LOCAL BASTA EXECUTAR yarn start


 ## TESTES
  - UNITÁRIO: Inicie o BD com o comando yarn dbinit. Em outro terminal use yarn jest arquivo_de_teste.test.ts 
  - INTEGRADO: Use o comando yarn start e a API será executada localmente, mas é necessário que tenha o ambiente provisionado na cloud, pois alguns recursos não podem ser emulados localmente  


PONTOS DE ATENÇÃO PARA EXECUTAR O GRAPHQL NO LAMBDA + NODE + TS
1. Definir @types no ts.config
2. Criar o graph.d.ts no @types
3. Ajustar o serverless.ts para que o esbuild possua o loader adequado => "esbuild: { loader: {'.graphql': 'text'} }"
4. Criar o schema.graphql
5. IMPORTANTE: Desabilitar o "introspection" no Apollo Server. Ex: const server = new ApolloServer({ typeDefs: [typeDefs], resolvers, introspection: false }); 
