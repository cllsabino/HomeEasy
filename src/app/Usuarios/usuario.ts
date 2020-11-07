import { Servico } from './servico';

export class Usuario {
    email? : string;
    senha? : string;
    nome? : string;
    idade? : string;
    servicos? : Servico [] = new Array();
    telefone? : string;
    id? : string;
    foto? : string;
}
