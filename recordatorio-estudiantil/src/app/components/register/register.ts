import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // Verifica que la ruta sea correcta

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  // 1. Estas variables deben llamarse igual que en el [(ngModel)] del HTML
  nombre: string = '';
  email: string = '';
  password: string = '';
  isPasswordVisible: boolean = false; // Controla el estado del 

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  constructor(
    private authService: AuthService, 
    private router: Router,
    private ngZone: NgZone
  ) {}
 

  // 2. Esta función debe llamarse igual que en el (ngSubmit) del HTML
  async registrar() {
    if (!this.nombre || !this.email || !this.password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Llamamos al servicio para crear el usuario en Firebase
      await this.authService.registrarConNombre(
        this.email, 
        this.password, 
        this.nombre
      );
      
      alert("¡Cuenta creada con éxito!");
      
      // Navegamos a la pantalla principal
      this.ngZone.run(() => {
        this.router.navigate(['/add-task']); 
      });

    } catch (error: any) {
      console.error(error);
      alert("Error al registrar: " + error.message);
    }
  }

  // 3. Esta función permite volver al Login
  irALogin() {
    this.router.navigate(['/login']);
  }
}