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
    servicos? : Servico [] = new Array();
}
