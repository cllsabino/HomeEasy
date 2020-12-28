export class Pedido {
    nome? : string;
    idContratante? : string;
    idServidor? : string;
    data? : Date;
    hora? : Date;
    local? : string;
    preco? : number;
    tipoPagamento? : string;
    avaliação? : string;
    avaliaçãoNota? : number;
    statusContratante? : boolean;
    statusServidor? : boolean;
}