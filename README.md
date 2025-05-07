Juan David Rodriguez 

Esteban Aguilera 



# Sistema de Reservas de Laboratorios

Este proyecto permite la gestión de reservas de laboratorios en una institución académica. Los usuarios pueden registrarse, iniciar sesión, consultar la disponibilidad de laboratorios y realizar reservas.

## Requisitos
- Node.js 18+
- NPM 9+
- Java 17
- Maven
- Spring Boot
- MongoDB Cloud

## Tecnologías Usadas
### Frontend
- HTML, CSS, JavaScript
- Framework: React
- Estado global: Context API
- Estilos: Tailwind CSS

### Backend
- Lenguaje: Java
- Framework: Spring Boot
- Base de datos: MongoDB Cloud
- Autenticación: JWT
- Pruebas: JUnit, Jacoco, SonarQube
- Contenedores: Docker

## Funcionalidades

### Crear Usuario
Los usuarios pueden registrarse en la plataforma proporcionando sus datos.
![image](https://github.com/user-attachments/assets/9fb1d8b9-10b2-479e-b209-849b83a350b6)

## Roles de Usuario
- **Usuario:** Puede consultar la disponibilidad de laboratorios y realizar reservas.  
- **Administrador:** Además de las funciones del usuario, puede generar nuevos laboratorios en el sistema.


### Ingresar
Autenticación segura con JWT para acceder a la plataforma.

![image](https://github.com/user-attachments/assets/2d5a3c72-86ba-438d-acca-e31cfb10656d)


### Consultar Laboratorios
Visualización de laboratorios disponibles y horarios.

![image](https://github.com/user-attachments/assets/25d65060-6ee6-4070-a309-c1e7b9ca5e30)

### Reservar Laboratorio
Los usuarios pueden realizar reservas de laboratorios con prioridad según disponibilidad.
![image](https://github.com/user-attachments/assets/cc70191c-3b07-4cda-b52b-793d265f6825)



### Ingreso Admin
Los administradores tienen su propio usuario

![image](https://github.com/user-attachments/assets/e190583e-f5af-487e-aa6d-2136751654be)


### Interfaz admin (Solo Administrador)
Los administradores pueden crear nuevos laboratorios en la plataforma.

![image](https://github.com/user-attachments/assets/9369275d-5d39-407b-81ad-b2e527229971)

### Consultar Laboratorios (Solo Administrador)
Visualización de laboratorios disponibles y horarios con su usuario de reserva

![image](https://github.com/user-attachments/assets/0950b7e7-3258-4048-81ac-d74351f595da)


### Generar Laboratorio (Solo Administrador)
Los administradores pueden crear nuevos laboratorios en la plataforma.

![image](https://github.com/user-attachments/assets/439f33d7-659a-4aac-a2fc-a7b10c3369f4)

## Eliminar laboratorio  Solo Administrador)
Los administradores pueden eliminar laboratorios en la plataforma.

![image](https://github.com/user-attachments/assets/f4709cc6-eecd-4654-96eb-e0983ae453f8)