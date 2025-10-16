// === Botón + cuadro para cambiar el FOV (zoom) de la cámara ===

// Obtener referencia a la cámara actual
var app = v3d.apps[0];
var camera = app.camera;

// Crear contenedor principal
var uiContainer = document.createElement('div');
uiContainer.style.position = 'fixed';
uiContainer.style.top = '20px';
uiContainer.style.right = '20px';
uiContainer.style.zIndex = '10000';
uiContainer.style.fontFamily = 'sans-serif';
document.body.appendChild(uiContainer);

// --- Botón principal ---
var btn = document.createElement('button');
btn.textContent = '🔍 Zoom';
btn.style.padding = '10px 14px';
btn.style.border = 'none';
btn.style.borderRadius = '10px';
btn.style.background = 'rgba(255,255,255,0.9)';
btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
btn.style.fontSize = '16px';
btn.style.cursor = 'pointer';
uiContainer.appendChild(btn);

// --- Cuadro flotante ---
var panel = document.createElement('div');
panel.style.position = 'absolute';
panel.style.top = '50px';
panel.style.right = '0';
panel.style.width = '200px';
panel.style.padding = '10px';
panel.style.borderRadius = '10px';
panel.style.background = 'rgba(0,0,0,0.8)';
panel.style.color = 'white';
panel.style.display = 'none';
panel.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)';
uiContainer.appendChild(panel);

// Etiqueta
var label = document.createElement('div');
label.textContent = 'Campo de visión (FOV)';
label.style.fontSize = '14px';
label.style.marginBottom = '6px';
panel.appendChild(label);

// Slider
var slider = document.createElement('input');
slider.type = 'range';
slider.min = '20';
slider.max = '100';
slider.value = camera.fov.toFixed(0);
slider.style.width = '100%';
panel.appendChild(slider);

// Valor actual
var valLabel = document.createElement('div');
valLabel.textContent = slider.value;
valLabel.style.textAlign = 'center';
valLabel.style.marginTop = '4px';
panel.appendChild(valLabel);

// Evento para abrir/cerrar el panel
btn.addEventListener('click', function() {
  panel.style.display = (panel.style.display === 'none') ? 'block' : 'none';
});

// Actualizar el FOV al mover el deslizador
slider.addEventListener('input', function() {
  var newFov = parseFloat(slider.value);
  camera.fov = newFov;
  camera.updateProjectionMatrix();
  valLabel.textContent = newFov.toFixed(0);
});
