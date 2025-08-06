// src/pages/landing/LandingWrapper.js - SIN CAMBIOS

import React, { useEffect, useRef } from 'react';
import Landing from './Landing.js';

const LandingWrapper = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const landingParts = Landing();
        
        container.appendChild(landingParts.element);

        return () => {
            if (landingParts.cleanup) {
                landingParts.cleanup();
            }
            container.innerHTML = '';
        };
    }, []);

    return <div ref={containerRef} />;
};

export default LandingWrapper;