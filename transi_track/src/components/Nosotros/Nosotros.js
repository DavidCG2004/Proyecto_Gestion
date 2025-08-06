
import imagenNosotros from '../../assets/nosotros.jpg'; 

const Nosotros = () => {
    const nosotrosSection = document.createElement('section');
    nosotrosSection.id = 'nosotros';
    // Se añade font-sans para asegurar la misma familia de fuente en todo el componente
    nosotrosSection.className = 'py-20 bg-white font-sans'; 

    const container = document.createElement('div');
    container.className = 'container mx-auto px-6 flex flex-col md:flex-row items-center gap-12';

    // --- Columna de la Imagen ---
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'md:w-1/2 w-full';
    
    const image = document.createElement('img');
    image.src = imagenNosotros;
    image.alt = 'Equipo de TransiTrack trabajando en la oficina';
    image.className = 'rounded-lg shadow-2xl w-full h-auto object-cover';
    image.loading = 'lazy';
    image.decoding = 'async';
    
    imageWrapper.appendChild(image);

    // --- Columna del Contenido ---
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'md:w-1/2 w-full text-gray-800';

    const title = document.createElement('h2');
    title.className = 'text-4xl font-extrabold mb-4 text-gray-900';
    title.textContent = 'Sobre Nosotros';

    const subtitle = document.createElement('p');
    // MEJORA: Se añade text-justify para alinear el texto
    subtitle.className = 'text-lg text-gray-600 mb-5 text-justify';
    subtitle.textContent = 'En TransiTrack, nuestra misión es revolucionar la movilidad urbana a través de la tecnología, haciendo el transporte público más accesible, eficiente y amigable para todos.';

    const description = document.createElement('p');
    // MEJORA: Se añade text-justify para alinear el texto y se ajusta el color
    description.className = 'text-base text-gray-600 mb-5 text-justify';
    description.textContent = 'Somos un equipo de desarrolladores, diseñadores y entusiastas del transporte apasionados por resolver los desafíos de las ciudades modernas. Creemos que con la información correcta en el momento preciso, podemos transformar la experiencia de viaje de millones de personas.';

    // --- Sección de Valores ---
    const valuesContainer = document.createElement('div');
    valuesContainer.className = 'grid grid-cols-1 sm:grid-cols-2 gap-6';

    // MEJORA: Se reemplazan los emojis por iconos SVG para un look más profesional
    const values = [
        { 
            icon: `<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>`, 
            title: 'Innovación', 
            text: 'Buscamos constantemente nuevas y mejores formas de aplicar la tecnología.' 
        },
        { 
            icon: `<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>`, 
            title: 'Comunidad', 
            text: 'Construimos para las personas, poniendo sus necesidades en el centro.' 
        },
        { 
            icon: `<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>`, 
            title: 'Confianza', 
            text: 'Ofrecemos datos precisos y un servicio en el que puedes confiar.' 
        },
        { 
            icon: `<svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>`, 
            title: 'Eficiencia', 
            text: 'Nos enfocamos en soluciones que ahorran tiempo y simplifican la vida.' 
        }
    ];

    values.forEach(value => {
        const valueCard = document.createElement('div');
        valueCard.className = 'flex items-start gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200';
        
        const iconContainer = document.createElement('div');
        iconContainer.className = 'flex-shrink-0';
        iconContainer.innerHTML = value.icon;

        const textContainer = document.createElement('div');
        
        const valueTitle = document.createElement('h3');
        valueTitle.className = 'font-bold text-gray-800 mb-1'; // Se ajusta el margen
        valueTitle.textContent = value.title;

        const valueText = document.createElement('p');
        valueText.className = 'text-sm text-gray-600';
        valueText.textContent = value.text;

        textContainer.appendChild(valueTitle);
        textContainer.appendChild(valueText);
        
        valueCard.appendChild(iconContainer);
        valueCard.appendChild(textContainer);
        
        valuesContainer.appendChild(valueCard);
    });
    
    contentWrapper.appendChild(title);
    contentWrapper.appendChild(subtitle);
    contentWrapper.appendChild(description);
    contentWrapper.appendChild(valuesContainer);

    container.appendChild(imageWrapper);
    container.appendChild(contentWrapper);
    
    nosotrosSection.appendChild(container);

    return {
        element: nosotrosSection,
        cleanup: null
    };
};

export default Nosotros;