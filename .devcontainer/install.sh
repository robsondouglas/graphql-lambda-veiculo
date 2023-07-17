echo INSTALANDO JAVA...
apt update 
apt install default-jdk -y 
apt install default-jre -y
clear 

echo INSTALANDO AWS CLI...
mkdir _aws 
cd _aws 
curl https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip -o awscliv2.zip 
unzip awscliv2.zip 
./aws/install 
cd .. 
rm _aws -rf 
apt install less -y
clear

echo INSTALANDO NPM....
npm i

echo INSTALANDO SLS CLI....
npm i serverless -g 
npm i serverless-dynamodb-local -g 
curl https://s3-us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_2023-06-09.tar.gz --output dynamodb.tar.gz
mkdir .dynamodb
tar -zxf dynamodb.tar.gz --directory ./.dynamodb
rm dynamodb.tar.gz

clear

echo INSTALAÇÃO CONCLUÍDA!

# ERRO: npm install --save serverless-appsync-offline
# EXAMPLE: https://github.com/serverless/serverless-graphql/blob/master/app-backend/appsync/lambda/schema.graphql