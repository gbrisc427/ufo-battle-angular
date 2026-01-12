# 🛸 WD Second Practical Task - UFO Battle

Este proyecto consiste en la migración y mejora de un videojuego clásico de naves ("UFO Battle"). Se ha transformado una implementación básica en JavaScript a una **Single Page Application (SPA)** robusta utilizando **Angular** para el frontend y **Node.js/Express** para el backend, con persistencia de datos en **MySQL**.

## 📋 Descripción

El objetivo de la práctica es conectar la lógica del juego con una API RESTful para gestionar:
* **Autenticación:** Registro y Login de usuarios.
* **Puntuaciones:** Guardado y visualización de récords (High Scores) obtenidos desde la base de datos `marsbd`.
* **Juego:** Implementación visual en Angular.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** Angular (TypeScript, HTML5, CSS3).
* **Backend:** Node.js, Express.
* **Base de Datos:** MySQL.
* **Librerías Clave:** `mysql` (conector), `cors`, `body-parser`.

## ⚙️ Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de ejecutar el proyecto:
* [Node.js](https://nodejs.org/)
* [Angular CLI](https://angular.io/cli) (`npm install -g @angular/cli`)
* Servidor MySQL (ej. XAMPP, WAMP o MySQL Workbench).

---

## 🚀 Instrucciones de Instalación y Ejecución

Sigue estos pasos en orden para levantar el entorno completo.

### 1. Backend (Servidor Node.js)
Navega a la carpeta del servidor e instala las dependencias:

```bash
cd server
npm install
node scoreserver.js
```
Deberías ver un mensaje indicando que el servidor está escuchando en el puerto 8080.

### 2. Frontend (Angular)

Abre una nueva terminal, navega a la raíz del proyecto (donde está el package.json de Angular) y ejecuta:

```bash
npm install
ng serve -o
```
La aplicación se abrirá automáticamente en http://localhost:4200/.

### 📂 Estructura del Proyecto

    /server: Contiene el código del backend (scoreserver.js) y la lógica de conexión a la BD.

    /src/app: Componentes de Angular, servicios (api.service.ts) y modelos.

    /assets: Recursos estáticos (imágenes de las naves, fondos, etc.).

### ✅ Funcionalidades Implementadas

    [x] Conexión Cliente-Servidor.

    [x] Login y Registro de usuarios contra MySQL.

    [x] Envío de puntuaciones al finalizar la partida.

    [x] Visualización de tabla de Récords.

    [x] Lógica del juego en Angular.

Autor: Gabriel Serrano Asignatura: Web Development
