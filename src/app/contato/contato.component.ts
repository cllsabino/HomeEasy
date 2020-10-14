import { Component, OnInit } from '@angular/core';

import { ContatoService } from './contato.service';
import { Mensagem } from './../Usuarios/mensagem';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {
  mensagem : Mensagem = {}

  constructor(private contatoServico : ContatoService) { }

  ngOnInit() {
  }
  
  enviarmensagem(){
    this.contatoServico.salvarmensagem(this.mensagem).then((success) =>{
      alert("Mensagem Enviada!");
     });
  }
}
