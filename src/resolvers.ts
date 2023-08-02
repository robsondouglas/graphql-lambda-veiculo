const resolvers = {
    Query: {
        fabricantes: (_, {Nome}, { dataSources })           =>  dataSources.app.listFabricantes({Nome}),
        fabricante:  (_, {Id}, { dataSources })             =>  dataSources.app.getFabricante({Id}),
        
        modelos:     (_, {IdFabricante}, { dataSources })   =>  dataSources.app.listModelos({IdFabricante}),
        modelo:      (_, {Id}, { dataSources })             =>  dataSources.app.getModelo({Id}),

        veiculos:    (_, {IdProprietario}, { dataSources }) =>  dataSources.app.listVeiculos({IdProprietario}),
        veiculo:     (_, {Placa}, { dataSources })          =>  dataSources.app.findVeiculo({Placa}),
    },

    Mutation: {
        addVeiculo: (_, {itm}, { dataSources, claims }) => dataSources.app.addVeiculo( {...itm, IdProprietario: claims.sub} ),
        delVeiculo: (_, {Placa}, { dataSources }) => dataSources.app.delVeiculo( Placa ),        
    },
    Fabricante: {
        Modelos: ({Id}, _, { dataSources }) =>  dataSources.app.listModelos({Id}),
    },
    Modelo: {
        Fabricante: ({IdFabricante}, _, { dataSources }) =>  dataSources.app.getFabricante({Id: IdFabricante}),
    },
    Veiculo: {
        Fabricante:     ({IdFabricante}, _, { dataSources }) =>  dataSources.app.getFabricante({Id: IdFabricante}),
        Modelo:         ({IdModelo},     _, { dataSources }) =>  dataSources.app.getModelo({Id: IdModelo}),
        Proprietario:   ({IdProprietario})                   =>  ({__typename: "Cidadao", IdCidadao: IdProprietario}),
    },
    Cidadao: {  
        Veiculos:    ({IdCidadao}, _, { dataSources }) => dataSources.app.listVeiculos({IdProprietario: IdCidadao}),
    }

}

export default resolvers;