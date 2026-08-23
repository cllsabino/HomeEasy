import { getCurrentUser } from '../../shared/utils/session-user.utils';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

import { ServicosService } from '../../Servicos/servicos.service';
import { LoginServiceService } from '../../Servicos/login-service.service';
import { ServicoPedidoService } from './../../Servicos/servico-pedido.service';
import { Usuario } from 'src/app/Usuarios/usuario';
import { Servico } from './../../Usuarios/servico';
import { ServicoPedido } from './../../Usuarios/serico-pedido';
import { UsuarioService } from './../../Servicos/usuario.service';
import { NotificationService } from '../../shared/notification/notification.service';
import { ScheduleService } from '../../Servicos/schedule.service';

@Component({
  standalone: false,
  selector: 'app-editar-info',
  templateUrl: './editar-info.component.html',
  styleUrls: ['./editar-info.component.css']
})
export class EditarInfoComponent implements OnInit {
  userId : string; //id do usuario
  entrarSair : boolean;
  servicoped : ServicoPedido = {}; //detalhe do serviço
  serveId : string; //id do serviço
  serveIdSubscription : Subscription;
  servico : Servico = {}; //o serviço
  servicoSubscription : Subscription;
  usuario : Usuario = {};
  usuarioSubscription : Subscription;
  serviceDetailsSubscription: Subscription;
  isSubmitting = false;
  readonly weekdays = [
    { value: 'monday', label: 'Segunda' }, { value: 'tuesday', label: 'Terça' },
    { value: 'wednesday', label: 'Quarta' }, { value: 'thursday', label: 'Quinta' },
    { value: 'friday', label: 'Sexta' }, { value: 'saturday', label: 'Sábado' },
    { value: 'sunday', label: 'Domingo' }
  ];

  constructor(
    public loginService : LoginServiceService,
    public servicoService : ServicosService, 
    public servicoPedido : ServicoPedidoService,
    public usuarioService : UsuarioService,
    public router : Router,
    public active : ActivatedRoute,
    private notificationService: NotificationService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit() {
    if(getCurrentUser() != null){
      this.entrarSair = true;
      this.userId = getCurrentUser().uid;
    }else this.entrarSair = false;

    this.serveIdSubscription = this.active.params.subscribe(
      (params : Params) => { this.serveId = params['idd'] }
    );
    this.servicoSubscription = this.servicoService.getUserServicoPorId(this.userId, this.serveId).subscribe(data => {
      this.servico = data}
    );
    this.serviceDetailsSubscription = this.servicoPedido.getDetalheServico(this.userId, this.serveId).subscribe(serviceDetails => {
      this.servicoped = serviceDetails || {};
      this.loadSchedule();
    });
    this.usuarioSubscription = this.usuarioService.getUsuario(this.userId).subscribe(data => {
      this.usuario = data;
    });

  }
  ngOnDestroy(){
    this.serveIdSubscription?.unsubscribe();
    this.servicoSubscription?.unsubscribe();
    this.usuarioSubscription?.unsubscribe();
    this.serviceDetailsSubscription?.unsubscribe();
  }
  async sair(){
    try{
      await this.loginService.sair().then(
        (success) => {this.router.navigate(["/home"])});
     } catch (error) {
       return;
    }
  }
  async editarInfo(){
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;
    this.servicoped.id = this.serveId;
    try {
      await this.servicoPedido.addServicoPedido(this.usuario, this.servico, this.servicoped);
      this.notificationService.showSuccess('Serviço atualizado', 'As novas informações já estão disponíveis no seu perfil.');
      this.router.navigate(['/feed']);
    } catch (error) {
      this.notificationService.showError('Não foi possível atualizar', 'Verifique sua conexão e tente salvar o serviço novamente.');
    } finally {
      this.isSubmitting = false;
    }
  }

  isWeekdayAvailable(weekday: string) {
    return Boolean(this.servicoped.availableWeekdays && this.servicoped.availableWeekdays.indexOf(weekday) !== -1);
  }

  toggleWeekday(weekday: string, checked: boolean) {
    const availableWeekdays = this.servicoped.availableWeekdays || [];
    const weekdayIndex = availableWeekdays.indexOf(weekday);
    if (checked && weekdayIndex === -1) {
      availableWeekdays.push(weekday);
    }
    if (!checked && weekdayIndex !== -1) {
      availableWeekdays.splice(weekdayIndex, 1);
    }
    this.servicoped.availableWeekdays = availableWeekdays;
  }

  private loadSchedule() {
    this.scheduleService.getOwnSchedule().subscribe(schedule => {
      this.servicoped.availableWeekdays = this.scheduleService.toWeekdayNames(schedule.periods);
      const firstPeriod = schedule.periods[0];
      if (firstPeriod) {
        this.servicoped.availableStartTime = firstPeriod.startTime.slice(0, 5);
        this.servicoped.availableEndTime = firstPeriod.endTime.slice(0, 5);
      }
    });
  }

}
