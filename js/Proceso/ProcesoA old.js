// 1. Comprobar si los botones ya fueron creados
if (!window.botonesVACreados) {

    // --- A. INYECTAR CSS PARA LOS BOTONES ---
    // (Solo se ejecuta una vez)
    const cssId = 'v3d-pro-button-styles';
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

            /* Contenedor de los botones */
            #miContenedorBotonesVA {
                position: absolute;
                top: 50vh; 
                left: 40px; 
                z-index: 100;
                display: none; /* Oculto por defecto */
                flex-direction: column;
                gap: 10px;
                transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
            }

            /* Estilo profesional y animado del botón */
            .v3d-pro-button {
                background-color: #ffffff;
                color: #333333;
                border: 2px solid transparent; /* Borde base (aumentado a 2px) */
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

            /* --- ESTADOS DE BOTÓN --- */

            /* --- CAMBIO: Botones futuros (no vistos) ahora son borrosos --- */
            .v3d-pro-button.disabled {
                background-color: #f0f0f0;
                color: #999999;
                cursor: not-allowed;
                opacity: 0.7;
                filter: blur(1px);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }

            /* --- CAMBIO: Botones completados (vistos) ahora están nítidos --- */
            .v3d-pro-button.completed {
                background-color: #f0fff0;
                border-color: #5cb85c;
                color: #3c763d;
                /* Se quitaron opacity y filter */
            }
            
            /* --- BOTÓN ACTIVO --- */
            .v3d-pro-button.active {
                border-color: #007bff; /* Borde azul brillante */
                transform: scale(1.03); /* Un poco más grande */
                box-shadow: 0 6px 16px rgba(0, 123, 255, 0.2);
                /* Asegura que sea nítido (anula el blur de .disabled si se activa) */
                opacity: 1;
                filter: none;
            }

            /* Flecha a la derecha del botón activo */
            .v3d-pro-button.active::after {
                content: '‹'; /* Flecha izquierda, apuntando al botón */
                position: absolute;
                right: -25px; /* Posición a la derecha del botón */
                top: 50%;
                transform: translateY(-50%);
                font-size: 30px;
                font-weight: bold;
                color: #007bff; /* Color azul */
                animation: fadeInArrow 0.5s ease;
            }

            /* --- BOTÓN 'SIGUIENTE' (FLECHA) --- */
            #v3d-next-button {
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
            #v3d-next-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
            }
            #v3d-next-button::after {
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

    // --- B. CONFIGURACIÓN ---
    window.nivelDesbloqueadoVA = 0;

    const botonesConfig = [
        { texto: 'Entrada', proc: 'vA1' },
        { texto: 'Vista 2',  proc: 'vA2' },
        { texto: 'Vista 3',  proc: 'vA3' },
        { texto: 'Vista 4',  proc: 'vA4' },
        { texto: 'Vista 5',  proc: 'vA5' },
        { texto: 'Vista 6',  proc: 'vA6' },
        { texto: 'Vista 7',  proc: 'vA7' }
    ];
    
    const contenedorId = 'miContenedorBotonesVA';

    // --- C. CREAR CONTENEDOR ---
    const container = document.createElement('div');
    container.id = contenedorId;

    // --- D. CREAR CADA BOTÓN ---
    botonesConfig.forEach((item, index) => {
        
        const btn = document.createElement('button');
        btn.innerText = item.texto;
        btn.className = 'v3d-pro-button';
        btn.dataset.index = index;

        if (index > window.nivelDesbloqueadoVA) {
            btn.classList.add('disabled');
        }

        // === CAMBIO EN EL EVENTO CLICK ===
        btn.addEventListener('click', function() {
            if (this.classList.contains('disabled')) return;
            
            const nombreProc = item.proc; 
            const clickedIndex = index; // Guardamos el índice del botón clickeado
            
            if (v3d.puzzles && v3d.puzzles.procedures && typeof v3d.puzzles.procedures[nombreProc] === 'function') {
                v3d.puzzles.procedures[nombreProc](); 
                console.log(`Procedimiento de puzzle llamado: ${nombreProc}`);
                
                // 1. Actualiza el *progreso* (desbloquea el siguiente)
                window.desbloquearSiguienteNivelVA(clickedIndex);

                // 2. Actualiza la *vista* (centra en el botón clickeado)
                window.actualizarEstadoBotonesVA(clickedIndex);

            } else {
                console.warn(`El procedimiento de puzzle "${nombreProc}" no se encontró.`);
            }
        });

        container.appendChild(btn);
    });
    
    // --- E. CREAR BOTÓN 'SIGUIENTE' (FLECHA) ---
    const nextButton = document.createElement('div');
    nextButton.id = 'v3d-next-button';
    nextButton.addEventListener('click', function() {
        const allButtons = document.querySelectorAll(`#${contenedorId} .v3d-pro-button`);
        // El target es el *siguiente* botón desbloqueado
        const targetButton = allButtons[window.nivelDesbloqueadoVA]; 
        
        if (targetButton && !targetButton.classList.contains('disabled')) {
            targetButton.click(); // Simula un clic en el siguiente
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

    // --- G. NUEVAS FUNCIONES DE CONTROL GLOBAL ---

    // === CAMBIO: Acepta un 'centroIndex' y muestra botones futuros borrosos ===
    window.actualizarEstadoBotonesVA = function(centroIndex) {
        const cont = document.getElementById(contenedorId);
        if (!cont) return;

        const allButtons = cont.querySelectorAll('.v3d-pro-button');
        let allCompleted = true;
        let offsetTop = 0;
        const gap = 10; // El 'gap' definido en el CSS

        // Si no se especifica un botón para centrar (ej. al abrir el menú),
        // centramos en el botón del progreso actual.
        if (centroIndex === undefined) {
            centroIndex = window.nivelDesbloqueadoVA;
        }

        // Asegurarse de que centroIndex no se pase del límite
        if (centroIndex >= allButtons.length && allButtons.length > 0) {
            centroIndex = allButtons.length - 1; // Centrar en el último
        }

        let activeButton = allButtons[centroIndex]; // El botón que queremos centrar

        // --- Lógica de Estado (Disabled/Completed/Active) ---
        allButtons.forEach((btn, index) => {
            btn.classList.remove('disabled', 'completed', 'active');
            btn.style.display = 'block'; // Asegura que todos sean visibles

            // 1. Aplicar estado de PROGRESO (usa la variable global)
            if (index < window.nivelDesbloqueadoVA) {
                btn.classList.add('completed');
            } else if (index > window.nivelDesbloqueadoVA) {
                btn.classList.add('disabled'); // <-- AHORA ESTOS SON VISIBLES Y BORROSOS
                allCompleted = false;
            } else {
                // Es el botón actual de progreso
                allCompleted = false;
            }
            
            // 2. Aplicar estado ACTIVO (usa el botón clickeado)
            if (index === centroIndex) {
                btn.classList.add('active');
            }
        });

        // --- LÓGICA DE CENTRADO (SCROLL) ---
        if (activeButton) {
            offsetTop = 0; // Resetear
            // 1. Calcular altura de TODOS los botones anteriores al botón ACTIVO
            for (let i = 0; i < allButtons.length; i++) {
                const btn = allButtons[i];
                if (i < centroIndex) {
                    // Ahora simplemente sumamos la altura de todos los botones anteriores
                    offsetTop += btn.offsetHeight + gap;
                } else {
                    break;
                }
            }
            
            // 2. El offset es la altura anterior + la mitad del botón activo
            const centeringOffset = offsetTop + (activeButton.offsetHeight / 2);
            
            // 3. Aplicar el transform al contenedor
            cont.style.transform = `translateY(-${centeringOffset}px)`;
        }
        // --- FIN LÓGICA DE CENTRADO ---

        // Ocultar la flecha 'siguiente' si todo está completo
        const nextBtn = document.getElementById('v3d-next-button');
        if (nextBtn) {
            if (allCompleted) {
                nextBtn.style.display = 'none';
            } else if (cont.style.display === 'flex') { // Mostrar si el menú está visible
                nextBtn.style.display = 'flex';
            }
        }
    };

    // === CAMBIO: Esta función SÓLO actualiza el progreso, no la UI ===
    window.desbloquearSiguienteNivelVA = function(indexCompletado) {
        const nuevoNivel = indexCompletado + 1;
        // Solo actualizar si estamos avanzando
        if (nuevoNivel > window.nivelDesbloqueadoVA) {
            window.nivelDesbloqueadoVA = nuevoNivel;
        }
        // El evento 'click' se encarga de llamar a ambas funciones.
    };

    // --- H. FUNCIÓN DE CONTROL GLOBAL (MODIFICADA) ---
    window.toggleBotonesVA = function(mostrar) {
        const cont = document.getElementById(contenedorId);
        const nextBtn = document.getElementById('v3d-next-button');
        if (!cont || !nextBtn) return; 

        if (mostrar) {
            cont.style.display = 'flex';
            
            // Al abrir, centrar en el nivel de progreso actual (no se pasa índice)
            window.actualizarEstadoBotonesVA(); 
            
            const allButtons = cont.getElementsByClassName('v3d-pro-button');
            
            // Animar cada botón VISIBLE
            for (let i = 0; i < allButtons.length; i++) {
                const btn = allButtons[i];
                
                // (Se quitó el chequeo de 'display: none', ahora todos animan)
                
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
            
            // Forzar que el centrado y estado 'active' se aplique DESPUÉS de la animación
            // Llama sin argumento para centrar en el progreso actual.
            setTimeout(window.actualizarEstadoBotonesVA, 500);

        } else {
            // Ocultar ambos
            cont.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    };

    // --- I. ESTADO INICIAL (OCULTOS) ---
    window.toggleBotonesVA(false);

    // --- J. MARCAR COMO CREADOS ---
    window.botonesVACreados = true;

} // <-- Fin del 'if (!window.botonesVACreados)'