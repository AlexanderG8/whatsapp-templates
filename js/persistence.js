/**
 * * Funcion que guarda mis templates en el localStorage
 */
function saveTemplates() {
  localStorage.setItem(
    "templates",
    JSON.stringify(window.templateStore.getState())
  );
}

function clearTemplatesStorage(){
    localStorage.removeItem("templates");
}
