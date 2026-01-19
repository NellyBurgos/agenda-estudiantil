import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { collection, addDoc, collectionData, query, orderBy, where, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router'; 
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

import { DatabaseService, EventoEstudiantil } from '../../services/database';


@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.css'

})
export class AddTaskComponent implements OnInit {
  public authService = inject(AuthService);
  public router = inject(Router);
  public soyAdmin: boolean = false;
  private dataService = inject(DatabaseService);
  
  materia = '';
  tiposSeleccionados: string[] = [];
  fecha = '';
  hora = '';
  nota: number | null = null;
  nuevaMateriaInput = '';
  nuevaNota: number | null = null; 
  materias: string[] = [
    'Organización empresarial', 'Matemática', 'Arquitectura y Sistemas Operativos',
    'Programación I', 'Inglés I', 'Base de Datos I', 'Probabilidad y Estadística',
    'Programación II', 'Programación III', 'Base de Datos II',
    'Metodología de Sistemas I', 'Inglés II'
  ];

  listaEventos$!: Observable<EventoEstudiantil[]>;
  listaTotalAdmin$!: Observable<EventoEstudiantil[]>; 

  ngOnInit() {
  if (localStorage.getItem('tema') === 'oscuro') {
    document.body.classList.add('oscuro');
  }

  this.authService.user$.subscribe(user => {
    if (user) {
      this.listaEventos$ = this.dataService.obtenerEventos(user.uid);
      if (user.email === 'burgosn871@gmail.com') {
        this.soyAdmin = true;
        this.listaTotalAdmin$ = this.dataService.obtenerTodosLosEventosAdmin();
      }
    }
  });
}

  async guardarEvento() {
    const usuarioActual = this.authService.obtenerUsuarioActual(); 
    //  ESTE ES MI GUARDIÁN 
    if (!usuarioActual) {
      alert("Debes estar logueado para guardar.");
      return;  // ALTO! Aca el guardián detiene todo.
    }

    if (!this.materia || !this.fecha || !this.hora) {
      alert('Por favor completa todos los campos.');
      return;
    }
    // El código de abajo solo se ejecuta si el guardián te deja pasar
    const nuevoEvento: EventoEstudiantil = {
      materia: this.materia,
      tipo: this.tiposSeleccionados.join(', ') || 'General',
      fecha: this.fecha,
      hora: this.hora,
      usuarioId: usuarioActual.uid, // ID para la carpeta
      alumnoEmail: usuarioActual.email || '',
      alumnoNombre: usuarioActual.displayName || 'Estudiante',
      estado: 'pendiente',
      nota: this.nuevaNota || 0,
      creadoEn: new Date()
    };
    try {
      await this.dataService.agregarEvento(usuarioActual.uid, nuevoEvento);
      alert('¡Evento guardado en tu agenda personal!');
      this.limpiarFormulario();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar.");
    }
  }

  async eliminarEvento(id: string) {
    const user = this.authService.obtenerUsuarioActual();
    if (!user || !id) return;

    if (confirm('¿Estás seguro de eliminar este evento?')) {
      try {
        await this.dataService.eliminarEvento(user.uid, id);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  }

 
  async actualizarEstado(evento: any) {
    const user = this.authService.obtenerUsuarioActual();
    if (!user || !evento.id) return;

    try {
      await this.dataService.actualizarEstado(user.uid, evento.id, evento.estado);
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  }
  
  toggleTema() {
    document.body.classList.toggle('oscuro');
    const modo = document.body.classList.contains('oscuro') ? 'oscuro' : 'claro';
    localStorage.setItem('tema', modo);
  }

  agregarMateria() {
    const materiaLimpia = this.nuevaMateriaInput.trim();
    if (materiaLimpia && !this.materias.some(m => m.toLowerCase() === materiaLimpia.toLowerCase())) {
      this.materias.push(materiaLimpia);
      this.materia = materiaLimpia;
      this.nuevaMateriaInput = '';
    }
  }

  limpiarFormulario() {
    this.materia = '';
    this.fecha = '';
    this.hora = '';
    this.nuevaNota = null;
    this.tiposSeleccionados = [];
  }
  
  calcularPromedio(eventos: EventoEstudiantil[]): number {
    const eventosConNota = eventos.filter(e => e.nota && Number(e.nota) > 0);
    if (eventosConNota.length === 0) return 0;
    const suma = eventosConNota.reduce((acc, e) => acc + Number(e.nota), 0);
    return suma / eventosConNota.length;
  }
}
