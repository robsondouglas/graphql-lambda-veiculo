import type { AWS } from '@serverless/typescript';
import { graphqlHandler } from './src/index';

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

const stage =  args('stage', 'dev');
const projectName = 'veiculo'

const tables = {
  Veiculo: {key: 'tblVeiculo', name: `VEI_VEICULO_${stage}`},
};

const serverlessConfiguration: AWS = {
  service: projectName,
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    region: 'sa-east-1',
    runtime: 'nodejs18.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
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
            Resource: Object.keys(tables).map( k => ({"Fn::GetAtt": [tables[k].key, 'Arn']}) )
          },
        ]
      }
    }
  },
  // import the function via paths
  functions: { 
    graphqlHandler
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

    appSync:{
      schema: '',
      userPoolConfig: {
        awsRegion: 'sa-east-1',
        defaultAction: 'deny',
        userPoolId: 'sa-east-1_28VaLNwAP',
        mappingTemplates: [
          {
            dataSource: 'FABRICANTE',
            type: 'Query',
            field: 'listarFabricantes',

            description: 'Lista de fabricantes',
            config:{ functionName: 'ListarFabricantes' }
          }
        ],
        dataSources: [
          { 
            type: 'AWS_LAMBDA',
            name: 'Fabricante',
            functionName: 'graphqlHandler' 
          }
        ]
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
      }
    }
  }
};

module.exports = serverlessConfiguration;