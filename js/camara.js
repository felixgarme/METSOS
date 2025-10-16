// FPS camera movement (movimiento en XZ) + joystick móvil (solo mobile) + gravedad
var app=v3d.apps[0],camera=app.camera,controls=app.controls;if(controls&&controls.enabled!==undefined)controls.enabled=false;
// ajustes
var moveSpeed=5.0,turnSpeed=0.002,touchTurnSpeed=0.005,joystickRadius=80,joystickAreaWidthPct=0.38;
var keys={},yaw=0,pitch=0,isPointerLocked=false;
// vectores
var forwardBase=new v3d.Vector3(0,0,-1),rightBase=new v3d.Vector3(1,0,0),tmpForward=new v3d.Vector3(),tmpRight=new v3d.Vector3(),moveVec=new v3d.Vector3();
// gravedad
var gravity=-9.8;       // m/s²
var velocityY=0;        // velocidad vertical
var groundY=-5;          // altura del suelo
var onGround=false;
// teclado
document.addEventListener('keydown',function(e){keys[e.code]=true;});
document.addEventListener('keyup',function(e){keys[e.code]=false;});
// pointer lock / mouse (solo si no es touch)
if(!('ontouchstart' in window)){
  document.body.addEventListener('click',function(){document.body.requestPointerLock();});
  document.addEventListener('pointerlockchange',function(){isPointerLocked=!!document.pointerLockElement;});
  document.addEventListener('mousemove',function(e){if(!isPointerLocked)return;yaw-=e.movementX*turnSpeed;pitch-=e.movementY*turnSpeed;var max=Math.PI/2-0.01;pitch=Math.max(-max,Math.min(max,pitch));});
}
// --- JOYSTICK (solo para touch devices) ---
var isTouch=('ontouchstart'in window);
var joystick=null,knob=null,joystickCenter={x:0,y:0},activeTouchId=null,joystickValue={x:0,y:0};
if(isTouch){
  joystick=document.createElement('div');knob=document.createElement('div');
  joystick.style.position='fixed';joystick.style.left='12px';joystick.style.bottom='12px';
  joystick.style.width=(joystickRadius*2)+'px';joystick.style.height=(joystickRadius*2)+'px';joystick.style.borderRadius='50%';
  joystick.style.background='rgba(0,0,0,0.25)';joystick.style.zIndex='9999';joystick.style.touchAction='none';
  knob.style.position='absolute';knob.style.left=(joystickRadius-28)+'px';knob.style.top=(joystickRadius-28)+'px';
  knob.style.width='56px';knob.style.height='56px';knob.style.borderRadius='50%';knob.style.background='rgba(255,255,255,0.9)';
  knob.style.boxShadow='0 2px 6px rgba(0,0,0,0.3)';knob.style.touchAction='none';
  joystick.appendChild(knob);document.body.appendChild(joystick);
  function updateJoystickPos(){var rect=joystick.getBoundingClientRect();joystickCenter.x=rect.left+rect.width/2;joystickCenter.y=rect.top+rect.height/2;}
  window.addEventListener('resize',updateJoystickPos);updateJoystickPos();
  function onTouchStart(e){for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];if(activeTouchId===null&&t.clientX<window.innerWidth*joystickAreaWidthPct){activeTouchId=t.identifier;var left=Math.max(12,Math.min(t.clientX-joystickRadius,window.innerWidth*joystickAreaWidthPct-joystickRadius*2-12));joystick.style.left=left+'px';joystick.style.bottom=Math.max(12,(window.innerHeight-t.clientY)-joystickRadius)+'px';updateJoystickPos();e.preventDefault();}}}
  function onTouchMove(e){for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];if(t.identifier===activeTouchId){var dx=t.clientX-joystickCenter.x,dy=t.clientY-joystickCenter.y;var nx=dx/joystickRadius,ny=dy/joystickRadius;ny=-ny;var len=Math.sqrt(nx*nx+ny*ny);if(len>1){nx/=len;ny/=len;}var dead=0.05;joystickValue.x=Math.abs(nx)>dead?nx:0;joystickValue.y=Math.abs(ny)>dead?ny:0;knob.style.left=(joystickRadius-28+joystickValue.x*(joystickRadius-28))+'px';knob.style.top=(joystickRadius-28+-joystickValue.y*(joystickRadius-28))+'px';e.preventDefault();}}}
  function onTouchEnd(e){for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];if(t.identifier===activeTouchId){activeTouchId=null;joystickValue.x=0;joystickValue.y=0;knob.style.left=(joystickRadius-28)+'px';knob.style.top=(joystickRadius-28)+'px';e.preventDefault();}}}
  document.addEventListener('touchstart',onTouchStart,{passive:false});
  document.addEventListener('touchmove',onTouchMove,{passive:false});
  document.addEventListener('touchend',onTouchEnd,{passive:false});
  document.addEventListener('touchcancel',onTouchEnd,{passive:false});
}
// --- ROTACIÓN con touch (zona derecha) ---
var rotatingId=null,prevRotPos={x:0,y:0};
if(isTouch){
  document.addEventListener('touchstart',function(e){for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];if(t.clientX>=window.innerWidth*joystickAreaWidthPct&&rotatingId===null){rotatingId=t.identifier;prevRotPos.x=t.clientX;prevRotPos.y=t.clientY;}}},{passive:false});
  document.addEventListener('touchmove',function(e){for(var i=0;i<e.changedTouches.length;i++){var t=e.changedTouches[i];if(t.identifier===rotatingId){var dx=t.clientX-prevRotPos.x,dy=t.clientY-prevRotPos.y;yaw-=dx*touchTurnSpeed;pitch-=dy*touchTurnSpeed;var max=Math.PI/2-0.01;pitch=Math.max(-max,Math.min(max,pitch));prevRotPos.x=t.clientX;prevRotPos.y=t.clientY;e.preventDefault();}}},{passive:false});
  document.addEventListener('touchend',function(e){for(var i=0;i<e.changedTouches.length;i++){if(e.changedTouches[i].identifier===rotatingId)rotatingId=null;}},{passive:false});
  document.addEventListener('touchcancel',function(e){for(var i=0;i<e.changedTouches.length;i++){if(e.changedTouches[i].identifier===rotatingId)rotatingId=null;}},{passive:false});
}
// --- LOOP ---
app.renderCallbacks.push(function(delta){
  var moveX=0,moveZ=0;
  if(keys['KeyW'])moveZ+=1;
  if(keys['KeyS'])moveZ-=1;
  if(keys['KeyA'])moveX-=1;
  if(keys['KeyD'])moveX+=1;
  if(isTouch){moveX+=joystickValue.x;moveZ+=joystickValue.y;}
  var yawEuler=new v3d.Euler(0,yaw,0,'YXZ');
  tmpForward.copy(forwardBase).applyEuler(yawEuler);tmpForward.y=0;tmpForward.normalize();
  tmpRight.copy(rightBase).applyEuler(yawEuler);tmpRight.y=0;tmpRight.normalize();
  moveVec.set(0,0,0);
  if(moveZ!==0)moveVec.addScaledVector(tmpForward,moveZ);
  if(moveX!==0)moveVec.addScaledVector(tmpRight,moveX);
  if(moveVec.lengthSq()>0){moveVec.normalize();camera.position.addScaledVector(moveVec,moveSpeed*delta);}
  // === GRAVEDAD ===
  velocityY+=gravity*delta;camera.position.y+=velocityY*delta;
  if(camera.position.y<=groundY){camera.position.y=groundY;velocityY=0;onGround=true;}else{onGround=false;}
  // === ROTACIÓN ===
  camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;
});
