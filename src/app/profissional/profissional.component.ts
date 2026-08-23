import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginServiceService } from '../Servicos/login-service.service';
import { ServicosService } from '../Servicos/servicos.service';
import { UsuarioService } from '../Servicos/usuario.service';
import { getCurrentUser } from '../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.css']
})
export class ProfissionalComponent implements OnInit {
  entrarSair: boolean;
  userId: string;

  constructor(
    public servico: ServicosService,
    public loginService: LoginServiceService,
    public usuarioService: UsuarioService,
    public router: Router
  ) {}

  ngOnInit() {
    const currentUser = getCurrentUser();
    if (currentUser != null) {
      this.entrarSair = true;
      this.userId = currentUser.uid || currentUser.id;
    } else {
      this.entrarSair = false;
    }
  }

  async sair() {
    try {
      await this.loginService.sair().then(() => {
        this.router.navigate(['/home']);
      });
    } catch (error) {
      return;
    }
  }
}
