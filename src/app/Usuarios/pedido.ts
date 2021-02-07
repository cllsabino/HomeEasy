export class Pedido {
    nome? : string;
    id? : string;
    idServico? :string;
    idContratante? : string;
    idServidor? : string;
    data? : Date;
    hora? : Date;
    local? : string;
    preco? : number;
    estado? : string;
    cidade? : string;
    tipoPagamento? : string;
    statusProfissional? : boolean;
    statusContratante? : boolean; 
    profissionalCancelou? : boolean;
}