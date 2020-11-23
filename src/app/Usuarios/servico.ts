import { Usuario } from './usuario';

export class Servico {
    nome? : string;
    usuarios? : Usuario [] = new Array();
    tipo? : string;
}