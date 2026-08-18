import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CanActivate, Router } from '@angular/router';

import { UserRole, Usuario } from '../Usuarios/usuario';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) { }

  canActivate(): Promise<boolean> {
    const currentUser = this.afAuth.auth.currentUser;
    if (!currentUser) {
      this.router.navigate(['/login']);
      return Promise.resolve(false);
    }

    return this.afs.collection('Usuarios').doc<Usuario>(currentUser.uid).ref.get().then(snapshot => {
      const user = snapshot.data() as Usuario;
      const isAdmin = snapshot.exists && user.role === UserRole.Admin;

      if (!isAdmin) {
        this.router.navigate(['/feed']);
      }

      return isAdmin;
    });
  }
}
