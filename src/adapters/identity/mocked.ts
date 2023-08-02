import { IIdentity, IUser } from "./models";
import { randomUUID } from "crypto";

export default class Mocked implements IIdentity{

    constructor(){

    }

    async validateUser(token: string): Promise<any> {
        return new Promise(res=>res(token))
    }

    async addUser(_: IUser) {
        return new Promise(res=>res({ User: {Username: randomUUID()} }))
    }

}