const templates = [];

// Variables html
const templatesContainer = document.querySelector("#templates-container");
const gridViewButton = document.querySelector("#grid-view");
const listViewButton = document.querySelector("#list-view");

// Estado de la aplicación
const appState = {
    viewMode: "grid" // grid o list
}

// Función para cambiar a la vista de grilla
function switchToGridView() {
    appState.viewMode = 'grid';
    templatesContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5';
    
    // Actualizar estilos de los botones
    gridViewButton.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-green-500', 'hover:text-white');
    gridViewButton.classList.add('bg-green-500', 'text-white');
    
    listViewButton.classList.remove('bg-green-500', 'text-white');
    listViewButton.classList.add('bg-gray-200', 'hover:bg-green-500', 'hover:text-white', 'text-gray-700');
    
    // Re-renderizar plantillas para aplicar estilo de grilla
    renderAllTemplates();
}

// Función para cambiar a la vista de lista
function switchToListView() {
    appState.viewMode = 'list';
    templatesContainer.className = 'flex flex-col space-y-4';
    
    // Actualizar estilos de los botones
    listViewButton.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-green-500', 'hover:text-white');
    listViewButton.classList.add('bg-green-500', 'text-white');
    
    gridViewButton.classList.remove('bg-green-500', 'text-white');
    gridViewButton.classList.add('bg-gray-200', 'hover:bg-green-500', 'hover:text-white', 'text-gray-700');
    
    // Re-renderizar plantillas para aplicar estilo de lista
    renderAllTemplates();
}

// Función para renderizar todas las plantillas
function renderAllTemplates() {
    // Limpiar el contenedor
    templatesContainer.innerHTML = '';
    
    // Renderizar todas las plantillas
    for(let template of templates){
        template.render(appState.viewMode);
    }
}

// Event listeners
gridViewButton.addEventListener('click', switchToGridView);
listViewButton.addEventListener('click', switchToListView);