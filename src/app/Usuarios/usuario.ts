import { Servico } from './servico';

export class Usuario {
    email? : string;
    senha? : string;
    nome? : string;
    idade? : string;
    telefone? : string;
    id? : string;
    foto? : string;
    endereco? : string;
    estado? : string;
    cidade? : string;
    cpfCNPJ? : number;
    servicos? : Servico [] = new Array();
}
