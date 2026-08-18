import { Usuario } from '../../Usuarios/usuario';

export function createPublicProfile(user: Usuario): Usuario {
  const profile: Usuario = { id: user.id };

  if (user.nome) {
    profile.nome = user.nome;
  }
  if (user.foto) {
    profile.foto = user.foto;
  }
  if (user.cidade) {
    profile.cidade = user.cidade;
  }
  if (user.estado) {
    profile.estado = user.estado;
  }
  if (user.verificationStatus) {
    profile.verificationStatus = user.verificationStatus;
  }

  return profile;
}
