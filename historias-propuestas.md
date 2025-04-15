# HU1: Búsqueda y Filtrado de Plantillas

- Como usuario, quiero poder buscar y filtrar mis plantillas por título, mensaje o hashtags para encontrar rápidamente la plantilla que necesito cuando tengo muchas guardadas.

Criterios de Aceptación:

- Implementar una barra de búsqueda en la parte superior de la lista de plantillas.
- La búsqueda debe ser en tiempo real, filtrando las plantillas a medida que el usuario escribe.
- Debe buscar coincidencias en título, mensaje y hashtags de las plantillas.
- Mostrar un mensaje claro cuando no hay resultados de búsqueda.
- Mantener la funcionalidad de cambio entre vista de grilla y lista durante la búsqueda.
- La búsqueda debe ser insensible a mayúsculas/minúsculas y acentos.

## Implementación del HU1


### Cambios en el HTML

He agregado:

- Una barra de búsqueda en la parte superior de la lista de plantillas con un ícono de lupa
- Un mensaje para cuando no se encuentran resultados de búsqueda

### Cambios en JavaScript

He implementado:

- Variables para los nuevos elementos del DOM
- Una nueva propiedad searchTerm en el estado de la aplicación
- La función normalizeText() para hacer que la búsqueda sea insensible a acentos y mayúsculas/minúsculas
- Actualización de la función renderTemplates() para filtrar plantillas según el término de búsqueda
- Actualización de checkEmptyState() para manejar el caso cuando no hay resultados de búsqueda
- Un event listener que actualiza el término de búsqueda en tiempo real mientras el usuario escribe.

# HU2: Categorización de Plantillas con Etiquetas Personalizadas

- Como usuario, quiero poder asignar etiquetas personalizadas a mis plantillas y filtrarlas por estas etiquetas para organizar mejor mi colección según diferentes contextos o usos.

Criterios de Aceptación:

- Agregar un campo para etiquetas múltiples en el formulario de creación/edición de plantillas.
- Permitir al usuario crear etiquetas nuevas o seleccionar de las existentes.
- Mostrar las etiquetas asignadas en cada tarjeta de plantilla con un diseño distintivo.
- Implementar un selector de filtro por etiquetas en la barra superior.
- Al seleccionar una etiqueta, mostrar sólo las plantillas que la contienen.
- Permitir la selección múltiple de etiquetas para filtrado combinado (Y/O).
- Mantener la persistencia de las etiquetas junto con las plantillas en localStorage.
- Las etiquetas deben tener un límite de caracteres razonable (máximo 15 caracteres).

## Implementación HU2



### 1. Cambios en el Modelo de Datos (Template.js)
He modificado la clase Template para incluir un array de etiquetas:

```javascript
constructor(title, message, hashTag, link, date, tags = []) {
    this.title = title;
    this.message = message;
    this.hashTag = hashTag;
    this.link = link;
    this.date = date;
    this.tags = tags; // Array de etiquetas personalizadas
}
```

Este cambio permite que cada plantilla guarde sus propias etiquetas como un array, con un valor por defecto de array vacío para mantener la compatibilidad con plantillas creadas anteriormente.

### 2. Cambios en el HTML (index.html)
2.1. Campo de etiquetas en el formulario
Añadí un nuevo campo para ingresar etiquetas en el formulario de creación/edición:

```html
<div class="mb-4">
    <label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
        Etiquetas <span class="text-xs text-gray-500">(separadas por comas, máx. 15 caracteres c/u)</span>
    </label>
    <div class="relative">
        <input type="text" id="tags" name="tags" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" placeholder="ej: trabajo, personal, urgente">
        <div id="tags-suggestions" class="hidden absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-md mt-1 max-h-40 overflow-y-auto">
            <!-- Aquí se mostrarán las sugerencias de etiquetas -->
        </div>
    </div>
    <div id="tags-preview" class="flex flex-wrap gap-2 mt-2">
        <!-- Aquí se mostrarán las etiquetas como chips -->
    </div>
</div>
```

Este bloque incluye:

