function createStore(initialState = []){
    // Estado interno de la función
    let state = initialState; // por defecto es un []

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

    // Función para eliminar una plantilla según su índice
function removeTemplate(index) {
    // Crear una copia del array sin la plantilla a eliminar
    const newState = state.filter((_, i) => i !== index);
    setState(newState);
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
        const newTemplate = [
            new Template(
                "Bienvenido",
                "Hola, bienvenido al curso de JS",
                "#hash1, #hash2, #hash3",
                "link1",
                "date1"
            ),
            new Template(
                "Bienvenido",
                "Hola, bienvenido al curso de JS",
                "#hash1, #hash2, #hash3",
                "link1",
                "date1"
            )
        ];
        setState(newTemplate);
    }

    return{
        getState,
        setState,
        addTemplate,
        initializeStore,
        suscribe,
        removeTemplate
    }
}

const templateStore = createStore([]);
// De esta manera puedo acceder a la store desde el navegador
window.templateStore = templateStore;
