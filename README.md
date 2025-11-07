# 🏥 Asistente Conversacional para Cuidadores Post-Alta (HCFB)

Este repositorio contiene el código fuente y la documentación del prototipo de una aplicación web con un **asistente conversacional (chatbot)**, diseñado para apoyar a los cuidadores informales de pacientes egresados del **Hospital Clínico Félix Bulnes (HCFB)**.

---

## 📑 Tabla de Contenidos

1. [Descripción General](#-descripción-general)  
2. [Arquitectura y Tecnologías](#-arquitectura-y-tecnologías-utilizadas)  
3. [Instalación y Configuración Local](#️-instalación-y-configuración-local)  
4. [Despliegue en Firebase Hosting](#️-despliegue-en-firebase-hosting)  
5. [Guía Operativa para Administradores](#-guía-operativa-breve-para-administradores)  
6. [Guía de Usuario Final](#-guía-de-usuario--asistente-conversacional-para-cuidadores-post-alta-hcfb)

---

## 📝 Descripción General

Esta solución digital, basada en **inteligencia artificial**, tiene como propósito principal proporcionar información clara, validada y oportuna para resolver dudas frecuentes durante el cuidado post-alta en el hogar.  

El objetivo es **reducir reingresos hospitalarios evitables** y **optimizar el uso de camas hospitalarias**, alineándose con la planificación estratégica 2024-2027 del hospital.

La aplicación integra un **chatbot** conectado a una base de conocimiento validada por personal de salud y utiliza la **API de Gemini (Google AI)** para ofrecer respuestas en lenguaje natural.

---

## 💻 Arquitectura y Tecnologías Utilizadas

La solución se fundamenta en una arquitectura de **tres capas**:

- **Frontend:** React.js + Vite → interfaz de usuario rápida y moderna.  
- **Backend & Infraestructura:** Firebase (Google):
  - Authentication → gestión de usuarios y roles (cuidador, administrador).  
  - Firestore → base de datos NoSQL para almacenar conocimiento y encuestas.  
  - Hosting → despliegue y alojamiento de la aplicación web.  
- **Inteligencia Artificial:** API de Gemini (Google AI) para el procesamiento de lenguaje natural.  

---

## ⚙️ Instalación y Configuración Local

### 1. Prerrequisitos

- Node.js (v18 o superior)  
- npm o yarn  
- Una cuenta de Google con proyecto en Firebase  

### 2. Clonar el Repositorio

```bash
git clone https://github.com/a-hognose-snake/cuidabot-react-firebase.git
cd cuidabot-react-firebase
```

### 3. Configurar Firebase

1. Ve a la [Consola de Firebase](https://console.firebase.google.com).  
2. Crea un nuevo proyecto.  
3. Activa los servicios: Authentication, Firestore Database y Hosting.  
4. Crea una aplicación web dentro del proyecto.  
5. Copia las credenciales (`firebaseConfig`).  

### 4. Configurar Variables de Entorno

Crear archivo `.env` en la raíz:

```env
# Firebase
VITE_FIREBASE_API_KEY="TU_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="TU_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="TU_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="TU_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="TU_SENDER_ID"
VITE_FIREBASE_APP_ID="TU_APP_ID"

# Gemini
VITE_GEMINI_API_KEY="TU_GEMINI_API_KEY"
```

### 5. Instalar Dependencias y Ejecutar

```bash
npm install
npm run dev
```

Accede en [http://localhost:5173](http://localhost:5173).

---

## ☁️ Despliegue en Firebase Hosting

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Iniciar Sesión y Configurar Proyecto

```bash
firebase login
firebase init
```

- Selecciona **Hosting: Configure files for Firebase Hosting**  
- Usa el proyecto creado en la consola  
- Directorio público: `dist`  
- Configúralo como **SPA (single-page app)**  

### 3. Compilar y Desplegar

```bash
npm run build
firebase deploy
```

La CLI entregará la **URL pública** de la aplicación.

---

## 📚 Guía Operativa Breve para Administradores

Guía para el personal hospitalario encargado de gestionar contenidos y métricas.

### 🔑 Acceso al Panel
<img width="1917" height="987" alt="image" src="https://github.com/user-attachments/assets/a6a3e9bc-fb3d-48e3-a446-8eb68fd94f10" />
<img width="1915" height="991" alt="image" src="https://github.com/user-attachments/assets/e2fcd9af-017c-4303-81ab-50397ebf6312" />

- Se ingresa con una cuenta con **rol de Administrador**.  
- El sistema redirige al **panel administrativo** tras iniciar sesión.  

### ✍️ Gestión de Contenidos

- **Base de Conocimiento:**
  <img width="1918" height="992" alt="image" src="https://github.com/user-attachments/assets/71620f6d-b21a-4235-a592-f772dbc5220e" />
  
  - Editar: texto existente → *Editar (✏️)* → Guardar Cambios.  
- **Preguntas Frecuentes (FAQ):**
  <img width="1915" height="985" alt="image" src="https://github.com/user-attachments/assets/1040093f-d903-499d-9fcb-5d1cbcaafab1" />

  - Crear o editar preguntas/respuestas.  
  - Visibles directamente para cuidadores.
- **Ver Encuestas:**
  <img width="1913" height="992" alt="image" src="https://github.com/user-attachments/assets/7fe595b3-63b8-4ad3-af50-435ceefa3361" />

   
- **Administrar Usuarios:**
  <img width="1913" height="983" alt="image" src="https://github.com/user-attachments/assets/7c47c1a7-95fa-4012-a60b-945a9daa184f" />


### 📊 Métricas y Encuestas

En el **Dashboard** se muestran:

- Nivel de satisfacción (escala 1–7).  
- Claridad percibida.  

Esto permite identificar mejoras y agregar contenidos más útiles.

---

## 📖 Guía de Usuario – Asistente Conversacional para Cuidadores Post-Alta (HCFB)

Guía dirigida a los **cuidadores** que usan la aplicación.

### 🚪 Acceso

<img width="1917" height="987" alt="image" src="https://github.com/user-attachments/assets/a6a3e9bc-fb3d-48e3-a446-8eb68fd94f10" />
<img width="1916" height="990" alt="image" src="https://github.com/user-attachments/assets/001ebe3c-5f54-4312-866c-c4c057f6c4ae" />

1. Ingresa al enlace entregado por el hospital (ej: `https://test-cuidabot-v2.web.app/login`).  
2. Si es tu primera vez:
   - Regístrate con correo (puede ser dummy) y contraseña.  
3. Si ya tienes cuenta, inicia sesión normalmente.  

### 🤖 Uso del Chatbot

<img width="1918" height="993" alt="image" src="https://github.com/user-attachments/assets/17826d62-1c34-4e87-ad21-c878a98d8c58" />

1. Haz clic en el **ícono del asistente** (esquina inferior derecha).  
2. Escribe tu pregunta (ej: *¿Cómo puedo proteger mi espalda durante una movilización o traspaso?*).  
3. Recibirás una respuesta validada.  


💡 Consejo: usa preguntas claras y directas.

### 📚 Contenidos de Apoyo
  
<img width="1916" height="990" alt="image" src="https://github.com/user-attachments/assets/a96bf5c2-41df-438a-a81d-f3b97f9dc7ca" />

- **FAQ:** respuestas rápidas a dudas comunes.


### 📝 Encuesta de Satisfacción

<img width="1915" height="987" alt="image" src="https://github.com/user-attachments/assets/9436cd02-bac5-4d3b-8687-4530125c6fbb" />

Breve formulario para evaluar:  
- Claridad de la información.  
- Nivel de satisfacción general.  


### ⚠️ Emergencias

El asistente **no reemplaza atención médica**.  
Si hay síntomas graves, acude a urgencias.  

### 🔒 Seguridad y Privacidad

- Datos protegidos en Firebase.  
- Solo personal autorizado accede a métricas generales.  
- Nunca compartas tu contraseña.  

---

