console.log("Imports Change");

// OPTIMIZACION//////////////////////////////////////////////////////////////////////////////////////

app.renderer.setPixelRatio(window.devicePixelRatio * 2); // más alta densidad

import("../js/optimizacion.js");
import("../js/optimizacion2.js");
import("../js/optimizacion3.js");
import("../js/optimizacion4.js");
import("../js/optimizacion5.js");

// CAMARA//////////////////////////////////////////////////////////////////////////////////////

import("../js/RotateObj.js");//Rotar pantalla movil
import("../js/distancia.js");//Distancia de dibujado de la camara
//import("../js/escalaCamara.js");//POV camara
import("../js/camara.js");
// import("../js/person.js");
import("../js/LimiteSuelo.js");
import("../js/zoomCamara.js");//Zoom de la camara MAXIMO

//HERRAMIENTAS//////////////////////////////////////////////////////////////////////////////////////

import("../js/objsInfo.js");//Informacion de los objetos y de la camara
// import("../js/fps.js");//Mostrar los FPS
import("../js/crearTexto.js");//Raycaster para seleccionar objetos

//PROCESO///////////////////////////////////////////////////////////////////////////////////////////

import("../js/Proceso/Proceso1.js");
import("../js/Proceso/ProcesoA.js");
import("../js/Proceso/ProcesoB1.js");
import("../js/Proceso/ProcesoB2.js");
import("../js/Proceso/ProcesoC1.js");
import("../js/Proceso/ProcesoC2.js");
import("../js/Proceso/ProcesoC3.js");
