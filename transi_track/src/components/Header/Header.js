const Header = () => {
    const navLinks = [
        { href: '#', text: 'Inicio' },
        { href: '#nosotros', text: 'Nosotros' },
        { href: '#servicios', text: 'Servicios' },
        { href: '#contacto', text: 'Contacto' },
    ];

    const header = document.createElement('header');
    header.className = 'bg-white/80 backdrop-blur-xl shadow-md sticky top-0 z-50';

    const nav = document.createElement('nav');
    nav.className = 'container mx-auto px-6 py-3 flex justify-between items-center';

    // --- INICIO DE LA MODIFICACIÓN ---
    // Logo
    const logoContainer = document.createElement('div');
    // Se eliminó la clase 'text-gray-800' porque ahora el color viene del degradado
    logoContainer.className = 'text-2xl font-bold'; 
    
    const logoLink = document.createElement('a');
    logoLink.href = '/';
    logoLink.textContent = 'TransiTrack';
    // Se añaden las clases de Tailwind para el efecto de degradado en el texto
    logoLink.className = 'bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent';
    logoContainer.appendChild(logoLink);
    // --- FIN DE LA MODIFICACIÓN ---

    // Menú para escritorio
    const menuContainer = document.createElement('div');
    menuContainer.className = 'hidden md:flex items-center space-x-2';
    
    navLinks.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.text;
        link.className = 'px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200';
        menuContainer.appendChild(link);
    });

    // Botón de "Iniciar Sesión"
    const ctaButton = document.createElement('a');
    ctaButton.href = '/auth';
    ctaButton.textContent = 'Iniciar Sesión';
    ctaButton.className = 'bg-blue-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md';

    // Botón del menú móvil (hamburguesa)
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.className = 'md:hidden text-gray-800 focus:outline-none p-2';
    mobileMenuButton.setAttribute('aria-label', 'Abrir menú de navegación');
    mobileMenuButton.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;

    // Contenedor del menú desplegable móvil
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'mobile-menu';
    mobileMenu.className = 'hidden md:hidden bg-white/95 backdrop-blur-xl absolute top-full left-0 w-full border-t border-gray-200/50';

    navLinks.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.text;
        link.className = 'block text-center py-3 px-4 text-sm text-gray-600 hover:bg-blue-50 transition-colors duration-200';
        mobileMenu.appendChild(link);
    });
    
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuButton.setAttribute('aria-expanded', !mobileMenu.classList.contains('hidden'));
    });

    const rightSideContainer = document.createElement('div');
    rightSideContainer.className = 'flex items-center gap-2';
    rightSideContainer.appendChild(ctaButton);
    rightSideContainer.appendChild(mobileMenuButton);

    nav.appendChild(logoContainer);
    nav.appendChild(menuContainer);
    nav.appendChild(rightSideContainer);

    header.appendChild(nav);
    header.appendChild(mobileMenu);

    return {
        element: header,
        cleanup: null 
    };
};

export default Header;