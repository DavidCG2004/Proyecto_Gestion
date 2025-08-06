import imagen1 from '../../assets/imagen1.jfif';
import imagen2 from '../../assets/imagen2.jpg';
import imagen3 from '../../assets/imagen3.jpg';
import imagen4 from '../../assets/imagen4.png';

const Main = () => {
    const images = [
        imagen1,
        imagen2,
        imagen3,
        imagen4,
    ];

    let currentIndex = 0;

    const mainSection = document.createElement('section');
    mainSection.id = 'inicio'; // ID para el enlace "Inicio" del header
    mainSection.className = 'relative h-[60vh] md:h-[80vh] w-full overflow-hidden text-white shadow-lg';

    // --- Contenedor del Slider (para las imágenes) ---
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'absolute top-0 left-0 w-full h-full';
    
    const sliderTrack = document.createElement('div');
    sliderTrack.className = 'h-full w-full flex transition-transform duration-700 ease-in-out';
    
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'w-full h-full object-cover flex-shrink-0';
        img.alt = "Imagen de transporte público en la ciudad";
        
        // --- MEJORA DE RENDIMIENTO ---
        // La primera imagen se carga de inmediato, las demás de forma diferida.
        if (index > 0) {
            img.loading = 'lazy';
        }
        img.decoding = 'async'; // Decodificar de forma asíncrona
        
        sliderTrack.appendChild(img);
    });

    sliderContainer.appendChild(sliderTrack);

    // --- Superposición con el Texto ---
    const textOverlay = document.createElement('div');
    textOverlay.className = 'absolute inset-0 flex flex-col items-center justify-center text-center bg-black/40 p-6';
    
    const title = document.createElement('h1');
    title.className = 'text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg';
    title.textContent = 'Bienvenido a TransiTrack';
    
    const subtitle = document.createElement('p');
    subtitle.className = 'text-lg md:text-2xl max-w-3xl text-gray-200 drop-shadow-md';
    // Mensaje mejorado y más largo
    subtitle.textContent = 'Tu compañero inteligente para el transporte público. Encuentra rutas en tiempo real, consulta horarios y recibe notificaciones para viajar por la ciudad sin complicaciones.';

    textOverlay.appendChild(title);
    textOverlay.appendChild(subtitle);
    
    // --- Puntos de Navegación del Slider ---
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3';

    images.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'w-3 h-3 rounded-full bg-white/50 backdrop-blur-sm transition-all duration-300';
        dot.setAttribute('aria-label', `Ir a la imagen ${index + 1}`);
        dot.addEventListener('click', () => {
            currentIndex = index;
            showSlide();
        });
        dotsContainer.appendChild(dot);
    });
    
    // --- Lógica del Slider ---
    const updateDots = () => {
        const dots = dotsContainer.children;
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.toggle('bg-white', i === currentIndex);
            dots[i].classList.toggle('bg-white/50', i !== currentIndex);
        }
    };

    const showSlide = () => {
        sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateDots();
    };

    const nextSlide = () => {
        currentIndex = (currentIndex + 1) % images.length;
        showSlide();
    };
    
    // Iniciar el slider
    setTimeout(showSlide, 0); // Llama una vez para establecer el estado inicial
    const intervalId = setInterval(nextSlide, 5000); // Cambia de imagen cada 5 segundos

    // Ensamblar todo
    mainSection.appendChild(sliderContainer);
    mainSection.appendChild(textOverlay);
    mainSection.appendChild(dotsContainer);
    
    // Devolvemos el elemento y una función de limpieza para el intervalo
    return {
        element: mainSection,
        cleanup: () => clearInterval(intervalId)
    };
};

export default Main;