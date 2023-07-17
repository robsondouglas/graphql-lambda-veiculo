

export const flatDate = (d) => new Date(d.toDateString())
export const addTime  = (d, h, m?) => {
    const _d = new Date(d);
    if(h)
    {_d.setHours( _d.getHours() + h );}

    if(m)
    {_d.setMinutes( _d.getMinutes() + m );}
    
    return _d;
}

export const week = (d:Date) => {
    const ini:Date = new Date(d.getFullYear(), 0,1);
    const days = (d.valueOf() - ini.valueOf())/1000/60/60/24 + 1;
    return Math.ceil((ini.getDay()+days)/7);
}

export const mask2String = (mask:string) => {        
    const num = ()=> Math.round(Math.random()*9).toString();
    const chr = ()=> String.fromCharCode( Math.round(Math.random()*25) + 65  )
    const all = ()=> Math.random()>0.5 ? num() : chr() 

    const hnd = { '@': chr, '#': num, '?': all };

    return mask.split('').map( m => hnd[m]?.() || m ).join('');
}


