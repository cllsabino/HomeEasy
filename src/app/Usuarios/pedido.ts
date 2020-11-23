import { Usuario } from './usuario';

export class Pedido {
    id? : string;
    nome? : string;
    pedidos? : Pedido [] = new Array();
}