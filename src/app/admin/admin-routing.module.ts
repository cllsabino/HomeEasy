import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard } from '../guardas/admin-guard.guard';
import { AdminVerificationComponent } from './admin-verification.component';

const adminRoutes: Routes = [
  { path: 'admin/verificacoes', component: AdminVerificationComponent, canActivate: [AdminGuard] }
];

@NgModule({ imports: [RouterModule.forChild(adminRoutes)], exports: [RouterModule] })
export class AdminRoutingModule { }
