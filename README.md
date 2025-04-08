# WhatsApp Templates

## Descripción del Proyecto
Este proyecto implementa una aplicación de gestión de plantillas para WhatsApp, permitiendo visualizar las plantillas en diferentes formatos (grilla o lista).

## Documentación Técnica

### Clase Template

La clase `Template` es un componente fundamental que encapsula toda la lógica relacionada con las plantillas de mensajes de WhatsApp, proporcionando una implementación orientada a objetos para su gestión y visualización.

#### Propiedades

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `title` | String | Título de la plantilla |
| `message` | String | Contenido del mensaje de la plantilla |
| `hashTag` | String | Etiquetas o hashtags asociados a la plantilla |
| `link` | String | Enlace asociado a la plantilla |
| `date` | String | Fecha relacionada con la plantilla |

#### Métodos

##### `constructor(title, message, hashTag, link, date)`

Crea una nueva instancia de la clase Template con los valores proporcionados para cada propiedad.

**Parámetros:**
- `title` (String): Título de la plantilla
- `message` (String): Contenido del mensaje
- `hashTag` (String): Etiquetas o hashtags asociados
- `link` (String): Enlace relacionado
- `date` (String): Fecha asociada

##### `saveTemplate()`

Guarda la instancia actual de la plantilla en el array global `templates`. Este método se utiliza para registrar la plantilla en la aplicación y permitir su posterior renderización.

**Retorno:** No retorna valor (void)

##### `render(viewMode = 'grid')`

Renderiza la plantilla en el DOM dentro del contenedor de plantillas. Este método es responsable de crear y estructurar los elementos HTML necesarios para visualizar la plantilla según el modo de vista especificado.

**Parámetros:**
- `viewMode` (String, opcional): Modo de visualización ('grid' o 'list'). El valor por defecto es 'grid'.

**Comportamiento:**
- En modo **grilla** (`grid`): Las plantillas se muestran en un formato de tarjeta vertical con todos los elementos apilados.
- En modo **lista** (`list`): Las plantillas se muestran en un formato horizontal optimizado para visualización tipo lista, con una distribución de elementos reorganizada para aprovechar mejor el espacio horizontal.

**Funcionalidades:**
- Ajusta las clases CSS y estructura del DOM según el modo de visualización
- Aplica estilos responsive para adaptarse a diferentes tamaños de pantalla
- Implementa efectos visuales como sombras y transiciones para mejorar la experiencia de usuario
- Organiza los elementos de manera óptima según cada modo de visualización

**Retorno:** Retorna el elemento `li` creado para la plantilla

## Estado de la Aplicación

El sistema mantiene un estado global a través del objeto `appState` en `app.js`, que incluye:

- `viewMode`: Modo actual de visualización ('grid' o 'list')

Este estado se utiliza para determinar cómo renderizar las plantillas y qué estilos aplicar a los botones de cambio de vista.