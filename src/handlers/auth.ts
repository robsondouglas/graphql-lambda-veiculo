import Cognito from "src/adapters/identity/cognito";
import { IIdentity } from "src/adapters/identity/models";

const generatePolicy = (principalId, effect, resource, data) => ({
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
});
   

export const middleware    = async(event, _, callback)=> {
  const tokenValue = (event.authorizationToken || event.headers['Authorization'])?.split(' ')[1] ;

  if(!tokenValue)
  { 
    console.log('Token não informado')
    callback('Unauthorized'); 
  }
  else
  {
    try {
      const cgn:IIdentity = new Cognito(['https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_28VaLNwAP'])
      const payload = await cgn.validateUser(tokenValue);
      callback(null, generatePolicy(payload.sub, 'Allow', event.methodArn, payload));
    } 
    catch(e)
    {
      console.log('Erro ao validar token', e); 
      callback('Unauthorized'); 
    }
  }
}