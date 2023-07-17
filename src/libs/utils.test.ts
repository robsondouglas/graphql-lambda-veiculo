import { mask2String } from "./utils";

describe('UTILS', ()=>{
    it('mask2String', ()=>{
            const v = mask2String('@@@#?##');
            expect(v.toUpperCase().match(/^[A-Z]{3}[0-9][0-9|A-Z][0-9]{2}$/)).not.toBeNull()
    })
});        
