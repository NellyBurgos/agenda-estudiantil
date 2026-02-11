import { inject, Injectable } from '@angular/core';
import { 
  Auth, 
  user, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  signInWithPopup 
} from '@angular/fire/auth';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

export interface UsuarioRegistrado {
  uid: string;
  email: string | null;
  displayName: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router); 

  user$: Observable<UsuarioRegistrado | null> = user(this.auth).pipe(
    map((fbUser) => {
      if (!fbUser) return null;
      return {
        uid: fbUser.uid,
        email: fbUser.email,
        displayName: fbUser.displayName || 'Estudiante' 
      };
    }),
    catchError(() => of(null))
  );

  obtenerUsuarioActual() {
    return this.auth.currentUser;
  }

  obtenerIdActual(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  async loginConGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' }); 
    
    try {
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error("Error en Google Login:", error);
      return null;
    }
  }

  async login(email: string, pass: string) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, pass);
    } catch (error: any) {
      this.manejarErrores(error);
      throw error;
    }
  }

  async registrarConNombre(email: string, pass: string, nombre: string) {
    try {
      const credencial = await createUserWithEmailAndPassword(this.auth, email, pass);
      await updateProfile(credencial.user, { displayName: nombre });
      return credencial;
    } catch (error: any) {
      this.manejarErrores(error);
      throw error;
    }
  }

  async recuperarContrasena(email: string) {
    if (!email) {
      alert("Por favor, ingresa tu email para enviarte el enlace.");
      return;
    }
    try {
      await sendPasswordResetEmail(this.auth, email);
      alert("¡Listo! Revisa tu bandeja de entrada para cambiar tu contraseña.");
    } catch (error: any) {
      this.manejarErrores(error);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']); 
      console.log("Sesión cerrada correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }
 
  private manejarErrores(error: any) {
    let mensaje = "Ocurrió un error inesperado.";
    
    switch (error.code) {
      case 'auth/user-not-found':
        mensaje = "Este correo no está registrado.";
        break;
      case 'auth/wrong-password':
        mensaje = "La contraseña es incorrecta.";
        break;
      case 'auth/email-already-in-use':
        mensaje = "Este correo ya tiene una cuenta activa.";
        break;
      case 'auth/invalid-email':
        mensaje = "El formato del correo no es válido.";
        break;
      case 'auth/weak-password':
        mensaje = "La contraseña debe tener al menos 6 caracteres.";
        break;
    }
    
    console.error("Firebase Error Code:", error.code);
    alert(mensaje);
  }
}
