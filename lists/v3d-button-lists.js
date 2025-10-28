// ---------------------- LISTAS ----------------------
(function(){
  function init(){
    if(typeof window.createV3DButtonList!=='function'){
      console.warn('createV3DButtonList no está listo, reintentando...');
      return setTimeout(init,100);
    }
    //Botones VA
    const botonesVA=[
      {texto:'Entrada',proc:'vA1'},
      {texto:'Lavado de gases',proc:'vA2'},
      {texto:'Tanques de Nash',proc:'vA3'},
      {texto:'Zona de Ácido',proc:'vA4'}
    ];
    window.createV3DButtonList('VA',botonesVA,{
      containerId:'miContenedorBotonesVA',
      nextButtonId:'v3d-next-button-VA',
      mainContainerId:'v3d-container'
    });
    //Botones VB
    const botonesVB=[
      {texto:'Ducha 1',proc:'vB1'},
      {texto:'Ducha 2',proc:'vB2'},
      {texto:'Ducha 3',proc:'vB3'},
      {texto:'Ducha 4',proc:'vB4'},
      {texto:'Ducha 5',proc:'vB5'},
      {texto:'Ducha 6',proc:'vB6'},
      {texto:'Ducha 7',proc:'vB7'},
      {texto:'Ducha 8',proc:'vB8'},
      {texto:'Vista General',proc:'vBx'}
    ];
    window.createV3DButtonList('VB',botonesVB,{
      containerId:'miContenedorBotonesVB',
      nextButtonId:'v3d-next-button-VB',
      mainContainerId:'v3d-container'
    });

    // ----- NUEVO: Botones VC -----
    const botonesVC=[
      {texto:'Item C 1',proc:'vC1'},
      {texto:'Item C 2',proc:'vC2'},
      {texto:'Item C 3',proc:'vC3'}
    ];
    window.createV3DButtonList('VC',botonesVC,{
      containerId:'miContenedorBotonesVC',
      nextButtonId:'v3d-next-button-VC',
      mainContainerId:'v3d-container'
    });
    // ----- FIN DE LO NUEVO -----


    // Importante: Asegúrate que 'VA' sea la lista inicial
    // y que coincida con v3dListOrder[0] del script principal.
    window.toggleBotonesV3D('VA',true); 
    
    // MODIFICADO:
    console.log('Listas VA, VB y VC creadas correctamente.');
  }

  if(document.readyState==='loading')
    document.addEventListener('DOMContentLoaded',init);
  else init();
})();