// src/components/Servicios/Servicios.js

const Servicios = () => {
    const serviciosSection = document.createElement('section');
    serviciosSection.id = 'servicios';
    // Fondo gris claro para alternar con la sección "Nosotros"
    serviciosSection.className = 'py-20 bg-gray-50 font-sans';

    const container = document.createElement('div');
    container.className = 'container mx-auto px-6 text-center';

    // --- Título y Subtítulo de la Sección ---
    const title = document.createElement('h2');
    title.className = 'text-4xl font-extrabold mb-4 text-gray-900';
    title.textContent = 'Nuestros Servicios';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-lg text-gray-600 max-w-2xl mx-auto mb-16';
    subtitle.textContent = 'Todo lo que necesitas para que tu viaje sea más simple, rápido y predecible. Descubre las herramientas que hemos diseñado para ti.';

    container.appendChild(title);
    container.appendChild(subtitle);

    // --- Contenedor de la Rejilla de Servicios ---
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10';

    // --- Definición de los servicios (fácil de ampliar) ---
    const services = [
        {
            icon: `<svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>`,
            title: 'Rutas en Tiempo Real',
            description: 'Visualiza la ubicación exacta de tu transporte en el mapa y obtén estimaciones precisas de llegada.'
        },
        {
            icon: `<svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
            title: 'Horarios y Frecuencias',
            description: 'Consulta los horarios programados y la frecuencia de paso para planificar tu viaje con antelación.'
        },
        {
            icon: `<svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>`,
            title: 'Alertas y Notificaciones',
            description: 'Recibe alertas sobre retrasos, cambios de ruta o cualquier imprevisto para que siempre estés informado.'
        }
    ];

    services.forEach(service => {
        // --- Creación de la Tarjeta de Servicio ---
        const card = document.createElement('div');
        card.className = 'bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out';

        // Contenedor del ícono para un mejor estilo
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'mx-auto mb-6 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center';
        iconWrapper.innerHTML = service.icon;

        const cardTitle = document.createElement('h3');
        cardTitle.className = 'text-xl font-bold text-gray-800 mb-3';
        cardTitle.textContent = service.title;

        const cardDescription = document.createElement('p');
        cardDescription.className = 'text-gray-600 leading-relaxed';
        cardDescription.textContent = service.description;

        card.appendChild(iconWrapper);
        card.appendChild(cardTitle);
        card.appendChild(cardDescription);
        gridContainer.appendChild(card);
    });

    container.appendChild(gridContainer);
    serviciosSection.appendChild(container);

    return {
        element: serviciosSection,
        cleanup: null 
    };
};

export default Servicios;