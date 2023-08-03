import { CognitoJwtVerifier } from "aws-jwt-verify";
import { IIdentity, IUser } from "./models";
import { AdminCreateUserCommand, AdminCreateUserCommandInput, CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export default class Cognito implements IIdentity{

    constructor(private issuers:string[]){

    }

    async validateUser(token: string): Promise<any> {
      
      if(!token)
      { return null }

      const [_, data] = token?.split('.');  

      if(!data)
      { return null }

      const payload = JSON.parse( Buffer.from(data, 'base64').toString('ascii') )
      
      if(this.issuers.indexOf(payload.iss) < 0)
      { throw new Error("Issuer not allowed") }
      else
      {
        const verifier = CognitoJwtVerifier.create({
          userPoolId: payload.iss.split('/').at(-1),
          clientId:   payload.client_id ,
          tokenUse: "access"    
        });
        
        return await verifier.verify(token);
      }
    }

    async addUser(usr: IUser) {
        const client = new CognitoIdentityProviderClient({region: 'sa-east-1'})
        
        const input:AdminCreateUserCommandInput = { 
            UserPoolId: this.issuers[0].split('/').at(-1), 
            Username: usr.Email,             
            UserAttributes: [ 
              {  Name: "name",  Value: usr.Nome }
            ],
            DesiredDeliveryMediums: ["EMAIL"]
          };
          
          const command = new AdminCreateUserCommand(input);
          return await client.send(command);
    }

}