- Un campo de texto para ingresar etiquetas
- Un contenedor para mostrar sugerencias de etiquetas existentes
- Un área para previsualizar las etiquetas añadidas como "chips"


2.2. Selector de filtro por etiquetas

```html
<div class="relative" id="tags-filter-container">
    <button id="tags-filter-button" class="inline-flex items-center px-4 py-2.5 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-emerald-300">
        <svg xmlns="[http://www.w3.org/2000/svg"](http://www.w3.org/2000/svg") class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Filtrar por etiquetas
        <svg xmlns="[http://www.w3.org/2000/svg"](http://www.w3.org/2000/svg") class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
    </button>
    <div id="tags-filter-dropdown" class="hidden absolute z-10 w-60 bg-white divide-y divide-gray-100 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
        <div class="p-3">
            <h6 class="mb-2 text-sm font-medium text-gray-700">Seleccionar etiquetas</h6>
            <ul id="tags-filter-list" class="space-y-2 max-h-40 overflow-y-auto">
                <!-- Aquí se agregarán las etiquetas dinámicamente -->
            </ul>
            <div class="flex justify-between mt-3 pt-3 border-t border-gray-200">
                <button id="clear-tags-filter" class="text-xs text-gray-700 hover:text-gray-900 font-medium">Limpiar filtros</button>
                <div>
                    <button id="apply-tags-filter" class="text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-2 py-1 rounded font-medium ml-2">Aplicar</button>
                </div>
            </div>
        </div>
    </div>
</div>
```
Este componente incluye:

- Un botón para abrir el menú desplegable de filtros
- Un menú desplegable con lista de etiquetas disponibles (checkboxes)
- Botones para aplicar o limpiar los filtros seleccionados

2.3. Contenedor para etiquetas activas
```html
<div id="active-tags-container" class="flex flex-wrap gap-2 mt-2 hidden">
    <!-- Aquí se mostrarán las etiquetas activas como chips -->
</div>
```
Este contenedor muestra las etiquetas actualmente seleccionadas como filtros.

### 3. Cambios en CSS (style.css)

Añadí estilos para las etiquetas y componentes relacionados:

```css
/* Estilos para etiquetas */
.tag-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    line-height: 1;
    font-weight: 500;
    color: #4b5563;
    background-color: #e5e7eb;
    border-radius: 9999px;
    transition: all 0.2s ease;
}
.tag-chip:hover {
    background-color: #d1d5db;
}
.tag-chip .tag-delete {
    margin-left: 0.25rem;
    width: 0.75rem;
    height: 0.75rem;
    cursor: pointer;
}
.tag-chip.active {
    background-color: #10b981;
    color: white;
}
.tag-chip.active:hover {
    background-color: #059669;
}
.template-tag {
    display: inline-block;
    padding: 0.15rem 0.4rem;
    font-size: 0.7rem;
    font-weight: 500;
    border-radius: 9999px;
    margin-right: 0.25rem;
    margin-bottom: 0.25rem;
    background-color: #e5e7eb;
    color: #4b5563;
    transition: all 0.2s ease;
}
.template-tag:hover {
    background-color: #d1d5db;
    cursor: pointer;
}
.tags-filter-option {
    transition: all 0.2s ease;
}
.tags-filter-option:hover {
    background-color: #f3f4f6;
}
.tags-filter-checkbox {
    margin-right: 0.5rem;
}
```
Estos estilos definen:

- Apariencia de chips de etiquetas (tanto en el formulario como en los filtros)
- Apariencia de etiquetas en las tarjetas de plantillas
- Estilos para los componentes de filtrado
- Efectos hover y transiciones para mejorar la experiencia de usuario

### 4. Cambios en JavaScript (app.js)
   
4.1. Variables DOM
Agregué nuevas variables para referenciar los elementos del DOM relacionados con etiquetas:

