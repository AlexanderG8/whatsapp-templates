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
const searchInput = document.querySelector("#search-templates");
const noResultsElement = document.querySelector("#no-results");

// Variables para el modal de envío de mensajes
const sendMessageModal = document.querySelector("#send-message-modal");
const sendTemplateIndexInput = document.querySelector("#send-template-index");
const phoneNumberInput = document.querySelector("#phone-number");
const closeSendModalBtn = document.querySelector("#close-send-modal");
const cancelSendBtn = document.querySelector("#cancel-send");
const confirmSendBtn = document.querySelector("#confirm-send");

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
    isEditing: false, // Para controlar si estamos editando o agregando
    searchTerm: "", // Término de búsqueda para filtrar plantillas
    activeTagsFilter: [], // Etiquetas seleccionadas para filtrar
    allTags: [], // Todas las etiquetas disponibles en el sistema
    currentTags: [] // Etiquetas actualmente seleccionadas en el formulario
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

    // Limpiar las etiquetas
    appState.currentTags = [];
    renderTagsPreview();

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

    // Cargar etiquetas de la plantilla
    appState.currentTags = template.tags || [];
    renderTagsPreview();

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

// Función para abrir el modal de envío de mensaje
function openSendMessageModal(index) {
    // Guardar el índice de la plantilla a enviar
    sendTemplateIndexInput.value = index;
    
    // Limpiar el campo de número de teléfono
    phoneNumberInput.value = "";
    
    // Mostrar el modal
    sendMessageModal.classList.remove("hidden");
}

// Función para cerrar el modal de envío de mensaje
function closeSendMessageModal() {
    sendMessageModal.classList.add("hidden");
}

