import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, HostListener, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';

import { UsuarioService } from '../../Servicos/usuario.service';
import { Usuario } from '../../Usuarios/usuario';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnChanges, OnDestroy {
  @Input() authenticated = false;
  @Input() userId: string;
  @Output() logout = new EventEmitter<void>();

  menuOpen = false;
  profileMenuOpen = false;
  sidebarOpen = false;
  user: Usuario;
  private userSubscription: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    this.updateAuthenticatedLayout();

    if ((changes.userId || changes.authenticated) && this.authenticated && this.userId) {
      this.loadUser();
    }

    if (!this.authenticated) {
      this.clearUserSubscription();
      this.user = null;
    }
  }

  ngOnDestroy() {
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
    this.closeProfileMenu();
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  toggleProfileMenu(event: Event) {
    event.stopPropagation();
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  closeProfileMenu() {
    this.profileMenuOpen = false;
  }

  @HostListener('document:click')
  closeProfileMenuFromOutside() {
    this.closeProfileMenu();
  }

  @HostListener('document:keydown.escape')
  closeMenuWithKeyboard(){
    this.closeMenu();
    this.closeProfileMenu();
    this.closeSidebar();
  }

  requestLogout(){
    this.closeMenu();
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

  private clearUserSubscription() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
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
