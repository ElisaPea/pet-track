# 🐾 Guía Rápida: React + Material UI (Pet Track)

## 1. ¿Qué es un Componente?

En React, un componente es una **función de JavaScript** que devuelve la estructura de la interfaz. La idea es dividir la web en piezas pequeñas y reutilizables.

### Estructura básica:

```tsx
// 1. Imports (Librerías y componentes)
import { Button } from "@mui/material";

// 2. Definición de la función
export default function MiComponente() {
  // 3. Lógica (Variables, estados, funciones)
  const saludo = "Bienvenido a Pet Track";

  // 4. Return (Lo que se renderiza en pantalla)
  return (
    <div className="container">
      <h1>{saludo}</h1>
      <Button variant="contained">Click aquí</Button>
    </div>
  );
}
```

# 📘 Documentación: React & Pet Track

## 🔄 El Return (El Renderizado)

El `return` es la parte más importante de tu componente. Es donde le dices a React qué debe "dibujar" en el navegador.

- **Regla del Padre Único:** Todo lo que devuelvas debe estar envuelto en una sola etiqueta. Si tienes varios elementos sueltos, envuélvelos en un `<Box>`, `<div>` o un Fragment `<> ... </>`.
- **JSX:** Dentro del `return` escribes JSX (parecido al HTML). Para meter lógica de JavaScript (como una variable), úsala entre llaves: `{miVariable}`.
- **Lógica arriba, Diseño abajo:** La lógica (cálculos, estados) va antes del `return`; el diseño (etiquetas) va dentro del `return`.

---

## 📚 Uso de Librerías (Material UI)

Para no reinventar la rueda y que el diseño sea profesional, usamos librerías externas.

### 1. Instalación

Antes de usar nada, el paquete debe estar en tu carpeta `node_modules`:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```
