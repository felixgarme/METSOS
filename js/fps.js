// después de crear tu app y cargar la escena
app.run();

var stats = new v3d.Stats();
app.container.appendChild(stats.dom);

// engancharlo al ciclo de render
app.renderCallbacks.push(function() {
    stats.update();
});
