import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import ITopic, { ActionType } from "./models";

export class SNS implements ITopic {
    private client = new SNSClient({region: 'sa-east-1'});
        
    async publish(topicName: string, action:ActionType, data: any): Promise<void> {
        const command = new PublishCommand({ 
            TopicArn: topicName,
            Message: JSON.stringify(data),
            MessageAttributes: { // MessageAttributeMap
                "ACTION": { 
                    DataType: "STRING_VALUE", 
                    StringValue: action
                },
            }, 
        });
        await this.client.send(command);
    }
}
