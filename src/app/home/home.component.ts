import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginServiceService } from '../Servicos/login-service.service';
import { getCurrentUser } from '../shared/utils/session-user.utils';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authenticated = false;
  userId: string;

  constructor(
    private loginService: LoginServiceService,
    private router: Router
  ) { }

  ngOnInit() {
    const currentUser = getCurrentUser();

    if (currentUser) {
      this.authenticated = true;
      this.userId = currentUser.uid || currentUser.id;
    }
  }

  async logout() {
    await this.loginService.sair();
    this.authenticated = false;
    this.userId = null;
    this.router.navigate(['/home']);
  }
}
