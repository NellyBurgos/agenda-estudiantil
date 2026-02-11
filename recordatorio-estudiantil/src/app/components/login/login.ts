import { Component, OnInit, NgZone, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; 
import { FormsModule } from '@angular/forms';  
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [CommonModule, FormsModule], 
  templateUrl: './login.html',
  styleUrl: './login.css'
})
  
export class LoginComponent implements OnInit {
  nuevoNombre: string = '';
  nuevoEmail: string = '';
  nuevoPass: string = '';
  isPasswordVisible: boolean = false; 

  private platformId = inject(PLATFORM_ID);

  constructor(
    public authService: AuthService, 
    private router: Router, 
    private ngZone: NgZone
  ) {}
  
  irARegistro() {
    console.log("¡Clic detectado!"); 
    this.ngZone.run(() => {
      this.router.navigate(['/register']).then(success => {
        if (success) {
          console.log("Navegación exitosa a Registro");
        } else {
          console.error("La navegación falló");
        }
      });
    });
  
  }
  ngOnInit() {
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  async ejecutarLogin() {
    if (!this.nuevoEmail || !this.nuevoPass) {
      alert("Por favor, completa email y contraseña.");
      return;
    }

    try {
      await this.authService.login(this.nuevoEmail, this.nuevoPass);
      console.log("Iniciando sesión...");
      this.ngZone.run(() => {
        this.router.navigate(['/add-task']);
      });
    } catch (error: any) {
      console.error("Error en login:", error);
      alert("Error: Usuario o contraseña incorrectos.");
    }
  }
  

  async ejecutarRegistro() {
    if (this.nuevoNombre && this.nuevoEmail && this.nuevoPass) {
      try {
        await this.authService.registrarConNombre(
          this.nuevoEmail, 
          this.nuevoPass, 
          this.nuevoNombre
        );
        
        alert("¡Registro exitoso!");
        this.ngZone.run(() => {
          this.router.navigate(['/add-task']); 
        });

      } catch (error: any) {
        console.error("Error completo:", error);
        
        // Manejo de errores específicos de Firebase
        if (error.code === 'auth/email-already-in-use') {
          try {
            await this.authService.login(this.nuevoEmail, this.nuevoPass);
            this.router.navigate(['/add-task']);
          } catch (loginError) {
            alert("Este correo ya está registrado, pero la contraseña es incorrecta.");
          }
        } else if (error.code === 'auth/weak-password') {
          alert("La contraseña debe tener al menos 6 caracteres.");
        } else if (error.code === 'auth/invalid-email') {
          alert("El formato del correo no es válido.");
        } else {
          alert("Ocurrió un error: " + error.message);
        }
      }
    } else {
      alert("Por favor, completa todos los campos.");
    }
  }
}
