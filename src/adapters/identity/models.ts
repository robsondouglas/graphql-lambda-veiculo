

export interface IUser{
    Nome:string,
    Email:string
}


export interface IIdentity{
    validateUser(accessToken:string):Promise<any>;
    addUser(usr:IUser):any;
}
