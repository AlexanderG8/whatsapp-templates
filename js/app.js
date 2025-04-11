// Variables html
const templatesContainer = document.querySelector("#templates-container");
const gridViewButton = document.querySelector("#grid-view");
const listViewButton = document.querySelector("#list-view");
const btnNewTemplate = document.querySelector("#new-template");
const emptyState = document.querySelector("#empty-state");
const notification = document.querySelector("#notification");
const notificationMessage = document.querySelector("#notification-message");

// Estado de la aplicación
const appState = {
    viewMode: "grid", // grid o list
    notificationTimeout: null // Para controlar el timeout de las notificaciones
}

btnNewTemplate.addEventListener("click", function () {
    const title = prompt("Ingrese el título de la plantilla");
    const message = prompt("Ingrese el mensaje de la plantilla");
    const hashTag = prompt("Ingrese el hashtag de la plantilla");
    const link = prompt("Ingrese el link de la plantilla");
    const date = new Date().toLocaleDateString();
    window.templateStore.addTemplate(new Template(title, message, hashTag, link, date));
})

// Función para mostrar notificaciones temporales
function showNotification(message, duration = 3000) {
    // Limpiar cualquier timeout existente
    if (appState.notificationTimeout) {
        clearTimeout(appState.notificationTimeout);
    }
    
    // Establecer el mensaje
    notificationMessage.textContent = message;
    
    // Remuevo el hidden
    notification.classList.remove('hidden');
    // Mostrar la notificación
    notification.classList.add('show');
    
    // Ocultar después del tiempo especificado
    appState.notificationTimeout = setTimeout(() => {
        // Remuevo el show
        notification.classList.remove('show');
        // Ocultar la notificación
        notification.classList.add('hidden');
    }, duration);
}

// Función para manejar la eliminación de una plantilla
function handleDeleteTemplate(index) {
    // Confirmación antes de eliminar
    if (confirm("¿Estás seguro de que deseas eliminar esta plantilla?")) {
        // Llamar a la función removeTemplate del store
        window.templateStore.removeTemplate(index);
        
        // Mostrar notificación
        showNotification("Plantilla eliminada con éxito");
    }
}

// Función para verificar si hay plantillas y mostrar el estado vacío si corresponde
function checkEmptyState() {
    const templates = window.templateStore.getState();
    
    if (templates.length === 0) {
        // No hay plantillas, mostrar el estado vacío
        templatesContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
    } else {
        // Hay plantillas, ocultar el estado vacío
        templatesContainer.classList.remove('hidden');
        emptyState.classList.add('hidden');
    }
}

// Función para renderizar las plantillas usando el store
function renderTemplates(){
    templatesContainer.innerHTML = "";

    // Trae la lista de templates desde el store
    const templates = window.templateStore.getState();
    
    // Verificar si hay plantillas
    checkEmptyState();
    
    // Si no hay plantillas, no continuar con el renderizado
    if (templates.length === 0) {
        return;
    }

    templates.forEach(function (template, index){
        //Creo elemento li
        const li = document.createElement('li');
        
        // Aplicar estilos según el modo de vista
        if (appState.viewMode === 'grid') {
            li.classList.add("bg-white", "p-4", "my-3", "rounded", "shadow-sm", "hover:shadow-md", "transition-shadow", "template-card", "relative");
        } else { // viewMode === 'list'
            li.classList.add("bg-white", "p-4", "rounded", "shadow-sm", "hover:shadow-md", "transition-shadow", "flex", "flex-col", "md:flex-row", "md:items-center", "w-full", "template-card", "relative");
        }

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.classList.add(
            "absolute", "top-2", "right-2", 
            "bg-red-100", "hover:bg-red-200", "text-red-600", 
            "rounded-full", "p-1", "transition-colors", 
            "focus:outline-none", "focus:ring-2", "focus:ring-red-400"
        );
        deleteButton.setAttribute('aria-label', 'Eliminar plantilla');
        deleteButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        `;
        
        // Añadir el evento click para eliminar
        deleteButton.addEventListener('click', function(event) {
            // Evitar que el evento se propague
            event.stopPropagation();
            handleDeleteTemplate(index);
        });

        // Contenedor para información principal (título y mensaje)
        const mainContent = document.createElement('div');
        if (appState.viewMode === 'list') {
            mainContent.classList.add("flex-grow", "md:mr-4");
        }

        // Creo elemento h3
        const h3 = document.createElement('h3');
        h3.classList.add("text-xl", "font-semibold", "text-gray-800", "pr-8"); // Añadir padding-right para dejar espacio al botón de eliminar
        h3.textContent = template.title;

        // Creo elemento hr
        const hr = document.createElement("hr");
        hr.classList.add("block", "my-3", "border-gray-100");
        if (appState.viewMode === 'list') {
            hr.classList.add("md:hidden"); // Ocultar en vista de lista en pantallas medianas y grandes
        }

        // Creo elemento p para mensaje
        const message = document.createElement("p");
        message.classList.add("text-md", "text-gray-600");
        message.textContent = template.message;

        // Creo elemento p para hashtag
        const hashTag = document.createElement("p");
        hashTag.classList.add("text-sm", "mt-3", "text-emerald-600", "font-medium");
        if (appState.viewMode === 'list') {
            hashTag.classList.add("md:ml-auto"); // Alinear a la derecha en vista de lista
        }
        hashTag.textContent = template.hashTag;

        // Estructura diferente según el modo de vista
        if (appState.viewMode === 'grid') {
            // Agrego los elementos creados en el elemento li
            li.appendChild(deleteButton); // Agregar el botón de eliminar
            li.appendChild(h3);
            li.appendChild(hr);
            li.appendChild(message);
            li.appendChild(hashTag);
        } else { // viewMode === 'list'
            // Añadir elementos al contenedor principal
            mainContent.appendChild(h3);
            mainContent.appendChild(hr);
            mainContent.appendChild(message);
            
            // Añadir contenedor principal y hashtag al li
            li.appendChild(deleteButton); // Agregar el botón de eliminar
            li.appendChild(mainContent);
            li.appendChild(hashTag);
        }

        //Agrego el elemento li al contenedor
        templatesContainer.appendChild(li);
    });
}

// Función para cambiar a la vista de grilla
function switchToGridView() {
    appState.viewMode = 'grid';
    templatesContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5';
    
    // Actualizar estilos de los botones
    gridViewButton.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
    gridViewButton.classList.add('bg-emerald-500', 'text-white');
    
    listViewButton.classList.remove('bg-emerald-500', 'text-white');
    listViewButton.classList.add('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
    
    // Re-renderizar plantillas
    renderTemplates();
}

// Función para cambiar a la vista de lista
function switchToListView() {
    appState.viewMode = 'list';
    templatesContainer.className = 'flex flex-col space-y-4';
    
    // Actualizar estilos de los botones
    listViewButton.classList.remove('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
    listViewButton.classList.add('bg-emerald-500', 'text-white');
    
    gridViewButton.classList.remove('bg-emerald-500', 'text-white');
    gridViewButton.classList.add('bg-gray-100', 'hover:bg-gray-200', 'text-gray-700');
    
    // Re-renderizar plantillas
    renderTemplates();
}

// Suscribir la función renderTemplates al store para que se ejecute cuando cambie el estado
window.templateStore.suscribe(renderTemplates);

// Inicializar la store y configurar los event listeners cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
    window.templateStore.initializeStore();
    // Event listeners
    gridViewButton.addEventListener('click', switchToGridView);
    listViewButton.addEventListener('click', switchToListView);
});