// Función para enviar el mensaje a WhatsApp
function sendTemplateToWhatsApp(index, phoneNumber) {
    // Obtener la plantilla
    const templates = window.templateStore.getState();
    const template = templates[index];
    
    // Formatear el número (eliminar caracteres no numéricos)
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    
    // Construir la URL de WhatsApp
    const messageText = encodeURIComponent(template.message + ' ' + template.hashTag + ' ' + template.link);
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${messageText}`;
    
    // Abrir la URL en una nueva pestaña
    window.open(whatsappUrl, '_blank');
    
    // Mostrar notificación
    showNotification("Redirigiendo a WhatsApp...");
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

// Event listeners para el modal de envío de mensajes
closeSendModalBtn.addEventListener("click", closeSendMessageModal);
cancelSendBtn.addEventListener("click", closeSendMessageModal);
confirmSendBtn.addEventListener("click", function() {
    // Obtener el índice de la plantilla y el número de teléfono
    const index = parseInt(sendTemplateIndexInput.value);
    const phoneNumber = phoneNumberInput.value.trim();
    
    // Validar número de teléfono
    if (!phoneNumber) {
        showNotification("Por favor ingresa un número de teléfono", 3000);
        return;
    }
    
    // Enviar mensaje
    sendTemplateToWhatsApp(index, phoneNumber);
    
    // Cerrar el modal
    closeSendMessageModal();
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

// Función para normalizar texto (eliminar acentos) para búsquedas
function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// Función para verificar si hay plantillas y mostrar el estado vacío si corresponde
function checkEmptyState() {
    const templates = window.templateStore.getState();

    if (templates.length === 0) {
        // Si no hay plantillas, mostrar el estado vacío
        emptyState.classList.remove('hidden');
        noResultsElement.classList.add('hidden');
        return true;
    } else {
        // Si hay plantillas, ocultar el estado vacío
        emptyState.classList.add('hidden');

        // Aplicar filtros combinados
        const filteredTemplates = filterTemplates(templates);

        if (filteredTemplates.length === 0) {
            noResultsElement.classList.remove('hidden');
        } else {
            noResultsElement.classList.add('hidden');
        }

        return false;
    }
}

// Función para filtrar plantillas según búsqueda y etiquetas
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

// Función para renderizar las plantillas usando el store
function renderTemplates() {
    //Limpiamos contenedor
    templatesContainer.innerHTML = "";

    //Verificamos si hay plantillas
    const templates = window.templateStore.getState();

    if (checkEmptyState()) {
        return;
    }

    // Filtrar plantillas según búsqueda y etiquetas
    const filteredTemplates = filterTemplates(templates);

    if (filteredTemplates.length === 0) {
        noResultsElement.classList.remove('hidden');
        return;
    } else {
        noResultsElement.classList.add('hidden');
    }

    filteredTemplates.forEach(function (template, index){
        //Creo elemento li
        const li = document.createElement('li');

        // Uso el appState para determinar la vista
        if (appState.viewMode === 'grid') {
            li.className = 'template-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md';

            // Crea contenido para vista de grilla
            li.innerHTML = `
                <div class="p-4">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="font-semibold text-gray-900 truncate w-4/5">${template.title}</h3>
                        <span class="text-xs text-gray-500">${template.date}</span>
                    </div>
                    <p class="text-gray-700 text-sm mb-3 line-clamp-3">${template.message}</p>
                    <div class="text-xs bg-gray-100 text-gray-600 rounded px-2 py-1 mb-3 inline-block">${template.hashTag}</div>
                    <div class="template-tags mb-3">
                        ${template.tags && template.tags.length > 0 ? 
                            template.tags.map(tag => `<span class="template-tag" data-tag="${tag}">${tag}</span>`).join('') : ''}
                    </div>
                    <div class="flex justify-between items-center">
                        <button onclick="openSendMessageModal(${templates.indexOf(template)})" class="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Enviar
                        </button>
                        <div class="flex space-x-1">
                            <button class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1.5 rounded" onclick="handleEditTemplate(${templates.indexOf(template)})">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                            <button class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1.5 rounded" onclick="handleDeleteTemplate(${templates.indexOf(template)})">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            li.className = 'template-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md mb-3';

            // Crea contenido para vista de lista
            li.innerHTML = `
                <div class="p-4">
                    <div class="flex flex-col sm:flex-row justify-between items-start mb-3">
                        <div class="flex-grow">
                            <div class="flex justify-between items-start mb-2">
                                <h3 class="font-semibold text-gray-900">${template.title}</h3>
                                <span class="text-xs text-gray-500 ml-3">${template.date}</span>
                            </div>
                            <p class="text-gray-700 text-sm mb-3">${template.message}</p>
                            <div class="text-xs bg-gray-100 text-gray-600 rounded px-2 py-1 mb-3 inline-block">${template.hashTag}</div>
                            <div class="template-tags mb-3">
                                ${template.tags && template.tags.length > 0 ? 
                                    template.tags.map(tag => `<span class="template-tag" data-tag="${tag}">${tag}</span>`).join('') : ''}
                            </div>
                        </div>
                        <div class="flex space-x-2 sm:ml-4 mt-3 sm:mt-0">
                            <button onclick="openSendMessageModal(${templates.indexOf(template)})" class="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded text-sm font-medium flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Enviar
                            </button>
                            <button class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1.5 rounded" onclick="handleEditTemplate(${templates.indexOf(template)})">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                            <button class="bg-gray-100 hover:bg-gray-200 text-gray-600 p-1.5 rounded" onclick="handleDeleteTemplate(${templates.indexOf(template)})">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Agregar el elemento a la lista
        templatesContainer.appendChild(li);

        // Añadir event listeners para etiquetas en las tarjetas
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

// Event listener para el input de búsqueda
searchInput.addEventListener('input', function() {
    appState.searchTerm = searchInput.value;
    renderTemplates();
});

// Event listeners para el campo de etiquetas
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

// Event listeners para el filtro de etiquetas
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

// Función para actualizar la lista de todas las etiquetas disponibles
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

// Función para crear un chip de etiqueta
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

// Función para renderizar las etiquetas en el formulario
function renderTagsPreview() {
    tagsPreview.innerHTML = '';

    appState.currentTags.forEach(tag => {
        tagsPreview.appendChild(createTagChip(tag));
    });
}

// Función para renderizar la lista de sugerencias de etiquetas
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

// Función para renderizar la lista de etiquetas para filtrar
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

// Función para renderizar las etiquetas activas como chips
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

// Función para actualizar los filtros de etiquetas
function applyTagsFilter() {
    renderActiveTagsFilter();
    tagsFilterDropdown.classList.add('hidden');
    renderTemplates();
}

// Función para limpiar los filtros de etiquetas
function clearTagsFilter() {
    appState.activeTagsFilter = [];
    renderTagsFilterList();
    renderActiveTagsFilter();
    tagsFilterDropdown.classList.add('hidden');
    renderTemplates();
}

// Inicializar la aplicación
window.addEventListener("DOMContentLoaded", function(){
    // Inicializar el store con los templates guardados
    window.templateStore.initializeStore();

    // Inicializar lista de etiquetas
    updateAllTagsList();

    // Inicializar el estado del botón de recuperación
    updateRecoverButtonState();
});

// Función para cargar todos los event listeners
function loadEventListeners() {
    // Event listeners de modos de vista
    gridViewButton.addEventListener("click", switchToGridView);
    listViewButton.addEventListener("click", switchToListView);
    
    // Event listeners para búsqueda
    searchInput.addEventListener("input", function() {
        appState.searchTerm = this.value.trim();
        renderTemplates();
    });
    
    // Event listener para reset
    btnResetTemplates.addEventListener('click', resetearPlantillas);
    
    // Event listener para recuperar plantilla
    btnRecoverTemplate.addEventListener('click', handleRecoverTemplate);
    
    // Event listeners para el modal de envío de mensajes
    closeSendModalBtn.addEventListener("click", closeSendMessageModal);
    cancelSendBtn.addEventListener("click", closeSendMessageModal);
    confirmSendBtn.addEventListener("click", function() {
        // Obtener el índice de la plantilla y el número de teléfono
        const index = parseInt(sendTemplateIndexInput.value);
        const phoneNumber = phoneNumberInput.value.trim();
        
        // Validar número de teléfono
        if (!phoneNumber) {
            showNotification("Por favor ingresa un número de teléfono", 3000);
            return;
        }
        
        // Enviar mensaje
        sendTemplateToWhatsApp(index, phoneNumber);
        
        // Cerrar el modal
        closeSendMessageModal();
    });
}