```javascript
// Variables para etiquetas
const tagsInput = document.querySelector("#tags");
const tagsPreview = document.querySelector("#tags-preview");
const tagsSuggestions = document.querySelector("#tags-suggestions");
const tagsFilterButton = document.querySelector("#tags-filter-button");
const tagsFilterDropdown = document.querySelector("#tags-filter-dropdown");
const tagsFilterList = document.querySelector("#tags-filter-list");
const applyTagsFilterBtn = document.querySelector("#apply-tags-filter");
const clearTagsFilterBtn = document.querySelector("#clear-tags-filter");
const activeTagsContainer = document.querySelector("#active-tags-container");
```
4.2. Estado de la aplicación
Amplié el objeto appState para incluir propiedades relacionadas con etiquetas:

```javascript
const appState = {
    viewMode: "grid",
    notificationTimeout: null,
    isEditing: false,
    searchTerm: "",
    activeTagsFilter: [], // Etiquetas seleccionadas para filtrar
    allTags: [], // Todas las etiquetas disponibles en el sistema
    currentTags: [] // Etiquetas seleccionadas en el formulario
}
```
4.3. Gestión de etiquetas en modales
Actualicé las funciones de abrir modales para manejar las etiquetas:

```javascript
// En openAddTemplateModal
appState.currentTags = [];
renderTagsPreview();

// En openEditTemplateModal
appState.currentTags = template.tags || [];
renderTagsPreview();
```

4.4. Funciones principales para etiquetas
4.4.1. Actualización de la lista de etiquetas disponibles

```javascript
function updateAllTagsList() {
    const templates = window.templateStore.getState();
    const allTags = new Set();
    
    templates.forEach(template => {
        if (template.tags && Array.isArray(template.tags)) {
            template.tags.forEach(tag => allTags.add(tag));
        }
    });
    
    appState.allTags = [...allTags].sort();
    renderTagsFilterList();
}
```

Esta función recopila todas las etiquetas utilizadas en las plantillas existentes y las almacena en el estado de la aplicación.

4.4.2. Creación de chips de etiquetas
```javascript
function createTagChip(tag, isRemovable = true, isActive = false, onClick = null) {
    const chip = document.createElement('span');
    chip.classList.add('tag-chip');
    if (isActive) chip.classList.add('active');
    
    chip.textContent = tag;
    
    if (isRemovable) {
        const deleteIcon = document.createElement('span');
        deleteIcon.innerHTML = '×';
        deleteIcon.classList.add('tag-delete');
        deleteIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            // Eliminar etiqueta del estado
            const index = appState.currentTags.indexOf(tag);
            if (index > -1) {
                appState.currentTags.splice(index, 1);
                renderTagsPreview();
            }
        });
        chip.appendChild(deleteIcon);
    }
    
    if (onClick) {
        chip.addEventListener('click', onClick);
    }

    return chip;
}
```
Esta función crea un elemento visual tipo "chip" para representar una etiqueta, con opción de hacerlo removible o clickeable.

4.4.3. Renderizado de etiquetas en el formulario

```javascript
function renderTagsPreview() {
    tagsPreview.innerHTML = '';
    
    appState.currentTags.forEach(tag => {
        tagsPreview.appendChild(createTagChip(tag));
    });
}
```
Muestra las etiquetas actuales como chips en el formulario de creación/edición.

4.4.4. Sugerencias de etiquetas
```javascript
function renderTagsSuggestions(inputValue) {
    tagsSuggestions.innerHTML = '';
    
    if (!inputValue) {
        tagsSuggestions.classList.add('hidden');
        return;
    }
    
    const normalizedInput = normalizeText(inputValue);
    const filteredTags = appState.allTags.filter(tag => {
        return normalizeText(tag).includes(normalizedInput) && 
               !appState.currentTags.includes(tag);
    });
    
    if (filteredTags.length === 0) {
        tagsSuggestions.classList.add('hidden');
        return;
    }
    
    filteredTags.forEach(tag => {
        const item = document.createElement('div');
        item.className = 'px-3 py-2 cursor-pointer hover:bg-gray-100';
        item.textContent = tag;
        item.addEventListener('click', () => {
            if (!appState.currentTags.includes(tag)) {
                appState.currentTags.push(tag);
                tagsInput.value = '';
                renderTagsPreview();
                tagsSuggestions.classList.add('hidden');
            }
        });
        tagsSuggestions.appendChild(item);
    });
    
    tagsSuggestions.classList.remove('hidden');
}
```
Muestra sugerencias de etiquetas existentes mientras el usuario escribe, filtrando según el texto ingresado.

