// 1. Comprobar si los botones ya fueron creados (VERSIÓN B)
if (!window.botonesVBCreados) {

    // --- A. INYECTAR CSS PARA LOS BOTONES (VERSIÓN B) ---
    // (Solo se ejecuta una vez)
    const cssId = 'v3d-pro-button-styles-VB'; // <-- CAMBIO: ID de estilo único
    if (!document.getElementById(cssId)) {
        const style = document.createElement('style');
        style.id = cssId;
        style.innerHTML = `
            /* Define la animación de aparición */
            @keyframes fadeInSlideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Animación para la flecha del botón */
            @keyframes fadeInArrow {
                from { opacity: 0; right: -15px; }
                to { opacity: 1; right: -25px; }
            }

            /* Contenedor de los botones (VERSIÓN B) */
            #miContenedorBotonesVB { /* <-- CAMBIO */
                position: absolute;
                top: 50vh; 
                left: 40px; 
                z-index: 100;
                display: none; /* Oculto por defecto */
                flex-direction: column;
                gap: 10px;
                transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
            }

            /* Estilo profesional y animado del botón (Clases Reutilizadas) */
            .v3d-pro-button {
                background-color: #ffffff;
                color: #333333;
                border: 2px solid transparent; 
                border-radius: 8px;
                padding: 12px 18px;
                font-size: 14px;
                font-family: Arial, sans-serif;
                font-weight: 600;
                cursor: pointer;
                text-align: left;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease-in-out, border-color 0.3s ease;
                position: relative;
            }

            .v3d-pro-button:not(.disabled):not(.active):hover {
                background-color: #f5f5f5;
                box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
                transform: translateY(-2px); 
            }

            .v3d-pro-button:not(.disabled):active {
                transform: translateY(0) scale(0.98);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            /* --- ESTADOS DE BOTÓN (Clases Reutilizadas) --- */

            .v3d-pro-button.disabled {
                background-color: #f0f0f0;
                color: #999999;
                cursor: not-allowed;
                opacity: 0.7;
                filter: blur(1px);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }

            .v3d-pro-button.completed {
                background-color: #f0fff0;
                border-color: #5cb85c;
                color: #3c763d;
            }
            
            .v3d-pro-button.active {
                border-color: #007bff; 
                transform: scale(1.03); 
                box-shadow: 0 6px 16px rgba(0, 123, 255, 0.2);
                opacity: 1;
                filter: none;
            }

            .v3d-pro-button.active::after {
                content: '‹'; 
                position: absolute;
                right: -25px; 
                top: 50%;
                transform: translateY(-50%);
                font-size: 30px;
                font-weight: bold;
                color: #007bff; 
                animation: fadeInArrow 0.5s ease;
            }

            /* --- BOTÓN 'SIGUIENTE' (FLECHA) (VERSIÓN B) --- */
            #v3d-next-button-VB { /* <-- CAMBIO */
                position: absolute;
                bottom: 20px;
                right: 20px;
                z-index: 101;
                width: 50px;
                height: 50px;
                background-color: #ffffff;
                border-radius: 50%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                display: none;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            #v3d-next-button-VB:hover { /* <-- CAMBIO */
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
            }
            #v3d-next-button-VB::after { /* <-- CAMBIO */
                content: '›';
                font-size: 36px;
                font-weight: bold;
                color: #333;
                line-height: 50px;
                padding-left: 3px;
            }
        `;
        document.head.appendChild(style);
    }

    // --- B. CONFIGURACIÓN (VERSIÓN B) ---
    window.nivelDesbloqueadoVB = 0; // <-- CAMBIO

    // --- CAMBIO: Lista de botones para el Menú B ---
    // (Asegúrate de que 'vB1', 'vB2', etc. existan en tus puzzles)
    const botonesConfigVB = [ 
        { texto: 'Zona B - Punto 1', proc: 'vB1' },
        { texto: 'Zona B - Punto 2', proc: 'vB2' }

    ];
    
    const contenedorId = 'miContenedorBotonesVB'; // <-- CAMBIO

    // --- C. CREAR CONTENEDOR ---
    const container = document.createElement('div');
    container.id = contenedorId;

    // --- D. CREAR CADA BOTÓN ---
    botonesConfigVB.forEach((item, index) => { // <-- CAMBIO
        
        const btn = document.createElement('button');
        btn.innerText = item.texto;
        btn.className = 'v3d-pro-button';
        btn.dataset.index = index;

        if (index > window.nivelDesbloqueadoVB) { // <-- CAMBIO
            btn.classList.add('disabled');
        }

        // === Evento click (apunta a funciones VB) ===
        btn.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            
            const nombreProc = item.proc; 
            const clickedIndex = index;
            
            if (v3d.puzzles && v3d.puzzles.procedures && typeof v3d.puzzles.procedures[nombreProc] === 'function') {
                v3d.puzzles.procedures[nombreProc](); 
                console.log(`Procedimiento de puzzle llamado: ${nombreProc}`);
                
                // --- CAMBIO: Llaman a las funciones 'VB' ---
                window.desbloquearSiguienteNivelVB(clickedIndex);
                window.actualizarEstadoBotonesVB(clickedIndex);

            } else {
                console.warn(`El procedimiento de puzzle "${nombreProc}" no se encontró.`);
            }
        });

        container.appendChild(btn);
    });
    
    // --- E. CREAR BOTÓN 'SIGUIENTE' (FLECHA) ---
    const nextButton = document.createElement('div');
    nextButton.id = 'v3d-next-button-VB'; // <-- CAMBIO
    nextButton.addEventListener('click', function() {
        const allButtons = document.querySelectorAll(`#${contenedorId} .v3d-pro-button`);
        
        const targetButton = allButtons[window.nivelDesbloqueadoVB]; // <-- CAMBIO
        
        if (targetButton && !targetButton.classList.contains('disabled')) {
            targetButton.click(); 
        }
    });

    // --- F. AÑADIR CONTENEDORES A LA PÁGINA ---
    const mainContainer = document.getElementById('v3d-container');
    if (mainContainer) {
        mainContainer.appendChild(container);
        mainContainer.appendChild(nextButton);
    } else {
        document.body.appendChild(container);
        document.body.appendChild(nextButton);
    }

    // --- G. NUEVAS FUNCIONES DE CONTROL GLOBAL (VERSIÓN B) ---

    // === CAMBIO: 'actualizarEstadoBotonesVB' ===
    window.actualizarEstadoBotonesVB = function(centroIndex) {
        const cont = document.getElementById(contenedorId);
        if (!cont) return;

        const allButtons = cont.querySelectorAll('.v3d-pro-button');
        let allCompleted = true;
        let offsetTop = 0;
        const gap = 10; 

        if (centroIndex === undefined) {
            centroIndex = window.nivelDesbloqueadoVB; // <-- CAMBIO
        }

        if (centroIndex >= allButtons.length && allButtons.length > 0) {
            centroIndex = allButtons.length - 1;
        }

        let activeButton = allButtons[centroIndex]; 

        // --- Lógica de Estado (Disabled/Completed/Active) ---
        allButtons.forEach((btn, index) => {
            btn.classList.remove('disabled', 'completed', 'active');
            btn.style.display = 'block'; 

            if (index < window.nivelDesbloqueadoVB) { // <-- CAMBIO
                btn.classList.add('completed');
            } else if (index > window.nivelDesbloqueadoVB) { // <-- CAMBIO
                btn.classList.add('disabled'); 
                allCompleted = false;
            } else {
                allCompleted = false;
            }
            
            if (index === centroIndex) {
                btn.classList.add('active');
            }
        });

        // --- LÓGICA DE CENTRADO (SCROLL) ---
        if (activeButton) {
            offsetTop = 0; 
            for (let i = 0; i < allButtons.length; i++) {
                const btn = allButtons[i];
                if (i < centroIndex) {
                    offsetTop += btn.offsetHeight + gap;
                } else {
                    break;
                }
            }
            
            const centeringOffset = offsetTop + (activeButton.offsetHeight / 2);
            cont.style.transform = `translateY(-${centeringOffset}px)`;
        }

        // Ocultar la flecha 'siguiente' si todo está completo
        const nextBtn = document.getElementById('v3d-next-button-VB'); // <-- CAMBIO
        if (nextBtn) {
            if (allCompleted) {
                nextBtn.style.display = 'none';
            } else if (cont.style.display === 'flex') {
                nextBtn.style.display = 'flex';
            }
        }
    };

    // === CAMBIO: 'desbloquearSiguienteNivelVB' ===
    window.desbloquearSiguienteNivelVB = function(indexCompletado) {
        const nuevoNivel = indexCompletado + 1;
        if (nuevoNivel > window.nivelDesbloqueadoVB) { // <-- CAMBIO
            window.nivelDesbloqueadoVB = nuevoNivel; // <-- CAMBIO
        }
    };

    // --- H. FUNCIÓN DE CONTROL GLOBAL (VERSIÓN B) ---
    // === CAMBIO: 'toggleBotonesVB' ===
    window.toggleBotonesVB = function(mostrar) {
        const cont = document.getElementById(contenedorId);
        const nextBtn = document.getElementById('v3d-next-button-VB'); // <-- CAMBIO
        if (!cont || !nextBtn) return; 

        if (mostrar) {
            cont.style.display = 'flex';
            
            window.actualizarEstadoBotonesVB(); // <-- CAMBIO
            
            const allButtons = cont.getElementsByClassName('v3d-pro-button');
            
            for (let i = 0; i < allButtons.length; i++) {
                const btn = allButtons[i];
                
                btn.style.opacity = '0';
                btn.style.transform = 'translateY(10px)';
                btn.style.animation = 'none';
                void btn.offsetWidth; 
                const delay = i * 0.07;
                if (btn.classList.contains('active')) {
                    btn.style.transform = 'translateY(10px)'; 
                }
                btn.style.animation = `fadeInSlideUp 0.3s ease-out ${delay}s forwards`;
            }
            
            setTimeout(window.actualizarEstadoBotonesVB, 500); // <-- CAMBIO

        } else {
            cont.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    };

    // --- I. ESTADO INICIAL (OCULTOS) ---
    window.toggleBotonesVB(false); // <-- CAMBIO

    // --- J. MARCAR COMO CREADOS ---
    window.botonesVBCreados = true; // <-- CAMBIO

} // <-- Fin del 'if (!window.botonesVBCreados)'