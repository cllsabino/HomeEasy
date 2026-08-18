import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Usuario } from '../Usuarios/usuario';
import { createPublicProfile } from '../shared/utils/public-profile.utils';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuarioCollection : AngularFirestoreCollection<Usuario>;
  usuarioDocument : AngularFirestoreDocument<Usuario>;
  
  constructor(
    public afAuth : AngularFireAuth,
    private afs : AngularFirestore,
    private storage : AngularFireStorage
  ) {
    this.usuarioCollection = this.afs.collection<Usuario>('Usuarios');
    
  }

  getUsuarios(){
   return this.usuarioCollection.snapshotChanges().pipe(map(
      actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Usuario
          const id = a.payload.doc.id

          return {id, ...data}
        })
      }
    ));
  }

  getUsuario(id : string){
    return this.usuarioCollection.doc<Usuario>(id).valueChanges();
  }

  getPublicUsuario(id : string){
    return this.afs.collection('PublicProfiles').doc<Usuario>(id).valueChanges().pipe(
      switchMap(user => user ? of(user) : this.getUsuario(id).pipe(map(createPublicProfile)))
    );
  }

  saveUserProfile(user : Usuario){
    const batch = this.afs.firestore.batch();
    const userReference = this.afs.collection('Usuarios').doc(user.id).ref;
    const publicProfileReference = this.afs.collection('PublicProfiles').doc(user.id).ref;

    batch.set(userReference, user);
    batch.set(publicProfileReference, createPublicProfile(user));

    return batch.commit();
  }

  getUserWithProfilePhoto(userId : string): Observable<Usuario> {
    return this.getUsuario(userId).pipe(
      switchMap(user => this.resolveProfilePhoto(Object.assign({ id: userId }, user || {})))
    );
  }

  resolveProfilePhotos(users : Usuario[]): Observable<Usuario[]> {
    if (!users || users.length === 0) {
      return of(new Array<Usuario>());
    }

    return forkJoin(users.map(user => this.resolveProfilePhoto(user)));
  }

  private resolveProfilePhoto(user : Usuario): Observable<Usuario> {
    if (!user || !user.id) {
      return of(user);
    }

    return this.storage.ref('Usuarios/' + user.id + '/fotoPerfil.jpg').getDownloadURL().pipe(
      map(photoUrl => Object.assign({}, user, { foto: photoUrl })),
      catchError(() => of(user))
    );
  }


  

}
