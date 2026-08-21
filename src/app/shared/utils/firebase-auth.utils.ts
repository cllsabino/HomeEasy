import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export function getCurrentFirebaseUser(): firebase.User | null {
  if (!firebase.apps.length) {
    return null;
  }

  return firebase.auth().currentUser;
}
