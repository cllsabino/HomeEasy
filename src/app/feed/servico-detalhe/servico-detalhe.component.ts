import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicosService } from '../../Servicos/servicos.service';
import { Usuario } from 'src/app/Usuarios/usuario';
import { UsuarioService } from '../../Servicos/usuario.service';
import { getCurrentUser } from '../../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-servico-detalhe',
  templateUrl: './servico-detalhe.component.html',
  styleUrls: ['./servico-detalhe.component.css']
})
export class ServicoDetalheComponent implements OnInit, OnDestroy {
  usuariosArray = new Array<Usuario>();
  usuariosSubscription: Subscription;
  serveID: string;
  serveIDSubscription: Subscription;
  entrarSair: boolean;
  userId: string;
  isLoading = true;

  constructor(
    public loginService: LoginServiceService,
    public servico: ServicosService,
    public usuarioService: UsuarioService,
    public router: Router,
    public active: ActivatedRoute
  ) {}

  ngOnInit() {
    this.serveIDSubscription = this.active.params.subscribe(
      (params: Params) => { this.serveID = params['id']; }
    );

    this.usuariosSubscription = this.servico.getUsuarios(this.serveID).pipe(
      switchMap(users => this.usuarioService.resolveProfilePhotos(users))
    ).subscribe(data => {
      this.usuariosArray = data;
      this.isLoading = false;
    });

    const currentUser = getCurrentUser();
    if (currentUser != null) {
      this.entrarSair = true;
      this.userId = currentUser.uid || currentUser.id;
    } else {
      this.entrarSair = false;
    }
  }

  ngOnDestroy() {
    this.usuariosSubscription?.unsubscribe();
    this.serveIDSubscription?.unsubscribe();
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
