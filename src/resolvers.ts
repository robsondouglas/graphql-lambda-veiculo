const resolvers = {
    Query: {
        fabricantes: (_, __, { dataSources })             =>  dataSources.fabricante.list(),
        fabricante:  (_, {Id}, { dataSources })           =>  dataSources.fabricante.get({Id}),
        
        modelos:     (_, {IdFabricante}, { dataSources }) =>  dataSources.modelo.list({IdFabricante}),
        modelo:      (_, {Id}, { dataSources })           =>  dataSources.modelo.get({Id}),

        veiculos:    (_, {IdProprietario}, { dataSources })      =>  dataSources.veiculo.list({IdProprietario}),
        veiculo:     (_, {Placa}, { dataSources })        =>  dataSources.veiculo.find({Placa}),
    },

    Mutation: {
        addVeiculo: (_, {itm}, { dataSources }) => dataSources.veiculo.post( itm ),
        delVeiculo: (_, {key}, { dataSources }) => dataSources.veiculo.del( key ),        
    },
    Fabricante: {
        __resolveReference: ({Id}, {dataSources})=> dataSources.fabricante.get({Id}),
        Modelos: ({Id}, _, { dataSources }) =>  dataSources.modelo.list({Id}),
    },
    Modelo: {
        __resolveReference: ({Id}, {dataSources})=> dataSources.modelo.get({Id}),
        Fabricante: ({IdFabricante}, _, { dataSources }) =>  dataSources.modelo.get({IdFabricante}),
    },
    Veiculo: {
        __resolveReference: ({Placa}, {dataSources})=> dataSources.veiculo.find({Placa}),
        Fabricante: ({IdFabricante}, _, { dataSources }) =>  dataSources.fabricante.get({Id: IdFabricante}),
        Modelo: ({IdModelo}, _, { dataSources }) =>  dataSources.modelo.get({Id: IdModelo}),
    },
    Cidadao: {
     __resolveReference(referencedLocation) {
        return referencedLocation;
        },

        //Veiculos:    (_, {Id}, { dataSources })      =>  dataSources.veiculo.list({IdProprietario: Id}),
        
    }
    

}

export default resolvers;