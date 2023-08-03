import type { AWS } from '@serverless/typescript';
import { graphqlHandler, restHandler, authMiddleware } from './src/index';

const args = (key:string, defaultValue:string) =>  {
  const idx = process.argv.findIndex(f=>f.startsWith(`--${key}`))
  if(idx<0)
  { return defaultValue }
  else
  {
    const arg = process.argv[idx].split('=')
    return (arg.length == 2) ? arg[1] : process.argv[idx+1]
  }
}

const accountId = 813397945060;
const service   = {alias: "VEI", name: 'Veiculo' }
const stage     =  args('stage', 'dev').toUpperCase();
const region    = "sa-east-1";
const cognitoPoolId = 'sa-east-1_lK1q4kfO6';

const tables    =   {
  Veiculo: {key: 'tblVeiculo', name: `${service.alias}_VEICULO_TBL_${stage}`, index: ['_GSI1']},
};

const topics = {
  Veiculo: {key: 'topVeiculo', name: `${service.alias}_VEICULO_TOP_${stage}`},
}

const Apps = {
  Agente: '1smc1s7c4ktbre5a5ijqcuskkq',
  Admin: '3qtrdb222hhnc5a1d36qsjmpkb',
  Cidadao: 'bbvm4gnh4gllju7f4bdepdioh'
}

const serverlessConfiguration: AWS = {
  service: service.name.toLowerCase(),
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    httpApi: {
      cors: { allowedOrigins: ['*'], allowedHeaders: ['Content-Type', 'Authorization'], allowedMethods: ['POST', 'GET'], /*allowCredentials: true*/ },
      authorizers: {
        authMiddleware: {
          type: 'jwt',
          identitySource: '$request.header.Authorization',
          issuerUrl: `https://cognito-idp.sa-east-1.amazonaws.com/${cognitoPoolId}`,
          audience: [Apps.Admin, Apps.Agente, Apps.Cidadao]
        }
      }
    },
    region,
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      tblVeiculo  : tables.Veiculo.name,
      topicVeiculo: topics.Veiculo.name,
      cognitoPoolId,
      appCidadao: Apps.Cidadao,
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      ... Object.keys(tables).reduce((obj, k)=> { obj[`tbl${k}`]  = tables[k].name; return obj }, {}),
    },
    iam:{
      role:{
        statements:[
          {
            Effect: "Allow", 
            Action: [
              "dynamodb:BatchGet*",
              "dynamodb:DescribeTable",
              "dynamodb:Get*",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:BatchWrite*",
              "dynamodb:Delete*",
              "dynamodb:Update*",
              "dynamodb:PutItem"
            ],
            Resource: Object.keys(tables).reduce((itm, k)=> { itm.push(`table/${tables[k].name}`); tables[k].index?.forEach( i => itm.push(`table/${tables[k].name}/index/${tables[k].name}${i}`)) ; return itm }, []).map( m=> `arn:aws:dynamodb:${region}:${accountId}:${m}`)
          },
          {
            Effect: "Allow", 
            Action: [
              "sns:Publish",
              "sns:Subscribe",
              "sns:GetTopicAttributes",
            ],
            Resource: Object.keys(topics).map( k => `arn:aws:sns:${region}:${accountId}:${topics[k].name}`) 
          },
        ]
      }
    }
  },
  // import the function via paths
  functions: { 
    authMiddleware, graphqlHandler, ...restHandler 
  },
  package: { individually: true },
  
  custom: {
    dynamodb: {
      stages: [stage],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
        seed: true
      }
    }, 

    esbuild: {
      bundle: true,
      loader: {'.graphql': 'text'},
      minify: true,
      sourcemap: false,
      external: ['sharp'],
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      packagerOptions: {scripts: ['npm install --arch=x64 --platform=linux sharp']}
    },
  },
  resources:{
    Resources:{
        [tables.Veiculo.key]: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: tables.Veiculo.name,
          AttributeDefinitions:[
            {AttributeName:'Placa',     AttributeType: 'S'},
            {AttributeName:'IdProprietario',   AttributeType: 'S'}
          ],
          KeySchema:[
            {AttributeName: 'IdProprietario', KeyType: 'HASH'},
            {AttributeName: 'Placa',   KeyType: 'RANGE'},            
          ],
          GlobalSecondaryIndexes:[
            {
              IndexName: `${tables.Veiculo.name}_GSI1`,
              KeySchema:[
                {AttributeName: 'Placa',   KeyType: 'HASH'}
              ],
              Projection:{
                ProjectionType: 'ALL'
              }
            }
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }
      },
      [topics.Veiculo.key]: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: topics.Veiculo.name
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;