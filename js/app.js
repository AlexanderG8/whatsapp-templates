// Variables html
const templatesContainer = document.querySelector("#templates-container");
const gridViewButton = document.querySelector("#grid-view");
const listViewButton = document.querySelector("#list-view");
const btnNewTemplate = document.querySelector("#new-template");
const emptyState = document.querySelector("#empty-state");
const notification = document.querySelector("#notification");
const notificationMessage = document.querySelector("#notification-message");
const btnResetTemplates = document.querySelector("#reset-templates");
const btnRecoverTemplate = document.querySelector("#recover-template");

// Variables para el modal de edición
const templateModal = document.querySelector("#template-modal");
const modalTitle = document.querySelector("#modal-title");
const templateForm = document.querySelector("#template-form");
const templateIndexInput = document.querySelector("#template-index");
const titleInput = document.querySelector("#title");
const messageInput = document.querySelector("#message");
const hashTagInput = document.querySelector("#hashTag");
const linkInput = document.querySelector("#link");
const closeModalBtn = document.querySelector("#close-modal");
const cancelTemplateBtn = document.querySelector("#cancel-template");
const submitButtonText = document.querySelector("#submit-button-text");

// Variables para el modal de confirmación de eliminación
const deleteConfirmModal = document.querySelector("#delete-confirm-modal");
const deleteTemplateIndexInput = document.querySelector("#delete-template-index");
const cancelDeleteBtn = document.querySelector("#cancel-delete");
const confirmDeleteBtn = document.querySelector("#confirm-delete");
const closeDeleteModalBtn = document.querySelector("#close-delete-modal");

// Variables para el modal de confirmación de reset
const resetConfirmModal = document.querySelector("#reset-confirm-modal");
const cancelResetBtn = document.querySelector("#cancel-reset");
const confirmResetBtn = document.querySelector("#confirm-reset");
const closeResetModalBtn = document.querySelector("#close-reset-modal");

// Estado de la aplicación
const appState = {
    viewMode: "grid", // grid o list
    notificationTimeout: null, // Para controlar el timeout de las notificaciones
    isEditing: false // Para controlar si estamos editando o agregando
}

btnNewTemplate.addEventListener("click", function () {
    openAddTemplateModal();
})

// Función para abrir el modal de agregar plantilla
function openAddTemplateModal() {
    appState.isEditing = false;
    modalTitle.textContent = "Agregar Plantilla";
    submitButtonText.textContent = "Guardar";

    // Limpio los inpust
    templateForm.reset();
    templateIndexInput.value = "";

    // Mostrar el modal
    templateModal.classList.remove("hidden");
}

// Función para abrir el modal de editar plantilla
function openEditTemplateModal(index){
    appState.isEditing = true;
    modalTitle.textContent = "Editar Plantilla";
    submitButtonText.textContent = "Actualizar";

    // Obtener la plantilla actual
    const templates = window.templateStore.getState();
    const template = templates[index];

    // Rellenar el formulario con los datos de la plantilla
    titleInput.value = template.title;
    messageInput.value = template.message;
    hashTagInput.value = template.hashTag.replace(/^#/, ''); // Quitar el # inicial si existe
    linkInput.value = template.link;
    templateIndexInput.value = index;

    // Mostrar el modal
    templateModal.classList.remove("hidden");
}

// Función para cerrar el modal de edición
function closeModal() {
    templateModal.classList.add("hidden");
}

// Función para abrir el modal de confirmación de eliminación
function openDeleteConfirmModal(index) {
    // Guardar el índice de la plantilla a eliminar
    deleteTemplateIndexInput.value = index;
    
    // Mostrar el modal
    deleteConfirmModal.classList.remove("hidden");
}

// Función para cerrar el modal de confirmación de eliminación
function closeDeleteConfirmModal() {
    deleteConfirmModal.classList.add("hidden");
}

// Función para abrir el modal de confirmación de reset
function openResetConfirmModal() {
    // Mostrar el modal
    resetConfirmModal.classList.remove("hidden");
}

// Función para cerrar el modal de confirmación de reset
function closeResetConfirmModal() {
    resetConfirmModal.classList.add("hidden");
}

// Función para actualizar el estado del botón de recuperación
function updateRecoverButtonState() {
    if (window.templateStore.hasRecoverableTemplate()) {
        btnRecoverTemplate.classList.remove('hidden');
        btnRecoverTemplate.removeAttribute('disabled');
    } else {
        btnRecoverTemplate.classList.add('hidden');
        btnRecoverTemplate.setAttribute('disabled', 'disabled');
    }
}

// Función para manejar la recuperación de la última plantilla eliminada
function handleRecoverTemplate() {
    const recoveredTemplate = window.templateStore.recoverLastTemplate();
    
    if (recoveredTemplate) {
        showNotification("Plantilla recuperada con éxito");
        updateRecoverButtonState();
    }
}

// Event listeners para el modal de edición
closeModalBtn.addEventListener("click", closeModal);
cancelTemplateBtn.addEventListener("click", closeModal);

// Event listeners para el modal de confirmación de eliminación
closeDeleteModalBtn.addEventListener("click", closeDeleteConfirmModal);
cancelDeleteBtn.addEventListener("click", closeDeleteConfirmModal);
confirmDeleteBtn.addEventListener("click", function() {
    // Obtener el índice de la plantilla a eliminar
    const index = parseInt(deleteTemplateIndexInput.value);
    
    // Llamar a la función removeTemplate del store
    window.templateStore.removeTemplate(index);
    
    // Mostrar notificación
    showNotification("Plantilla eliminada con éxito");
    
    // Cerrar el modal
    closeDeleteConfirmModal();
    
    // Actualizar el estado del botón de recuperación
    updateRecoverButtonState();
});

// Event listeners para el modal de confirmación de reset
closeResetModalBtn.addEventListener("click", closeResetConfirmModal);
cancelResetBtn.addEventListener("click", closeResetConfirmModal);
confirmResetBtn.addEventListener("click", function() {
    // Resetear plantillas
    window.templateStore.resetTemplates();
    
    // Limpiar localStorage
    clearTemplatesStorage();
    
    // Mostrar notificación
    showNotification("Todas las plantillas han sido eliminadas");
    
    // Cerrar el modal
    closeResetConfirmModal();
    
    // Actualizar el estado del botón de recuperación
    updateRecoverButtonState();
});

// Event listener para el botón de recuperar
btnRecoverTemplate.addEventListener('click', handleRecoverTemplate);

// Event listener para el submit del formulario
templateForm.addEventListener("submit", function (event){
    event.preventDefault();

    const title = titleInput.value;
    const message = messageInput.value;
    const hashTag = "#"+hashTagInput.value;
    const link = linkInput.value;
    const date = new Date().toLocaleDateString();

    if (appState.isEditing) {
        // Editar plantilla existente
        const index = parseInt(templateIndexInput.value);
        const updateTemplate = new Template(title, message, hashTag, link, date)
        window.templateStore.updateTemplate(index, updateTemplate);
        showNotification("Plantilla actualizada con éxito");
    } else {
        // Agregar nueva plantilla
        const newTemplate = new Template(title, message, hashTag, link, date);
        window.templateStore.addTemplate(newTemplate);
        showNotification("Plantilla agregada con éxito");
    }

    // Cerrar el modal
    closeModal();
});

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
    // Abrir el modal de confirmación
    openDeleteConfirmModal(index);
}

