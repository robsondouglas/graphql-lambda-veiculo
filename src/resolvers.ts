const resolvers = {
    Query: {
        fabricantes: (_, {Nome}, { dataSources, claims })           =>  {
            // if(!claims)
            // { return [] }
            // else
            //{ return dataSources.app.listFabricantes({Nome}) }    
            return dataSources.app.listFabricantes({Nome})
        },
        fabricante:  (_, {Id}, { dataSources })             =>  dataSources.app.getFabricante({Id}),
        
        modelos:     (_, {IdFabricante}, { dataSources })   =>  dataSources.app.listModelos({IdFabricante}),
        modelo:      (_, {Id}, { dataSources })             =>  dataSources.app.getModelo({Id}),

        veiculos:    (_, {IdProprietario}, { dataSources, claims }) =>  {
            if(!claims)
            { return [] }
            else if(claims.client_id == process.env.appCidadao)
            { return dataSources.app.listVeiculos( {IdProprietario: claims.sub} ) }
            else
            { return dataSources.app.listVeiculos({IdProprietario}) }
            
        },
        veiculo:     (_, {Placa}, { dataSources })          =>  dataSources.app.findVeiculo({Placa}),
    },

    Mutation: {
        addVeiculo: (_, {itm}, { dataSources, claims }) => {
            if(claims?.client_id != process.env.appCidadao)
            { throw new Error("NOT AUTHORIZED") }
            else
            { return dataSources.app.addVeiculo( {...itm, IdProprietario: claims.sub} ) }
        },
        delVeiculo: (_, {Placa}, { dataSources, claims }) => {
            if(claims?.client_id != process.env.appCidadao)
            { throw new Error("NOT AUTHORIZED") }
            else
            { dataSources.app.delVeiculo( Placa ) }
        },        
    },
    Fabricante: {
        Modelos: ({Id}, _, { dataSources, claims }) =>  {
            if(!claims)
            { return [] }
            else    
            {return dataSources.app.listModelos({Id})}
        },
    },
    Modelo: {
        Fabricante: ({IdFabricante}, _, { dataSources }) =>  dataSources.app.getFabricante({Id: IdFabricante}),
    },
    Veiculo: {
        Fabricante:     ({IdFabricante})    =>  ({__typename: "Fabricante", Id: IdFabricante}),
        Modelo:         ({IdModelo})        =>  ({__typename: "Modelo", Id: IdModelo}),
        Proprietario:   ({IdProprietario})  =>  ({__typename: "Cidadao", IdCidadao: IdProprietario}),
    },
    Cidadao: {  
        Veiculos:    ({IdCidadao}, _, { dataSources }) => dataSources.app.listVeiculos({IdProprietario: IdCidadao}),
    }

}

export default resolvers;