4.4.5. Lista de etiquetas para filtrar
```javascript
function renderTagsFilterList() {
    tagsFilterList.innerHTML = '';
    
    if (appState.allTags.length === 0) {
        const noTags = document.createElement('li');
        noTags.textContent = 'No hay etiquetas disponibles';
        noTags.className = 'text-sm text-gray-500 italic';
        tagsFilterList.appendChild(noTags);
        return;
    }
    
    appState.allTags.forEach(tag => {
        const li = document.createElement('li');
        li.className = 'tags-filter-option flex items-center px-2 py-1 rounded-md';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `tag-filter-${tag}`;
        checkbox.className = 'tags-filter-checkbox';
        checkbox.checked = appState.activeTagsFilter.includes(tag);
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                if (!appState.activeTagsFilter.includes(tag)) {
                    appState.activeTagsFilter.push(tag);
                }
            } else {
                const index = appState.activeTagsFilter.indexOf(tag);
                if (index > -1) {
                    appState.activeTagsFilter.splice(index, 1);
                }
            }
        });
        
        const label = document.createElement('label');
        label.htmlFor = `tag-filter-${tag}`;
        label.textContent = tag;
        label.className = 'text-sm cursor-pointer flex-grow';
        
        li.appendChild(checkbox);
        li.appendChild(label);
        tagsFilterList.appendChild(li);
    });
}
```

Genera la lista de etiquetas disponibles con checkboxes para el menú desplegable de filtrado.

4.4.6. Indicador de etiquetas activas
```javascript
function renderActiveTagsFilter() {
    activeTagsContainer.innerHTML = '';
    
    if (appState.activeTagsFilter.length === 0) {
        activeTagsContainer.classList.add('hidden');
        return;
    }
    
    activeTagsContainer.classList.remove('hidden');
    
    // Agregar texto "Filtrando por:"
    const filteringText = document.createElement('span');
    filteringText.textContent = 'Filtrando por:';
    filteringText.className = 'text-sm text-gray-600 mr-2';
    activeTagsContainer.appendChild(filteringText);
    
    // Agregar chips
    appState.activeTagsFilter.forEach(tag => {
        activeTagsContainer.appendChild(createTagChip(tag, true, true, null));
    });
}
```

Muestra las etiquetas actualmente seleccionadas como filtros encima de la lista de plantillas.

4.4.7. Aplicación y limpieza de filtros
```javascript
function applyTagsFilter() {
    renderActiveTagsFilter();
    tagsFilterDropdown.classList.add('hidden');
    renderTemplates();
}

function clearTagsFilter() {
    appState.activeTagsFilter = [];
    renderTagsFilterList();
    renderActiveTagsFilter();
    tagsFilterDropdown.classList.add('hidden');
    renderTemplates();
}
```

Estas funciones aplican o limpian los filtros de etiquetas seleccionados.

4.5. Modificación del filtrado de plantillas

```javascript
function filterTemplates(templates) {
    return templates.filter(template => {
        // Filtro por término de búsqueda
        const matchesSearch = !appState.searchTerm || 
            normalizeText(template.title).includes(normalizeText(appState.searchTerm)) || 
            normalizeText(template.message).includes(normalizeText(appState.searchTerm)) || 
            normalizeText(template.hashTag).includes(normalizeText(appState.searchTerm));
        
        // Filtro por etiquetas
        const matchesTags = appState.activeTagsFilter.length === 0 || 
            (template.tags && appState.activeTagsFilter.every(tag => template.tags.includes(tag)));
        
        return matchesSearch && matchesTags;
    });
}
```

Esta función combina el filtrado por término de búsqueda y por etiquetas. Para el filtrado por etiquetas, utiliza la lógica "Y" (every) para mostrar sólo las plantillas que contienen todas las etiquetas seleccionadas.

4.6. Actualización del renderizado de plantillas
Modifiqué la función renderTemplates() para:

