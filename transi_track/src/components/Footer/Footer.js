// src/components/Footer/Footer.js

const Footer = () => {
    const footerElement = document.createElement('footer');
    footerElement.className = 'bg-gray-900 text-white font-sans';

    const container = document.createElement('div');
    container.className = 'container mx-auto px-6 py-12';

    const mainGrid = document.createElement('div');
    mainGrid.className = 'grid grid-cols-1 md:grid-cols-3 gap-10 text-center';

    // --- Columna 1: Logo y Descripción ---
    const brandColumn = document.createElement('div');
    const logoTitle = document.createElement('h3');
    logoTitle.className = 'text-2xl font-bold mb-3';
    logoTitle.textContent = 'TransiTrack';
    const description = document.createElement('p');
    description.className = 'text-gray-400 max-w-xs mx-auto';
    description.textContent = 'Revolucionando la movilidad urbana a través de la tecnología.';
    brandColumn.appendChild(logoTitle);
    brandColumn.appendChild(description);

    // --- Columna 2: Información de Contacto ---
    const contactColumn = document.createElement('div');
    const contactTitle = document.createElement('h4');
    contactTitle.className = 'text-lg font-semibold mb-4';
    contactTitle.textContent = 'Contacto';
    
    const contactList = document.createElement('div');
    contactList.className = 'space-y-3 flex flex-col items-center';
    
    const contactDetails = [
        {
            icon: `<svg class="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`,
            text: 'contact@transitrack.com',
            href: 'mailto:contact@transitrack.com'
        },
        {
            icon: `<svg class="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`,
            text: '+593 (962985693)',
            href: 'tel:+593962985693'
        }
    ];

    contactDetails.forEach(detail => {
        const link = document.createElement('a');
        link.href = detail.href;
        link.className = 'flex items-center text-gray-300 hover:text-white transition-colors';
        link.innerHTML = detail.icon + `<span>${detail.text}</span>`;
        contactList.appendChild(link);
    });

    contactColumn.appendChild(contactTitle);
    contactColumn.appendChild(contactList);

    // --- Columna 3: Descarga la App (CON LOS ENLACES CORRECTOS) ---
    const appColumn = document.createElement('div');
    const appTitle = document.createElement('h4');
    appTitle.className = 'text-lg font-semibold mb-4';
    appTitle.textContent = 'Descarga la App (Ejemplo)';
    
    const appButtons = document.createElement('div');
    appButtons.className = 'flex flex-col space-y-3 items-center';
    
    const createAppButton = (href, icon, line1, line2) => {
        const button = document.createElement('a');
        button.href = href;
        button.target = '_blank';
        button.rel = 'noopener noreferrer';
        button.className = 'bg-black border border-gray-600 rounded-lg px-4 py-2 flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors w-48';
        
        const textSpan = `<span class="text-left">
                                <span class="block text-xs text-gray-400">${line1}</span>
                                <span class="block font-semibold">${line2}</span>
                        </span>`;
        button.innerHTML = icon + textSpan;
        return button;
    };
    
    const appleIcon = `<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M21.5,10.2c-1-1.8-2.5-3.1-4.2-3.9c-0.6-0.3-1.3-0.4-2-0.4c-0.6,0-1.2,0.1-1.8,0.3c-0.6-0.8-1.4-1.4-2.4-1.8 C9.9,4,8.8,3.8,7.7,4C6,4.2,4.5,5.1,3.4,6.4C1.2,8.9,0.9,12.5,2.3,15.5c0.7,1.5,1.8,2.8,3.2,3.7c0.6,0.4,1.3,0.6,2,0.7 c0.1,0,0.2,0,0.3,0c0.6,0,1.2-0.2,1.8-0.5c0.5-0.3,1-0.7,1.4-1.1c-1.3-0.6-2.4-1.6-3.1-2.9c-0.3-0.5-0.4-1-0.4-1.6 c0-1.2,0.5-2.2,1.4-3c1.2-1.1,3-1.3,4.4-0.4c-0.1,0.5-0.1,1,0,1.5c0.3,1.3,1,2.4,2,3.3c0.6,0.5,1.2,0.9,1.9,1.2 c0.7,0.3,1.5,0.4,2.2,0.2c0.1,0,0.1,0,0.2,0c1.7-0.3,3.1-1.3,4-2.8C23.2,13.7,22.8,11.6,21.5,10.2z M17,17.4 c-0.5,0.2-1,0.1-1.5-0.1c-0.5-0.2-0.9-0.6-1.2-1.1c-0.8-1.2-1.2-2.6-1.2-4.1c0-0.4,0-0.9,0.1-1.3c0.9-0.5,2-0.3,2.8,0.5 c0.2,0.2,0.4,0.4,0.5,0.7c0.6,1.1,0.4,2.5-0.5,3.4C17.6,16.8,17.3,17.1,17,17.4z"></path></svg>`;
    const googleIcon = `<svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M21.2,9.7l-2.2-1.3l-3.3,3.3l3.3,3.3l2.2-1.2c0.7-0.4,1.2-1.2,1.2-2.1C22.4,10.9,21.9,10.1,21.2,9.7z M3.8,21.3 l8.9-5.1L3.8,2.7c-0.5-0.3-1.1-0.2-1.6,0.1C1.8,3.2,1.5,3.8,1.5,4.5v15c0,0.7,0.3,1.3,0.8,1.7C2.7,21.5,3.3,21.6,3.8,21.3z M15.7,14.7l-3.3-3.3l-3.3,3.3l3.3,3.3L15.7,14.7z M12.4,8.3L9.1,5l3.3-3.3l3.3,3.3L12.4,8.3z"></path></svg>`;

    // --- ENLACES ACTUALIZADOS CON TUS VERSIONES LOCALIZADAS ---
    const UBER_APP_STORE_URL = 'https://apps.apple.com/ec/app/uber-autos-motos-taxi-y-m%C3%A1s/id368677368';
    const UBER_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.ubercab&hl=es_EC';

    const appStoreButton = createAppButton(UBER_APP_STORE_URL, appleIcon, 'Descargar en', 'App Store');
    const playStoreButton = createAppButton(UBER_PLAY_STORE_URL, googleIcon, 'DISPONIBLE EN', 'Google Play');

    appButtons.appendChild(appStoreButton);
    appButtons.appendChild(playStoreButton);
    appColumn.appendChild(appTitle);
    appColumn.appendChild(appButtons);
    
    mainGrid.appendChild(brandColumn);
    mainGrid.appendChild(contactColumn);
    mainGrid.appendChild(appColumn);

    const separator = document.createElement('div');
    separator.className = 'mt-12 pt-8 border-t border-gray-700';
    const copyrightDiv = document.createElement('p');
    copyrightDiv.className = 'text-center text-gray-500 text-sm';
    copyrightDiv.textContent = `© ${new Date().getFullYear()} TransiTrack. Todos los derechos reservados.`;
    
    container.appendChild(mainGrid);
    container.appendChild(separator);
    container.appendChild(copyrightDiv);
    footerElement.appendChild(container);
    
    return {
        element: footerElement,
        cleanup: null
    };
};

export default Footer;