function createStore(initialState = []){
    // Estado interno de la función
    let state = initialState; // por defecto es un []

    // Para guardar la última plantilla eliminada
    let lastDeletedTemplate = null;
    let lastDeletedIndex = -1;

    // Listeners es un arreglo que se ejecuta cuando el estado cambia
    const listeners = [];

    function getState(){
        return state;
    }

    // La función setState es la que permite cambiar el estado interno de la función,
    // por lo tanto se ejuta cuando el estado cambia, por ende, yo debo llamar a la funciones
    // que existen dentro de listener
    function setState(newState){
        state = newState;

        listeners.forEach(function (listener) {
            listener(state);
        });
    }

    function addTemplate(newTemplate){

        // ... => spread operator (sirve para realizar una copia del array)
        const newState = [...state, newTemplate];

        setState(newState);
    }

    function updateTemplate(index, updateTemplate){
        // Creamos una copia del estado actual
        const newState = [...state];
        // Actualizamos la plantilla en el nuevo estado
        newState[index] = updateTemplate;
        // Actualizamos el estado
        setState(newState);
    }

    // Función para eliminar una plantilla según su índice
    function removeTemplate(index) {
        // Guardar la plantilla antes de eliminarla
        lastDeletedTemplate = state[index];
        lastDeletedIndex = index;

        // Crear una copia del array sin la plantilla a eliminar
        const newState = state.filter((_, i) => i !== index);
        setState(newState);
    }

    // Función para resetear todas las plantillas
    function resetTemplates(){
        // Guardar última copia antes de resetear
        if(state.length > 0){
            lastDeletedTemplate =null;
            lastDeletedIndex = -1;
        }
        // Crea un nuevo estado vacío
        setState([]);
    }

    // Función para recuperar la última plantilla eliminada
    function recoverLastTemplate() {
        if (lastDeletedTemplate === null) {
            return false; // No hay plantilla para recuperar
        }

        // Si tenemos el índice original, intentamos insertar en la misma posición
        if (lastDeletedIndex >= 0 && lastDeletedIndex <= state.length) {
            const newState = [...state];
            newState.splice(lastDeletedIndex, 0, lastDeletedTemplate);
            setState(newState);
        } else {
            // Si no, añadimos al final
            addTemplate(lastDeletedTemplate);
        }

        // Limpiar la plantilla recuperada
        const recoveredTemplate = lastDeletedTemplate;
        lastDeletedTemplate = null;
        lastDeletedIndex = -1;

        return recoveredTemplate;
    }

    // Verificar si hay una plantilla que se pueda recuperar
    function hasRecoverableTemplate() {
        return lastDeletedTemplate !== null;
    }

    function suscribe(listener){
        listeners.push(listener);

        return () => {
            const index = listeners.indexOf(listener);
            if(index > -1){
                listeners.splice(index, 1)
            }
        }
    }

    function initializeStore(){
        // Obtengo los templates de mi localStorage y lo deserealizo con JSON.parse()
        const templates = localStorage.getItem("templates");
        const newTemplate = templates === null ? [] : JSON.parse(templates);
        // Realizo una reinstanciación
        const mappedTemplates = newTemplate.map(function(newTemplate){
            return new Template(
                newTemplate.title,
                newTemplate.message,
                newTemplate.hashTag,
                newTemplate.link,
                newTemplate.date
            )
        });

        setState(mappedTemplates);
    }

    return{
        getState,
        setState,
        addTemplate,
        initializeStore,
        suscribe,
        removeTemplate,
        resetTemplates,
        updateTemplate,
        recoverLastTemplate,
        hasRecoverableTemplate
    }
}

const templateStore = createStore([]);
// De esta manera puedo acceder a la store desde el navegador
window.templateStore = templateStore;
