const resolvers = {
    Fabricante: {
        Modelos: ({ Id }, _, { dataSources, claims }) => !claims ? [] : dataSources.app.listModelos({ Id }) 
    },
    
    Modelo: {
        Fabricante: ({ IdFabricante }, _, {dataSources}) => dataSources.app.getFabricante({ Id: IdFabricante }),
    },
    
    Veiculo: {
        Fabricante: ({ IdFabricante }, _, {dataSources}) => dataSources.app.getFabricante({ Id: IdFabricante }),
        Modelo: ({ IdModelo }, _, {dataSources}) => dataSources.app.getModelo({ Id: IdModelo }),
        Proprietario: ({ IdProprietario }) => ({ __typename: "Cidadao", IdCidadao: IdProprietario }),
    },
    
    Cidadao: {
        Veiculos: ({ IdCidadao }, _, { dataSources }) => dataSources.app.listVeiculos({ IdProprietario: IdCidadao }),
    },

    Query: {
        fabricante: (_, { Id }, {dataSources}) => dataSources.app.getFabricante({ Id }),
        fabricantes: (_, { Nome }, { dataSources, claims }) => {
            // if(!claims)
            // { return [] }
            // else
            //{ return dataSources.app.listFabricantes({Nome}) }    
            return dataSources.app.listFabricantes({ Nome })
        },

        modelo: (_, { Id }, {dataSources}) => dataSources.app.getModelo({ Id }),
        modelos: (_, { IdFabricante }, { dataSources }) => dataSources.app.listModelos({ IdFabricante }),

        veiculo: (_, { Placa }, {dataSources}) => dataSources.app.findVeiculo({ Placa }),
        veiculos: (_, { IdProprietario }, { dataSources, claims }) => {
            if (!claims) { return [] }
            else if (claims.client_id == process.env.appCidadao) { return dataSources.app.listVeiculos({ IdProprietario: claims.sub }) }
            else { return dataSources.app.listVeiculos({ IdProprietario }) }
        },
    },

    Mutation: {
        addVeiculo: (_, { itm }, { dataSources, claims }) => {
            if (claims?.client_id != process.env.appCidadao) { throw new Error("NOT AUTHORIZED") }
            else { return dataSources.app.addVeiculo({ ...itm, IdProprietario: claims.sub }) }
        },
        delVeiculo: (_, { Placa }, { dataSources, claims }) => {
            if (claims?.client_id != process.env.appCidadao) { throw new Error("NOT AUTHORIZED") }
            else { dataSources.app.delVeiculo(Placa) }
        },
    },
}

export default resolvers;