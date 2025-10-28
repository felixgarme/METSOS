/* verge3d-vista-libre.js

Crea un botón blanco con letra azul que dice "vista libre"
Ubicado centrado en la parte inferior de la ventana (fixed)
Al hacer click ejecuta `v3d.puzzles.procedures["libre"]();` y oculta el botón.
Puedes volver a mostrarlo llamando a `botonLibre(true);`

Cómo usar:
1. Incluye este archivo en tu proyecto Verge3D.
2. Asegúrate de tener definida la función `libre` en tus puzzles.
3. Para mostrar/ocultar el botón desde tu app, usa `botonLibre(true/false)`.
*/

(function(){
    // evita crear el botón más de una vez
    if (document.getElementById('v3d-vista-libre-btn')) return;

    // crear botón
    var btn = document.createElement('button');
    btn.id = 'v3d-vista-libre-btn';
    btn.type = 'button';
    btn.textContent = 'vista libre';
    btn.setAttribute('aria-label', 'Activar vista libre');

    // estilos inline base
    btn.style.position = 'fixed';
    btn.style.left = '50%';
    btn.style.bottom = '22px';
    btn.style.transform = 'translateX(-50%)';
    btn.style.background = '#ffffff';
    btn.style.color = '#0d6efd';
    btn.style.border = 'none';
    btn.style.padding = '10px 18px';
    btn.style.fontSize = '16px';
    btn.style.fontWeight = '600';
    btn.style.borderRadius = '8px';
    btn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = '9999';
    btn.style.transition = 'transform 160ms ease, box-shadow 160ms ease';

    // click: ejecutar función libre y ocultar botón
    btn.addEventListener('click', function(){
        btn.style.transform = 'translateX(-50%) scale(0.98)';
        setTimeout(function(){ btn.style.transform = 'translateX(-50%)'; }, 120);

        if (window.v3d && v3d.puzzles && v3d.puzzles.procedures && typeof v3d.puzzles.procedures["libre"] === 'function') {
            v3d.puzzles.procedures["libre"]();
        } else {
            console.warn('Procedimiento "libre" no encontrado en v3d.puzzles.procedures');
        }

        botonLibre(false);
    });

    // accesibilidad con teclado
    btn.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });

    // estilos CSS
    var css = '\n#v3d-vista-libre-btn:focus{ outline: 3px solid rgba(13,110,253,0.18); outline-offset: 3px; }\n'
            + '#v3d-vista-libre-btn:hover{ transform: translateX(-50%) translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,0.14); }\n';

    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // función global para mostrar/ocultar el botón
    window.botonLibre = function(mostrar){
        var b = document.getElementById('v3d-vista-libre-btn');
        if (!b) return;
        b.style.display = mostrar ? 'block' : 'none';
    };

    // agregar al body
    document.body.appendChild(btn);
})();
