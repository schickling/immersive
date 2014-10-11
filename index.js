var dpr = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
var width = window.innerWidth;
var height = window.innerHeight;
var dprHeight = height * dpr;
var dprWidth = width * dpr;

var dprHeight = height * dpr;
var dprWidth = width * dpr;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
camera.position.x = 0.1;

var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(dprWidth, dprHeight);
renderer.autoClear = false;

var hmdOptions = {
  hResolution : dprWidth,
  vResolution : dprHeight,
  hScreenSize: 0.14976,
  vScreenSize: 0.0936,
  interpupillaryDistance: 0.064,
  lensSeparationDistance: 0.064,
  eyeToScreenDistance: 0.041,
  distortionK : [1.0, 0.22, 0.24, 0.0],
  chromaAbParameter: [ 0.996, -0.004, 1.014, 0.0]
};

effect = new THREE.OculusRiftEffect(renderer, {worldScale: 100, HMD: hmdOptions});
effect.setSize(dprWidth, dprHeight);
effect.setSize(dprWidth, dprHeight);

effect.preLeftRender = function() {
  material.map = leftTexture;
};

effect.preRightRender = function() {
  material.map = rightTexture;
};

var element = renderer.domElement;
document.body.appendChild(element);

//var parameters = {
//minFilter: THREE.LinearFilter,
//magFilter: THREE.LinearFilter,
//format: THREE.RGBFormat,
//stencilBufferL: false
//};

//var renderTarget = new THREE.WebGLRenderTarget(0.5 * width, height, parameters);
//var leftBuffer = renderTarget;
//var rightBuffer = renderTarget.clone();



var leftTexture = THREE.ImageUtils.loadTexture('images/left.jpg');
var rightTexture = THREE.ImageUtils.loadTexture('images/right.jpg');

var material = new THREE.MeshBasicMaterial({
  map: leftTexture
});
var leftSphere = new THREE.Mesh(
  new THREE.SphereGeometry(100, 20, 20),
  material
);
leftSphere.scale.x = -1;
scene.add(leftSphere);

//var controls = new THREE.OrbitControls(camera);
//controls.noPan = true;
//controls.noZoom = true;
//controls.autoRotate = true;
//controls.autoRotateSpeed = 0.5;

var controls = new THREE.DeviceOrientationControls(camera, true);
controls.connect();
controls.update();

render();

function render() {

  controls.update();
  effect.render(scene, camera);

  requestAnimationFrame(render);

}

function resize() {

  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  effect.setSize(dprWidth, dprHeight);

}

function fullscreen() {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

window.addEventListener('click', function() {
  if (window.innerWidth === screen.width && window.innerHeight === screen.height) {
    location.reload();
  } else {
    fullscreen();
  }
}, false);

window.addEventListener('resize', resize, false);
