class Template{
    constructor(title, message, hashTag, link, date){
        this.title = title;
        this.message = message;
        this.hashTag = hashTag;
        this.link = link;
        this.date = date;
    }

    saveTemplate(){
        templates.push(this);
    }

    render(viewMode = 'grid'){
        //Creo elemento li
        const li = document.createElement('li');
        
        // Aplicar estilos según el modo de vista
        if (viewMode === 'grid') {
            li.classList.add("bg-white", "p-4", "my-3", "rounded", "shadow-sm", "hover:shadow-md", "transition-shadow");
        } else { // viewMode === 'list'
            li.classList.add("bg-white", "p-4", "rounded", "shadow-sm", "hover:shadow-md", "transition-shadow", "flex", "flex-col", "md:flex-row", "md:items-center", "w-full");
        }

        // Contenedor para información principal (título y mensaje)
        const mainContent = document.createElement('div');
        if (viewMode === 'list') {
            mainContent.classList.add("flex-grow", "md:mr-4");
        }

        // Creo elemento h3
        const h3 = document.createElement('h3');
        h3.classList.add("text-xl", "font-semibold");
        h3.textContent = this.title;

        // Creo elemento hr
        const hr = document.createElement("hr");
        hr.classList.add("block", "my-3");
        if (viewMode === 'list') {
            hr.classList.add("md:hidden"); // Ocultar en vista de lista en pantallas medianas y grandes
        }

        // Creo elemento p para mensaje
        const message = document.createElement("p");
        message.classList.add("text-md", "text-gray-500");
        message.textContent = this.message;

        // Creo elemento p para hashtag
        const hashTag = document.createElement("p");
        hashTag.classList.add("text-sm", "mt-3", "text-green-800");
        if (viewMode === 'list') {
            hashTag.classList.add("md:ml-auto"); // Alinear a la derecha en vista de lista
        }
        hashTag.textContent = this.hashTag;

        // Estructura diferente según el modo de vista
        if (viewMode === 'grid') {
            // Agrego los elementos creados en el elemento li
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
            li.appendChild(mainContent);
            li.appendChild(hashTag);
        }

        //Agrego el elemento li al contenedor
        templatesContainer.appendChild(li);
        return li;
    }
}