// src/components/Contacto/Contacto.js

const Contacto = () => {
    const contactoSection = document.createElement('section');
    contactoSection.id = 'contacto';
    contactoSection.className = 'py-20 bg-white font-sans';

    const container = document.createElement('div');
    container.className = 'container mx-auto px-6';

    const mainGrid = document.createElement('div');
    mainGrid.className = 'grid grid-cols-1 lg:grid-cols-2 gap-16 items-center';

    // --- Columna Izquierda: Formulario y Beneficios ---
    const formColumn = document.createElement('div');

    // --- MEJORA: Beneficios orientados a TransiTrack ---
    const introList = document.createElement('ul');
    introList.className = 'space-y-3 mb-8 text-gray-600';
    const benefits = [
        'Planifica tu viaje con precisión y consulta horarios actualizados.',
        'Recibe notificaciones en tiempo real sobre el estado del servicio.',
        '¿Tienes dudas sobre la app? Nuestro equipo de soporte está para ayudarte.'
    ];
    benefits.forEach(text => {
        const li = document.createElement('li');
        li.className = 'flex items-start';
        const icon = `<svg class="w-5 h-5 text-blue-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>`;
        li.innerHTML = icon + `<span>${text}</span>`;
        introList.appendChild(li);
    });
    
    const formTitle = document.createElement('h2');
    formTitle.className = 'text-3xl font-extrabold text-gray-900 mb-6';
    // Título más adecuado, ya que "Reserva" es para otro tipo de negocio.
    formTitle.textContent = 'Envíanos un Mensaje';

    // El resto del formulario se mantiene igual, es muy funcional.
    const form = document.createElement('form');
    form.action = 'https://formsubmit.co/alexandergarcia212@outlook.com';
    form.method = 'POST';
    form.className = 'space-y-5 bg-gray-50 p-8 rounded-xl shadow-lg';

    const createInput = (name, type, placeholder) => {
        const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
        input.name = name;
        if (type !== 'textarea') input.type = type;
        input.placeholder = placeholder;
        input.required = true;
        input.className = 'block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition';
        if (type === 'textarea') {
            input.rows = 4;
            input.required = false;
        }
        return input;
    };
    
    form.appendChild(createInput('nombre', 'text', 'Nombre Completo'));
    form.appendChild(createInput('correo', 'email', 'Correo Electrónico'));
    form.appendChild(createInput('celular', 'tel', 'Celular'));
    form.appendChild(createInput('observaciones', 'textarea', 'Observaciones'));

    const checkboxWrapper = document.createElement('div');
    checkboxWrapper.className = 'flex items-center gap-3';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'terms';
    checkbox.required = true;
    checkbox.className = 'h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500';
    const checkboxLabel = document.createElement('label');
    checkboxLabel.htmlFor = 'terms';
    checkboxLabel.className = 'text-sm text-gray-600';
    checkboxLabel.textContent = 'Acepto los Términos y Condiciones';
    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(checkboxLabel);
    form.appendChild(checkboxWrapper);

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105';
    submitButton.textContent = 'Enviar';
    form.appendChild(submitButton);

    formColumn.appendChild(introList);
    formColumn.appendChild(formTitle);
    formColumn.appendChild(form);

    // --- La columna del Mapa se mantiene sin cambios ---
    const mapColumn = document.createElement('div');
    mapColumn.className = 'w-full h-96 lg:h-full rounded-xl shadow-2xl overflow-hidden min-h-[400px]';
    const iframe = document.createElement('iframe');
    iframe.src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31729.69632280012!2d-75.61608666730703!3d6.235757385753152!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429a353bb4675%3A0x7246bc6f190e3cc0!2sTransportes%20Ontime!5e0!3m2!1ses-419!2sec!4v1754192062755!5m2!1ses-419!2sec";
    iframe.className = 'w-full h-full';
    iframe.style.border = '0';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    mapColumn.appendChild(iframe);

    mainGrid.appendChild(formColumn);
    mainGrid.appendChild(mapColumn);
    container.appendChild(mainGrid);
    contactoSection.appendChild(container);

    return {
        element: contactoSection,
        cleanup: null
    };
};

export default Contacto;