Usar la nueva función filterTemplates()
Incluir la visualización de etiquetas en cada tarjeta
Añadir event listeners a las etiquetas en las tarjetas para permitir filtrado al hacer clic

```javascript
// En el HTML generado para las tarjetas:
<div class="template-tags mb-3">
    ${template.tags && template.tags.length > 0 ? 
        template.tags.map(tag => `<span class="template-tag" data-tag="${tag}">${tag}</span>`).join('') : ''}
</div>

// Event listeners para las etiquetas en las tarjetas:
const templateTags = li.querySelectorAll('.template-tag');
templateTags.forEach(tagElement => {
    tagElement.addEventListener('click', () => {
        const tag = tagElement.dataset.tag;
        if (!appState.activeTagsFilter.includes(tag)) {
            appState.activeTagsFilter.push(tag);
            renderTagsFilterList();
            applyTagsFilter();
        }
    });
});
```

4.7. Event listeners para interacciones con etiquetas

```javascript
// Para el input de etiquetas
tagsInput.addEventListener('input', function() {
    const value = tagsInput.value.trim();
    renderTagsSuggestions(value);
});

tagsInput.addEventListener('blur', function() {
    // Pequeño delay para permitir hacer clic en las sugerencias
    setTimeout(() => {
        tagsSuggestions.classList.add('hidden');
    }, 200);
});

tagsInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const value = tagsInput.value.trim();
        
        if (value) {
            // Limite de 15 caracteres para etiquetas
            if (value.length > 15) {
                showNotification("Las etiquetas deben tener máximo 15 caracteres", 3000);
                return;
            }
            
            // Evitar duplicados
            if (!appState.currentTags.includes(value)) {
                appState.currentTags.push(value);
                tagsInput.value = '';
                renderTagsPreview();
            }
        }
    }
});

// Para el filtro de etiquetas
tagsFilterButton.addEventListener('click', function() {
    tagsFilterDropdown.classList.toggle('hidden');
    updateAllTagsList();
});

// Cerrar el menú desplegable al hacer clic fuera
document.addEventListener('click', function(e) {
    if (!tagsFilterButton.contains(e.target) && !tagsFilterDropdown.contains(e.target)) {
        tagsFilterDropdown.classList.add('hidden');
    }
});

applyTagsFilterBtn.addEventListener('click', applyTagsFilter);
clearTagsFilterBtn.addEventListener('click', clearTagsFilter);
```

Estos listeners manejan:

- La entrada de texto para crear etiquetas
- Validación del límite de 15 caracteres
- Apertura/cierre del menú desplegable de filtros
- Aplicación de filtros seleccionados

4.8. Actualización del manejo del formulario

```javascript
// Event listener para el submit del formulario
templateForm.addEventListener("submit", function (event){
    event.preventDefault();

    const title = titleInput.value;
    const message = messageInput.value;
    const hashTag = "#"+hashTagInput.value;
    const link = linkInput.value;
    const date = new Date().toLocaleDateString();
    const tags = [...appState.currentTags]; // Copia de las etiquetas actuales

    if (appState.isEditing) {
        // Editar plantilla existente
        const index = parseInt(templateIndexInput.value);
        const updateTemplate = new Template(title, message, hashTag, link, date, tags);
        window.templateStore.updateTemplate(index, updateTemplate);
        showNotification("Plantilla actualizada con éxito");
    } else {
        // Agregar nueva plantilla
        const newTemplate = new Template(title, message, hashTag, link, date, tags);
        window.templateStore.addTemplate(newTemplate);
        showNotification("Plantilla guardada con éxito");
    }

    // Actualizar la lista de todas las etiquetas disponibles
    updateAllTagsList();
    
    // Cerrar el modal
    closeModal();
});
```

Aquí he actualizado el manejo del formulario para incluir las etiquetas al crear o editar plantillas.

4.9. Inicialización
```javascript
// En el evento DOMContentLoaded
// Inicializar lista de etiquetas
updateAllTagsList();
```

Inicializa la lista de todas las etiquetas disponibles al cargar la página.

