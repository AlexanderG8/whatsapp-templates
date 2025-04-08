const template1 = new Template(
  "Bienvenido",
  "Hola, bienvenido al curso de JS",
  "#hash1, #hash2, #hash3",
  "link1",
  "date1"
);

template1.saveTemplate();
// template1.render();

const template2 = new Template(
    "Oferta Especial",
    "Aprovecha este descuento único, no te pierdas la oportunidad",
    "#hash1, #hash2, #hash3",
    "link1",
    "date1"
);

template2.saveTemplate();
// template2.saveTemplate();

const template3 = new Template(
    "Oferta Especial",
    "Aprovecha este descuento único, no te pierdas la oportunidad",
    "#hash1, #hash2, #hash3",
    "link1",
    "date1"
);

template3.saveTemplate();

const template4 = new Template(
    "Oferta Especial",
    "Aprovecha este descuento único, no te pierdas la oportunidad",
    "#hash1, #hash2, #hash3",
    "link1",
    "date1"
);

template4.saveTemplate();

const template5 = new Template(
    "Oferta Especial",
    "Aprovecha este descuento único, no te pierdas la oportunidad",
    "#hash1, #hash2, #hash3",
    "link1",
    "date1"
);

template5.saveTemplate();

// Renderizar plantillas
for(let template of templates){
    template.render();
}