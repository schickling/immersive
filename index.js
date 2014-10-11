var DEBUG = true;

var width = window.innerWidth;
var height = window.innerHeight;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
camera.position.x = 0.1;

var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(width, height);
renderer.autoClear = false;

var hmdOptions = {
  hResolution: width,
  vResolution: height,
  hScreenSize: 0.14976,
  vScreenSize: 0.0936,
  interpupillaryDistance: 0.064,
  lensSeparationDistance: 0.064,
  eyeToScreenDistance: 0.041,
  distortionK: [1.0, 0.22, 0.24, 0.0],
  chromaAbParameter: [0.996, -0.004, 1.014, 0.0]
};

effect = new THREE.OculusRiftEffect(renderer, {
  worldScale: 100,
  HMD: hmdOptions
});
effect.setSize(width, height);

renderer.setSize(width, height);

effect.preLeftRender = function() {
  for (var i = meshes.length - 1; i >= 0; i--) {
    meshes[i].beforeRenderLeft();
  }
};

effect.preRightRender = function() {
  for (var i = meshes.length - 1; i >= 0; i--) {
    meshes[i].beforeRenderRight();
  }
};

var element = renderer.domElement;
document.body.appendChild(element);
element.width = width;
element.height = height;

//var parameters = {
//minFilter: THREE.LinearFilter,
//magFilter: THREE.LinearFilter,
//format: THREE.RGBFormat,
//stencilBufferL: false
//};

//var renderTarget = new THREE.WebGLRenderTarget(0.5 * width, height, parameters);
//var leftBuffer = renderTarget;
//var rightBuffer = renderTarget.clone();

var meshes = [];

var place = location.hash ? Places[location.hash.substring(2)] : Places.auditorium;

var leftTexture = THREE.ImageUtils.loadTexture(place.left);
var rightTexture = THREE.ImageUtils.loadTexture(place.right);

meshes.push(new StereoMesh(leftTexture, rightTexture, new THREE.SphereGeometry(100, 20, 20)));

meshes[0].mesh.scale.x = -1;
scene.add(meshes[0].mesh);

var controls;

if (DEBUG) {
  controls = new THREE.OrbitControls(camera);
  controls.noPan = true;
  controls.noZoom = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;
} else {
  controls = new THREE.DeviceOrientationControls(camera, true);
  controls.connect();
  controls.update();
}


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

  effect.setSize(width, height);

  renderer.setSize(width, height);

  element.width = width;
  element.height = height;
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
