class Template{
    constructor(title, message, hashTag, link, date, tags = []){
        this.title = title;
        this.message = message;
        this.hashTag = hashTag;
        this.link = link;
        this.date = date;
        this.tags = tags; // Array de etiquetas personalizadas
    }
}