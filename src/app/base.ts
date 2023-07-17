
import { DynamoDBClient, AttributeValue, GetItemCommand, PutItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const ddb = process.env.STAGE === 'DEV' ? new DynamoDBClient({ region: "localhost", endpoint: "http://localhost:8000"  }) : new DynamoDBClient({ region: "sa-east-1"  });

export abstract class Base<TPK, TData>{
    constructor(protected tblName:string){

    }

    protected ddb(){ return ddb }

    protected abstract pk2db(pk:TPK):Record<string, AttributeValue>;
    protected abstract mdl2db(mdl:TData):Record<string, AttributeValue>;
    protected abstract db2mdl(itm:Record<string, AttributeValue>):TData;

    protected async _get(pk:TPK){
        const {Item} = await this.ddb().send( new GetItemCommand({
            TableName: this.tblName,
            Key: this.pk2db(pk)
        }));
        
        return Item ? this.db2mdl(Item) : null;
    }

    protected async _post(item:TData){  
        await this.ddb().send( new PutItemCommand({
            TableName: this.tblName,
            Item: this.mdl2db(item)
        }));
    }

    protected async _del (pk:TPK){
        await this.ddb().send( new DeleteItemCommand({
            TableName: this.tblName,
            Key: this.pk2db(pk)                     
        }));
    }
}
