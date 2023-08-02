import { Fabricante } from "./fabricante"

describe('FABRICANTE',()=>{
    const fab = new Fabricante();
    it('get', async()=>{
        await expect(fab.get({ Id: '844c56840b5fc26d414cf238381a5f1a' })).resolves.not.toThrow();
    })

    it('list', async()=>{
        expect(fab.list({Nome: ''})).resolves.toHaveLength(12);
    })
})