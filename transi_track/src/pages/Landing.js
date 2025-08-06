import Header from '../components/Header/Header.js';
import Main from '../components/Main/Main.js';
import Nosotros from '../components/Nosotros/Nosotros.js';
import Servicios from '../components/Servicios/Servicios.js';
import Contacto from '../components/Contacto/Contacto.js';
import Footer from '../components/Footer/Footer.js'; 

const Landing = () => {
    const landingContainer = document.createElement('div');
    
    const headerComponent = Header();
    landingContainer.appendChild(headerComponent.element);

    // Contenido principal de la página
    const pageContent = document.createElement('main');
    pageContent.className = 'page-content';

    const mainComponent = Main();
    const nosotrosComponent = Nosotros();
    const serviciosComponent = Servicios();
    const contactoComponent = Contacto();

    pageContent.appendChild(mainComponent.element);
    pageContent.appendChild(nosotrosComponent.element);
    pageContent.appendChild(serviciosComponent.element);
    pageContent.appendChild(contactoComponent.element);
    
    landingContainer.appendChild(pageContent);

    // --- 2. Añade el Footer al final, fuera del <main> ---
    const footerComponent = Footer();
    landingContainer.appendChild(footerComponent.element);

    // 3. La función de limpieza se mantiene robusta
    return {
        element: landingContainer,
        cleanup: () => {
            if (mainComponent.cleanup) mainComponent.cleanup();
            if (nosotrosComponent.cleanup) nosotrosComponent.cleanup();
            if (serviciosComponent.cleanup) serviciosComponent.cleanup();
            if (contactoComponent.cleanup) contactoComponent.cleanup();
            if (footerComponent.cleanup) footerComponent.cleanup();
        }
    };
};

export default Landing;