import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
  
export class RegisterComponent {
  nombre: string = '';
  email: string = '';
  password: string = '';
  isPasswordVisible: boolean = false; 

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
  constructor(
    private authService: AuthService, 
    private router: Router,
    private ngZone: NgZone
  ) {}
 
  async registrar() {
    if (!this.nombre || !this.email || !this.password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      await this.authService.registrarConNombre(
        this.email, 
        this.password, 
        this.nombre
      );
      
      alert("¡Cuenta creada con éxito!");
      
      this.ngZone.run(() => {
        this.router.navigate(['/add-task']); 
      });

    } catch (error: any) {
      console.error(error);
      alert("Error al registrar: " + error.message);
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
