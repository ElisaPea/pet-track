# 🐾 Dependencias Instaladas - Pet Track

Para ver este contenido presiona: Windows: Ctrl + Shift + V, Mac: Cmd + Shift + V

Este proyecto utiliza un conjunto de librerías modernas para gestionar la navegación, el diseño visual y la experiencia de usuario. A continuación, el detalle de cada una:

---

## 📍 Navegación y Rutas

### `react-router-dom`

Es la librería estándar para gestionar la navegación en aplicaciones de React.

- **¿Para qué sirve?** Permite crear una **SPA (Single Page Application)**. Gracias a esto, puedes navegar entre la Home y el Login sin que la página se recargue por completo en el navegador.
- **Comandos de instalación:**
  ```bash
  npm i react-router-dom
  npm install --save-dev @types/react-router-dom
  ```
  _(Instalamos los `@types` para que TypeScript nos ayude con el autocompletado y evite errores de tipado)._

---

## 🎨 Interfaz y Estilos (Material UI)

Para el diseño utilizamos **MUI**, la librería de componentes más popular de React basada en las guías de Material Design de Google.

### 1. `@mui/material`

Es el núcleo (core) de la interfaz.

- **¿Para qué sirve?** Proporciona los componentes pre-diseñados como `<Button />`, `<TextField />`, `<Box />` y `<Grid />`. Es la base de todo lo que vemos en pantalla.
- **Comando:** `npm i @mui/material`

### 2. `@emotion/react` & `@emotion/styled`

Son los motores de estilo (CSS-in-JS).

- **¿Para qué sirve?** Material UI utiliza estas librerías para calcular y aplicar los estilos de los componentes de forma dinámica. Son imprescindibles para que MUI funcione correctamente y para poder usar la prop `sx`.
- **Comando:** `npm install @emotion/react @emotion/styled`

### 3. `@mui/icons-material`

El paquete oficial de iconos.

- **¿Para qué sirve?** Nos permite importar iconos como si fueran componentes de React (ej: `<PetsIcon />`, `<InstagramIcon />`). Es mucho más ligero y rápido que usar imágenes externas.
- **Comando:** `npm i @mui/icons-material`

---
