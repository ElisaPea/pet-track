# 🐾 Guía Rápida: Crear SCREENS y Components

Para ver este contenido presiona: Windows: Ctrl + Shift + V, Mac: Cmd + Shift + V

Para levantar el proyecto (o sea verlo en la web, aunque se en local), tenéis que abrir la terminal (la del mismo IDE es perfecta) y escribir `npm run dev`. Os saldrá un enlace, por ejemplo: `http://localhost:5173/`. Haced clic en él y podréis ver el proyecto en vuestro navegador.

## Crear una screen

- **1**: Añade la constante dentro del fichero `src\constants\constants.ts` con el nombre de la nueva screen,
  y con el mismo estilo que las existentes. Esto lo hacemos porque siempre es mejor tener centralizada la
  información, porque si un día queremos cambiar una url solo se cambia en un sitio. Por ejemplo:

```tsx
export const SCREEN = {
  HOME: "/",
  LOGIN: "/login",

  NEW_SCREEN: "/new-screen",
};
```

- **2**: Crea la screen dentro del fichero `src\pages\`, que sea un. nuevo file y que se llame como la nueva
  screen. Por ejemplo: `NewScreen.tsx`

- **3**: Genera un contenido basico para la nueva screen para que no se quede vacía, como este (puedes copiar este
  y cambiarle en nombre para el que toca):

```tsx
import { Box } from "@mui/material";

export default function NewScreen() {
  return (
    <Box>
      <h1>New Screen</h1>
    </Box>
  );
}
```

- **4**: Añade la ruta para la nueva screen dentro del fichero `src\App.tsx` (cuando lo hagas, se pondrá rojo y te dará un error, porque no estará importada. Simplemente coloca el focus del ratón al final de la nueva etiqueta y presiona Ctrl + Barra espaciadora para que el IDE te sugiera el import):

```tsx
export default function NewScreen() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={SCREEN.HOME} element={<Home />} />
        <Route path={SCREEN.LOGIN} element={<Login />} />

        <Route path={SCREEN.NEW_SCREEN} element={<NewScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- **5**: Felicidades! Has creado tu primera Screen. Ahora solo con añadir la ruta en el navegador podrás verla.
  Ejemplo: localhost:5173/new-screen. Ya le añadiremos el useNavigate para navegar de manera dinamica a ella. Ahora toca a los estilos, mira Screen que ya estén hechas, copia lo que puedas y crea el código que veas neceario para replicar esa screen mirando a Figma.

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

## Crear un Componente

Al generar Screens, os daréis cuenta de que hay muchas cosas que se repiten, por ejemplo, el header, el footer, los botones, los inputs, etc. Por eso, vamos a crear componentes para que no se repita el código. Por ejemplo, si queremos cambiar el color de todos los botones, solo tendremos que cambiarlo en un sitio. Antes de crear uno, siempre está bien comprobar que no exista ya algo que se pueda reutilizar, como por ejemplo ahora ya exista un NavBar y no hace falta crear otro.

Si lo que necesitas no existe (por ejemplo, el footer) entonces hay que seguir estos pasos:

- **1**: Crea el fichero del componente dentro de `src\components\` llamando el fichero como el componente que vas a a crear (por ejemplo, `Footer.tsx`).

- **2**: Genera un contenido basico para el nuevo componente, es igualito que una screen:

```tsx
export default function Footer() {
  return (
    <Box>
      <h1>Footer</h1>
    </Box>
  );
}
```

- **3**: Ahora puedes llamar a tu nuevo componente desde donde quieras en el código como so fuera una mnueva etiqueta HTML, por ejemplo dentro de tu nueva screen NewScreen:

```tsx
import { Box } from "@mui/material";

export default function NewScreen() {
  return (
    <Box>
      <h1>New Screen</h1>
      <Footer></Footer>
    </Box>
  );
}
```

-- **4**: Faltará que el contenido del componente tengas sus estilos coherentes.

## Tips importantes

-- **1**: Los componentes los puedes usar tanto en Screen como en otros componentes, como por ejemplo imagina que creamos un componente llamado Button porque queremos que todos los botones de nuestro proyecto sean casi iguales, definimos los estilos en componente llamado CustomButton.tsx y ese componente lo podemos llamar dentro de la Screen Login o también dentro del mismo componente NavBar.

-- **2**: Todos los componentes/Screens tienen la capacidad de enviar y recibir información. Esto es importante, y un ejemplo muy concreto, usando el mismo ejemplo de CustomButton.tsx, si queremos que el botón tenga un color diferente, por ejemplo rojo, tendremos que pasarle una propiedad (props) al componente, por ejemplo: <CustomButton color="red" />. Y dentro del componente CustomButton.tsx tendremos que recibir esa propiedad y usarla en el estilo del botón. Esto os haré una demo en una próxima clase, solo es para que lo tengáis en cuenta.

-- **3**: Las etiquetas HTML, como sabéis, tienen que tener una etiqueta de cierre, por ejemplo: <div></div>. Pero en React, si no tiene contenido, podemos ponerlo de la siguiente manera: <div />. Esto es porque React entiende que si no tiene contenido, no necesita etiqueta de cierre. Por lo tanto, si veis que un componente no tiene contenido, podéis ponerlo de la siguiente manera: <Component />.
