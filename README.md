# 🤸 Gim - Sistema de Gestión de Escuela de Gimnasia

**Gim** es una aplicación web integral diseñada para la gestión de inscripciones, asignación de grupos y control de alumnos para escuelas de gimnasia. Ofrece una interfaz de administración rápida, fluida y con un diseño personalizado.

---

## 🚀 Tecnologías Utilizadas

### **Backend**
*   **Node.js**: Entorno de ejecución para el servidor.
*   **Express**: Framework robusto y ligero para la creación de la API REST.
*   **MySQL/MariaDB**: Base de datos

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
│   ├── config/             # Conexión y configuracion de Base de Datos (MySQL/MongoDB)
│   ├── controllers/        # Lógica de negocio (alumnController, teacherController)
│   ├── routes/             # Endpoints de la API (/alumnos, /teachers)
│   ├── repositories/       # Modelos de datos y queries
│   └── server.js           # Archivo central de inicio de Express
|   ├── middleware/         # Autenticacion
│   
│
└── frontend/
    ├── css/
    │   └── custom.css      # Estilos personalizados oscuros del club
    ├── js/
    │   ├── services/          # Servicio centralizado de peticiones HTTP
    │   └── frontControllers/  # Controladores de la interfaz, eventos y tablas
    └── html/         # Paneles de administracion


