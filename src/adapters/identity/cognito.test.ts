import Cognito from "./cognito"

describe('COGNITO', ()=>{
    const cgn = new Cognito(['https://cognito-idp.sa-east-1.amazonaws.com/sa-east-1_28VaLNwAP'])

    it('ADD USER', async()=>{
        await expect(cgn.addUser({ Email: 'mkufmld331@vigoneo.com', Nome: 'Robson Douglas' })).resolves.not.toThrow();
    })

})