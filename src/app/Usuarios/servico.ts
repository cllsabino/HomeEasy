import { Usuario } from './usuario';

export class Servico {
    id? : string;
    nome? : string;
    usuarios? : Usuario [] = new Array();
}