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

export interface EventoEstudiantil {
  id?: string;        
  materia: string;
  tipo: string | string[]; 
  fecha: string;
  hora: string;
  nota: number;
  estado: string;      
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

  agregarEvento(uid: string, evento: EventoEstudiantil) {
    const ruta = `users/${uid}/eventos`; 
    const eventosRef = collection(this.firestore, ruta);
    return addDoc(eventosRef, evento);
  }

  obtenerEventos(uid: string): Observable<EventoEstudiantil[]> {
    const ruta = `users/${uid}/eventos`;
    const eventosRef = collection(this.firestore, ruta);
    const q = query(eventosRef, orderBy('fecha', 'asc')); 
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


  obtenerTodosLosEventosAdmin(): Observable<EventoEstudiantil[]> {
    const eventosRef = collectionGroup(this.firestore, 'eventos');
    const q = query(eventosRef, orderBy('creadoEn', 'desc'));
    
    return collectionData(q, { idField: 'id' }) as Observable<EventoEstudiantil[]>;
  }
}
