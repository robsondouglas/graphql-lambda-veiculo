export type ActionType =  'INSERTED'|'UPDATED'|'DELETED'|'TOGGLED';

export default interface ITopic {
    publish(topicName: string, action:ActionType, data: any): Promise<void>;
}
