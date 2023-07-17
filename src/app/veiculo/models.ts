
export interface IPK{ 
    Placa: string
}

export interface IFK{
    IdProprietario:    string 
}

export interface IKey extends IPK, IFK{

}

export interface IData extends IPK, IFK{
    Chassis:    string,
    Ano:        number,
    IdFabricante: string,
    IdModelo:     string,
    Cor:        string,
}
