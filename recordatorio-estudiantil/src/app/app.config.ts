import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDSr5-Q1JLJu1eZv_QOijr6PYY1E6RmjXc",
  authDomain: "recordatorioestudiantil.firebaseapp.com",
  projectId: "recordatorioestudiantil",
  storageBucket: "recordatorioestudiantil.firebasestorage.app",
  messagingSenderId: "925121140468",
  appId: "1:925121140468:web:b4ae8518b918d63381b0a1"
};


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
