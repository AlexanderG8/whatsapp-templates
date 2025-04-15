# WhatsApp Templates

## Descripción del Proyecto

Este proyecto implementa una aplicación de gestión de plantillas para WhatsApp, permitiendo visualizar las plantillas en diferentes formatos (grilla o lista).

## Documentación Técnica

### Implementación del Patrón Store

Este proyecto implementa un patrón Store para la gestión del estado de la aplicación, inspirado en los principios de Redux pero con una implementación simplificada. El objetivo es centralizar la gestión del estado y mantener un flujo de datos unidireccional y predecible.

#### Estructura del Patrón Store

```javascript
function createStore(initialState = []){
    // Estado interno, encapsulado y privado
    let state = initialState;

    // Array de funciones que se ejecutarán cuando el estado cambie
    const listeners = [];

    // CRUD operations para el estado
    function getState(){
        return state;
    }

    function setState(newState){
        state = newState;
        // Notificar a todos los suscriptores
        listeners.forEach(function (listener) {
            listener(state);
        });
    }

    function addTemplate(newTemplate){
        // Mantener inmutabilidad creando una copia del estado
        const newState = [...state, newTemplate];
        setState(newState);
    }

    function removeTemplate(index) {
        // Crear una copia del array filtrando la plantilla a eliminar
        const newState = state.filter((_, i) => i !== index);
        setState(newState);
    }

    // Sistema de suscripción para reaccionar a cambios
    function suscribe(listener){
        listeners.push(listener);
        // Función para cancelar la suscripción
        return () => {
            const index = listeners.indexOf(listener);
            if(index > -1){
                listeners.splice(index, 1)
            }
        }
    }

    // Método para inicializar el store con datos
    function initializeStore(){
        const newTemplate = [
            // Plantillas iniciales
        ];
        setState(newTemplate);
    }

    // API pública del store
    return {
        getState,
        setState,
        addTemplate,
        removeTemplate,
        initializeStore,
        suscribe
    }
}

// Creación e inicialización del store
const templateStore = createStore([]);
window.templateStore = templateStore; // Accesible desde cualquier parte
```

#### Principios y Características

1. **Estado Centralizado**: Todo el estado de la aplicación se mantiene en un único objeto `state` dentro del store.

2. **Inmutabilidad del Estado**: Para mantener la integridad y trazabilidad de los cambios, nunca se modifica directamente el estado:
   - Para añadir plantillas, se crea un nuevo array usando el spread operator `[...state, newTemplate]`
   - Para eliminar plantillas, se utiliza `filter()` que devuelve un nuevo array sin mutar el original
   - Todas las operaciones que modifican el estado utilizan `setState()` que reemplaza completamente el estado anterior

3. **Sistema de Suscripción**: Componentes pueden suscribirse a cambios en el estado mediante `suscribe(listener)`, lo que permite actualizaciones automáticas de la UI cuando el estado cambia.

4. **Flujo de Datos Unidireccional**: Los cambios en la UI no modifican directamente el estado, sino que llaman a funciones del store (`addTemplate`, `removeTemplate`) que se encargan de crear un nuevo estado.

5. **API Pública Clara**: El store expone una API bien definida para interactuar con el estado, ocultando los detalles de implementación.

#### Beneficios de la Inmutabilidad

La inmutabilidad implementada en este patrón Store proporciona varios beneficios:

- **Prevención de Efectos Secundarios**: Al no modificar el estado original, se evitan cambios inesperados
- **Rastreo de Cambios**: Facilita el seguimiento de cómo y cuándo cambia el estado
- **Rendimiento Optimizado**: Permite comparaciones rápidas entre estados (comparación por referencia)
- **Facilita Testing**: Hace que las pruebas sean más predecibles al trabajar con estados inmutables
- **Compatibilidad con Herramientas de Desarrollo**: Permite implementar funcionalidades como time-travel debugging

### Sincronización y Persistencia de Datos

La aplicación implementa un sistema de persistencia que permite guardar automáticamente las plantillas en el navegador del usuario, haciendo que estén disponibles incluso después de cerrar y volver a abrir la aplicación.

#### Funcionamiento de la Persistencia

```javascript
/**
 * Función que guarda las plantillas en el localStorage
 */
function saveTemplates() {
  localStorage.setItem(
    "templates",
    JSON.stringify(window.templateStore.getState())
  );
}

/**
 * Función que limpia las plantillas del localStorage
 */
function clearTemplatesStorage() {
  localStorage.removeItem("templates");
}
```

#### Características Principales

1. **Almacenamiento Local**: Se utiliza el API `localStorage` del navegador para guardar las plantillas directamente en el dispositivo del usuario.

2. **Sincronización Automática**: Mediante el sistema de suscripción del Store, cada vez que cambia el estado, las plantillas se guardan automáticamente:

   ```javascript
   // Suscribir la función saveTemplates al store
   window.templateStore.suscribe(saveTemplates);
   ```

3. **Restauración al Iniciar**: Cuando la aplicación se carga, verifica si existen plantillas guardadas y las restaura:

   ```javascript
   // Al iniciar la aplicación
   document.addEventListener("DOMContentLoaded", function() {
     // Cargar plantillas guardadas si existen
     const savedTemplates = localStorage.getItem("templates");
     if (savedTemplates) {
       window.templateStore.setState(JSON.parse(savedTemplates));
     }
   });
   ```

4. **Limpieza de Datos**: Al utilizar la función "Eliminar Todo", se limpian tanto las plantillas del Store como del almacenamiento local.

5. **Ventajas**:
   - No requiere autenticación ni configuración por parte del usuario
   - Funciona sin conexión a internet
   - Es transparente para el usuario, sin necesidad de "guardar" manualmente
   - Mantiene la privacidad del usuario al almacenar los datos localmente

Esta implementación proporciona una experiencia fluida donde las plantillas del usuario persisten entre sesiones sin necesidad de una base de datos externa o un servidor.

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
- `notificationTimeout`: Controla el tiempo de visualización de las notificaciones

Este estado se utiliza para determinar cómo renderizar las plantillas y qué estilos aplicar a los botones de cambio de vista.

## Funcionalidades Implementadas

1. **Vista de Grilla/Lista**: Permite alternar entre visualización de plantillas en formato grilla o lista
2. **Agregar Plantillas**: Permite crear nuevas plantillas con título, mensaje y hashtags
3. **Eliminar Plantillas**: Incluye capacidad para eliminar plantillas individualmente
4. **Estado Vacío**: Muestra un mensaje amigable cuando no hay plantillas
5. **Notificaciones**: Sistema de notificaciones temporales para confirmar acciones
6. **Diseño Responsive**: Se adapta a diferentes tamaños de pantalla
7. **UI Moderna**: Utiliza Tailwind CSS para una interfaz moderna y atractiva
8. **Recuperación de Plantillas**: Permite recuperar la última plantilla eliminada
9. **Persistencia Local**: Guarda las plantillas automáticamente en el navegador

## 🔗[Historias de Usuarios Propuestas](historias-propuestas.md) 
