# Introducción a React

Para ver este contenido presiona: Windows: Ctrl + Shift + V, Mac: Cmd + Shift + V

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

## 2. El Return (El Renderizado)

El `return` es la parte más importante de tu componente. Es donde le dices a React qué debe "dibujar" en el navegador.

- **Regla del Padre Único:** Todo lo que devuelvas debe estar envuelto en una sola etiqueta. Si tienes varios elementos sueltos, envuélvelos en un `<Box>`, `<div>` o un Fragment `<> ... </>`.
- **TSX:** Dentro del `return` escribes TSX (parecido al HTML) por eso el componente tiene el formato .tsx. Para meter lógica de JavaScript (como una variable), úsala entre llaves: `{miVariable}`.
- **Lógica arriba, Diseño abajo:** La lógica (cálculos, estados) va antes del `return`; el diseño (etiquetas) va dentro del `return`.

### Ejemplo:

```tsx
export default function MiComponente() {
  // Lógica (Variables, estados, funciones)
  const saludo = "Bienvenido a Pet Track";

  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  // Diseño (Lo que se renderiza en pantalla)
  return (
    <div className="container">
      <h1>{saludo}</h1>
      <button onClick={handleClick}>Añade 1</button>
      <p>{count}</p>
    </div>
  );
}
```

---

## 3. Uso de Librerías (Material UI)

Para no reinventar la rueda y que el diseño sea profesional, usamos librerías externas. Cada una de ellas primero hay que instalarla, con un comando muy sencillo. La lista de las instaladas actualmente está en el archivo `dependencies-project.md`
