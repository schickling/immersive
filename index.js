var DEBUG = true;

var dpr = window.devicePixelRatio || 1;
var width = window.innerWidth;
var height = window.innerHeight;

if (dpr > 2) {
  console.log(dpr);
}

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
camera.position.x = 0.1;

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  devicePixelRatio: dpr
});
renderer.setSize(width, height);
renderer.autoClear = false;

var pipeline = new THREE.StereoPipeline(renderer, dpr, width, height);

renderer.setSize(width, height);

var element = renderer.domElement;
document.body.appendChild(element);

var meshes = [];

var place = location.hash ? Places[location.hash.substring(2)] : Places.auditorium;

var leftTexture = THREE.ImageUtils.loadTexture(place.left);
var rightTexture = THREE.ImageUtils.loadTexture(place.right);

var sphere = new StereoMesh(leftTexture, rightTexture, new THREE.SphereGeometry(100, 20, 20));
sphere.mesh.scale.x = -1;
meshes.push(sphere);

meshes.forEach(function(m) {
  scene.add(m.mesh);
});

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

var leftPrerender = function() {
  for (var i = meshes.length - 1; i >= 0; i--) {
    meshes[i].beforeRenderLeft();
  }
};

var rightPrerender = function() {
  for (var i = meshes.length - 1; i >= 0; i--) {
    meshes[i].beforeRenderRight();
  }
};

render();

function render() {
  controls.update();
  pipeline.render(scene, camera, leftPrerender, rightPrerender);
  requestAnimationFrame(render);
}

function resize() {

  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  //element.width = width;
  //element.height = height;
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