// Función para manejar la edición de una plantilla
function handleEditTemplate(index) {
    openEditTemplateModal(index);
}

// Función para resetear todas las plantillas
function resetearPlantillas(){
    // Abrir el modal de confirmación
    openResetConfirmModal();
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

        // Botón de editar
        const editButton = document.createElement('button');
        editButton.classList.add(
            "absolute", "top-2", "right-9", 
            "bg-emerald-100", "hover:bg-emerald-200", "text-emerald-600", 
            "rounded-full", "p-1", "transition-colors", 
            "focus:outline-none", "focus:ring-2", "focus:ring-emerald-400"
        );
        editButton.setAttribute('aria-label', 'Editar plantilla');
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
        `;

        // Añadir el evento click para editar
        editButton.addEventListener('click', function(event) {
            // Evitar que el evento se propague
            event.stopPropagation();
            handleEditTemplate(index);
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

        // Crear elemento para el enlace
        const linkContainer = document.createElement("div");
        linkContainer.classList.add("mt-2", "truncate");
        
        const linkIcon = document.createElement("span");
        linkIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
        `;
        
        const linkText = document.createElement("a");
        linkText.href = template.link;
        linkText.target = "_blank";
        linkText.rel = "noopener noreferrer";
        linkText.classList.add("text-sm", "text-blue-600", "hover:underline", "truncate");
        linkText.textContent = template.link;
        
        linkContainer.appendChild(linkIcon);
        linkContainer.appendChild(linkText);

        // Crear elemento para la fecha
        const dateContainer = document.createElement("div");
        dateContainer.classList.add("mt-2", "flex", "items-center", "text-gray-500", "text-xs");
        
        const dateIcon = document.createElement("span");
        dateIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        `;
        
        const dateText = document.createElement("span");
        dateText.textContent = template.date;
        
        dateContainer.appendChild(dateIcon);
        dateContainer.appendChild(dateText);

        // Estructura diferente según el modo de vista
        if (appState.viewMode === 'grid') {
            // Agrego los elementos creados en el elemento li
            li.appendChild(deleteButton); // Agregar el botón de eliminar
            li.appendChild(editButton); // Agregar el botón de editar
            li.appendChild(h3);
            li.appendChild(hr);
            li.appendChild(message);
            li.appendChild(hashTag);
            li.appendChild(linkContainer);
            li.appendChild(dateContainer);
        } else { // viewMode === 'list'
            // Añadir elementos al contenedor principal
            mainContent.appendChild(h3);
            mainContent.appendChild(hr);
            mainContent.appendChild(message);
            
            // Crear contenedor para metadata en vista de lista
            const metaContainer = document.createElement("div");
            metaContainer.classList.add("flex", "flex-col", "mt-2", "space-y-1");
            metaContainer.appendChild(linkContainer);
            metaContainer.appendChild(dateContainer);
            mainContent.appendChild(metaContainer);
            
            // Añadir contenedor principal y hashtag al li
            li.appendChild(deleteButton); // Agregar el botón de eliminar
            li.appendChild(editButton); // Agregar el botón de editar
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
window.templateStore.suscribe(saveTemplates);

// Inicializar la store y configurar los event listeners cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
    window.templateStore.initializeStore();
    // Event listeners
    gridViewButton.addEventListener('click', switchToGridView);
    listViewButton.addEventListener('click', switchToListView);
    btnResetTemplates.addEventListener('click', resetearPlantillas);
    
    // Inicializar el estado del botón de recuperación
    updateRecoverButtonState();
});