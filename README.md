# 🤸 Gim - Sistema de Gestión de Gimnasia

**Gim** es una aplicación web integral diseñada para la gestión de inscripciones, asignación de grupos y control de alumnos para escuelas de gimnasia. Ofrece una interfaz de administración rápida, fluida y con un diseño oscuro premium optimizado para el ámbito deportivo.

---

## 🚀 Tecnologías Utilizadas

El proyecto está construido bajo una arquitectura limpia y desacoplada (Client-Server):

### **Backend**
*   **Node.js**: Entorno de ejecución para el servidor.
*   **Express**: Framework robusto y ligero para la creación de la API REST.

### **Frontend**
*   **W3.CSS**: Framework CSS ágil y responsivo para una interfaz rápida y sin sobrecarga de estilos.
*   **JavaScript (Vanilla)**: Manipulación dinámica del DOM, gestión de estados y peticiones asíncronas (`Fetch API`).
*   **Font Awesome**: Iconografía moderna para la botonera y acciones del panel.

---

## 📁 Estructura del Proyecto

```text
gim-app/
│
├── backend/
│   ├── config/             # Conexión a la Base de Datos (MySQL/MongoDB)
│   ├── controllers/        # Lógica de negocio (alumnController, teacherController)
│   ├── routes/             # Endpoints de la API (/alumnos, /teachers)
│   ├── models/             # Modelos de datos y queries
│   └── server.js           # Archivo central de inicio de Express
│
└── frontend/
    ├── css/
    │   └── custom.css      # Estilos personalizados oscuros del club
    ├── js/
    │   ├── api.js          # Servicio centralizado de peticiones HTTP
    │   └── main.js         # Controladores de la interfaz, eventos y tablas
    └── index.html          # Panel de administración (Dashboard) principal


