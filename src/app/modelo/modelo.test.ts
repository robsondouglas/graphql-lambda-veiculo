import { Modelo } from "./modelo"

describe('MODELO',()=>{
    const mdl = new Modelo();
    it('get', async()=>{
        await expect(mdl.get({ Id: 'd2d6270d2fe0f7f570ff0a2a7a416490' })).resolves.not.toThrow();
    })

    it('list', async()=>{
        expect(mdl.list({Id: '844c56840b5fc26d414cf238381a5f1a' })).resolves.toHaveLength(7);
    })
})