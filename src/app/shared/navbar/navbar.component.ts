import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';

import { ServicoPedidoService } from '../../Servicos/servico-pedido.service';
import { ServiceRequestService } from '../../Servicos/service-request.service';
import { UsuarioService } from '../../Servicos/usuario.service';
import { OrderStatus, Pedido } from '../../Usuarios/pedido';
import { UserRole, Usuario } from '../../Usuarios/usuario';
import { ServiceRequest } from '../models/service-request';
import { getOrderStatus, isPendingOrder } from '../utils/order-status.utils';

interface OrderNotification {
  route: any[];
  title: string;
  date: string;
  city: string;
}

@Component({
  standalone: false,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnChanges, OnDestroy {
  @Input() authenticated = false;
  @Input() userId: string;
  @Output() logout = new EventEmitter<void>();

  menuOpen = false;
  notificationMenuOpen = false;
  profileMenuOpen = false;
  sidebarOpen = false;
  notificationCount = 0;
  notificationItems: OrderNotification[] = [];
  user: Usuario;
  private orderSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private servicoPedidoService: ServicoPedidoService,
    private serviceRequestService: ServiceRequestService,
    private usuarioService: UsuarioService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.updateAuthenticatedLayout();

    if ((changes.userId || changes.authenticated) && this.authenticated && this.userId) {
      this.loadUser();
      this.loadReceivedOrders();
    }

    if (!this.authenticated) {
      this.clearOrderSubscription();
      this.clearUserSubscription();
      this.notificationCount = 0;
      this.notificationItems = [];
      this.user = null;
    }
  }

  ngOnDestroy() {
    this.clearOrderSubscription();
    this.clearUserSubscription();
    this.document.body.classList.remove('authenticated-layout');
  }

  toggleMenu(){
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(){
    this.menuOpen = false;
  }

  toggleSidebar(event: Event) {
    event.stopPropagation();
    this.sidebarOpen = !this.sidebarOpen;
    this.closeNotificationMenu();
    this.closeProfileMenu();
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
    this.closeNotificationMenu();
  }

  closeProfileMenu() {
    this.profileMenuOpen = false;
  }

  toggleNotificationMenu(event: Event) {
    event.stopPropagation();
    this.notificationMenuOpen = !this.notificationMenuOpen;
    this.closeProfileMenu();
  }

  closeNotificationMenu() {
    this.notificationMenuOpen = false;
  }

  @HostListener('document:click')
  closeAccountMenusFromOutside() {
    this.closeNotificationMenu();
    this.closeProfileMenu();
  }

  @HostListener('document:keydown.escape')
  closeMenuWithKeyboard(){
    this.closeMenu();
    this.closeNotificationMenu();
    this.closeProfileMenu();
    this.closeSidebar();
  }

  requestLogout(){
    this.closeMenu();
    this.closeNotificationMenu();
    this.closeProfileMenu();
    this.closeSidebar();
    this.logout.emit();
  }

  get userFirstName() {
    if (!this.user || !this.user.nome) {
      return 'Usuário';
    }

    return this.user.nome.split(' ')[0];
  }

  get userInitial() {
    return this.userFirstName.charAt(0).toUpperCase();
  }

  get isAdmin() {
    return this.user && this.user.role === UserRole.Admin;
  }

  get notificationAriaLabel() {
    if (this.notificationCount === 0) {
      return 'Nenhuma atualização pendente';
    }

    if (this.notificationCount === 1) {
      return '1 atualização pendente';
    }

    return `${this.notificationCount} atualizações pendentes`;
  }

  get notificationBadgeLabel() {
    if (this.notificationCount > 9) {
      return '9+';
    }

    return this.notificationCount.toString();
  }

  hideUnavailableUserPhoto() {
    if (this.user) {
      this.user.foto = '';
    }
  }

  private loadUser() {
    this.clearUserSubscription();
    this.userSubscription = this.usuarioService.getUserWithProfilePhoto(this.userId).subscribe(user => {
      this.user = user;
    });
  }

  private loadReceivedOrders() {
    this.clearOrderSubscription();
    this.orderSubscription = combineLatest(
      this.servicoPedidoService.getPedidosRecebidos(this.userId),
      this.servicoPedidoService.getPedidosFeitos(this.userId),
      this.serviceRequestService.getClientRequests(this.userId)
    ).subscribe(([receivedOrders, placedOrders, serviceRequests]) => {
      const receivedOrderNotifications = receivedOrders
        .filter(order => isPendingOrder(order))
        .map(order => this.createOrderNotification(order, 'newOrder'));
      const proposalNotifications = placedOrders
        .filter(order => getOrderStatus(order) === OrderStatus.ProposalReceived)
        .map(order => this.createOrderNotification(order, 'proposal'));
      const marketplaceProposalNotifications = serviceRequests
        .filter(request => request.status === OrderStatus.ProposalReceived)
        .map(request => this.createServiceRequestNotification(request));
      const notifications = receivedOrderNotifications.concat(proposalNotifications, marketplaceProposalNotifications);

      this.notificationCount = notifications.length;
      this.notificationItems = notifications.slice(0, 4);
    });
  }

  private createOrderNotification(order: Pedido, type: 'newOrder' | 'proposal'): OrderNotification {
    if (type === 'proposal') {
      return {
        route: ['/usuario', order.idServidor, 'pedidos-feitos', order.id],
        title: `Nova proposta para ${order.nome || 'seu pedido'}`,
        date: order.data,
        city: order.cidade
      };
    }

    return {
      route: ['/usuario', order.idContratante, 'pedidos-recebidos', order.id],
      title: `Novo pedido de ${order.nome || 'serviço'}`,
      date: order.data,
      city: order.cidade
    };
  }

  private createServiceRequestNotification(request: ServiceRequest): OrderNotification {
    return {
      route: ['/solicitacoes', request.id],
      title: `Propostas disponíveis para ${request.serviceName || 'sua solicitação'}`,
      date: request.preferredDate || 'Data a combinar',
      city: request.city
    };
  }

  private clearOrderSubscription() {
    if (this.orderSubscription) {
      this.orderSubscription?.unsubscribe();
      this.orderSubscription = null;
    }
  }

  private clearUserSubscription() {
    if (this.userSubscription) {
      this.userSubscription?.unsubscribe();
      this.userSubscription = null;
    }
  }

  private updateAuthenticatedLayout() {
    if (this.authenticated) {
      this.document.body.classList.add('authenticated-layout');
      return;
    }

    this.document.body.classList.remove('authenticated-layout');
  }
}
