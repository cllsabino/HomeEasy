import { RunInFirebaseInjectionContext } from '../shared/utils/firebase-injection-context.utils';
import { getCurrentFirebaseUser } from '../shared/utils/firebase-auth.utils';
import { EnvironmentInjector, inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CanActivate, Router } from '@angular/router';

import { UserRole, Usuario } from '../Usuarios/usuario';

@Injectable({ providedIn: 'root' })
@RunInFirebaseInjectionContext
export class AdminGuard implements CanActivate {
  readonly firebaseEnvironmentInjector = inject(EnvironmentInjector);
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) { }

  canActivate(): Promise<boolean> {
    const currentUser = getCurrentFirebaseUser();
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
