export class Pedido {
    nome? : string;
    id? : string;
    idServico? :string;
    idContratante? : string;
    idServidor? : string;
    data? : string;
    hora? : Date;
    local? : string;
    preco? : number;
    estado? : string;
    cidade? : string;
    tipoPagamento? : string;
    clienteCancelou? : boolean; 
    profissionalCancelou? : boolean;
    statusProfissional? : boolean;
}