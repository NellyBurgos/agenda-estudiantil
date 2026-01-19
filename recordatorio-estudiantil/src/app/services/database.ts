import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  collectionData, 
  doc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy,
  collectionGroup 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

// 1. DEFINICIÓN DE LA INTERFAZ (El "Molde" de tus datos)
// Esto evita errores de escritura y elimina el uso de 'any'
export interface EventoEstudiantil {
  id?: string;         // Opcional porque al crear aún no tiene ID
  materia: string;
  tipo: string | string[]; // Puede ser texto o array de tipos
  fecha: string;
  hora: string;
  nota: number;
  estado: string;      // Ej: 'pendiente', 'aprobado'
  usuarioId: string;
  alumnoEmail?: string;
  alumnoNombre?: string;
  descripcion?: string;
  creadoEn?: Date;      
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService { 
  private firestore = inject(Firestore);

  // --- 1. FUNCIONES DEL ALUMNO (Carpetas Privadas) ---

  // AHORA: Recibe un objeto tipado, no cualquier cosa ('any')
  agregarEvento(uid: string, evento: EventoEstudiantil) {
    const ruta = `users/${uid}/eventos`; 
    const eventosRef = collection(this.firestore, ruta);
    return addDoc(eventosRef, evento);
  }

  // AHORA: Retorna un Observable de EventoEstudiantil[]
  // Aquí se aplica el PATRÓN OBSERVER con tipos fuertes.
  obtenerEventos(uid: string): Observable<EventoEstudiantil[]> {
    const ruta = `users/${uid}/eventos`;
    const eventosRef = collection(this.firestore, ruta);
    
    const q = query(eventosRef, orderBy('fecha', 'asc')); 
    
    // El 'as' fuerza a TypeScript a tratar los datos con tu interfaz
    return collectionData(q, { idField: 'id' }) as Observable<EventoEstudiantil[]>;
  }

  eliminarEvento(uid: string, idEvento: string) {
    const ruta = `users/${uid}/eventos/${idEvento}`;
    const docRef = doc(this.firestore, ruta);
    return deleteDoc(docRef);
  }
  
  actualizarEstado(uid: string, idEvento: string, nuevoEstado: string) {
    const ruta = `users/${uid}/eventos/${idEvento}`;
    const docRef = doc(this.firestore, ruta);
    return updateDoc(docRef, { estado: nuevoEstado });
  }

  // --- 2. FUNCIONES DEL ADMIN ---

  // También tipamos la respuesta del Admin
  obtenerTodosLosEventosAdmin(): Observable<EventoEstudiantil[]> {
    const eventosRef = collectionGroup(this.firestore, 'eventos');
    const q = query(eventosRef, orderBy('creadoEn', 'desc'));
    
    return collectionData(q, { idField: 'id' }) as Observable<EventoEstudiantil[]>;
  }
}