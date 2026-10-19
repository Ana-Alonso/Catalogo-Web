# Laurel en Lienzo - Catálogo Visual

Un catálogo visual frontend moderno, minimalista y accesible desarrollado para mostrar obras de arte, ilustraciones y joyería. La aplicación está diseñada para funcionar como un portafolio interactivo, redirigiendo el proceso de compra a plataformas externas como [Etsy](https://www.etsy.com/es/shop/Laurelenlienzo) o Vinted.

## 🚀 Características Principales

*   **Diseño Minimalista y Moderno:** Interfaz limpia utilizando una paleta de colores basada en negro, blanco, escala de grises y acentos vibrantes en color naranja.
*   **Animaciones Dinámicas:** Transiciones fluidas, aparición de elementos al hacer scroll y efectos hover interactivos impulsados por Framer Motion.
*   **Totalmente Responsivo:** La cuadrícula de la galería y la navegación se adaptan perfectamente a dispositivos móviles, tablets y monitores de escritorio.
*   **Accesibilidad (WCAG):** Navegación optimizada para teclado, alto contraste, semántica HTML5 adecuada y atributos ARIA para lectores de pantalla.
*   **Redirección de Ventas:** Cada obra en el catálogo incluye enlaces directos para adquirir la pieza en tiendas externas (Etsy).

## 🛠️ Tecnologías Utilizadas

*   **[React](https://reactjs.org/)** (v18+) - Biblioteca principal para la construcción de la interfaz de usuario.
*   **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático para un código más robusto y mantenible.
*   **[Tailwind CSS](https://tailwindcss.com/)** - Framework de utilidades CSS para un diseño ágil y adaptable.
*   **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca de animaciones de grado de producción para React.
*   **[Lucide React](https://lucide.dev/)** - Paquete de iconos minimalistas y consistentes.
*   **[Vite](https://vitejs.dev/)** - Entorno de desarrollo rápido y empaquetador moderno.

## 📦 Instalación y Configuración Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/laurel-en-lienzo.git](https://github.com/tu-usuario/laurel-en-lienzo.git)
    cd laurel-en-lienzo
    ```

2.  **Instalar las dependencias:**
    Asegúrate de tener [Node.js](https://nodejs.org/) instalado. Luego ejecuta:
    ```bash
    npm install
    # o si usas yarn
    yarn install
    ```

3.  **Iniciar el servidor de desarrollo:**
    ```bash
    npm run dev
    # o si usas yarn
    yarn dev
    ```

4.  **Abrir en el navegador:**
    Visita `http://localhost:5173` (o el puerto que indique tu terminal) para ver la aplicación en vivo.

## 🎨 Personalización del Catálogo

Para añadir, modificar o eliminar obras del catálogo, debes editar el array de datos dentro del código (usualmente ubicado en `src/data/obras.ts` o dentro del componente principal si es un archivo único). 

El formato de cada objeto de obra es el siguiente:

```typescript
{
  id: "identificador-unico",
  title: "Título de la Obra",
  category: "Categoría (ej. Ilustraciones, Custom)",
  image: "/ruta/a/tu/imagen.jpg",
  etsyLink: "[https://www.etsy.com/es/listing/](https://www.etsy.com/es/listing/)...",
  price: "Precio (opcional)"
}

```

## 📄 Licencia

Este proyecto es de uso exclusivo para **Laurel en Lienzo**. Todos los derechos de las imágenes e ilustraciones pertenecen a su respectivo autor.