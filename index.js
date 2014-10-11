var element = document.getElementById('sphere');
var width = window.innerWidth;
var height = window.innerHeight;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
camera.position.x = 0.1;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.autoClear = false;

//var parameters = {
//minFilter: THREE.LinearFilter,
//magFilter: THREE.LinearFilter,
//format: THREE.RGBFormat,
//stencilBufferL: false
//};

//var renderTarget = new THREE.WebGLRenderTarget(0.5 * width, height, parameters);
//var leftBuffer = renderTarget;
//var rightBuffer = renderTarget.clone();



var leftTexture = THREE.ImageUtils.loadTexture('images/map.jpg');
var rightTexture = THREE.ImageUtils.loadTexture('images/map2.jpg');

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

element.appendChild(renderer.domElement);

render();

function render() {

  controls.update();

  // left eye
  material.map = leftTexture;
  renderer.setViewport(0, 0, width * 0.5, height);
  renderer.render(scene, camera);

  // right eye
  material.map = rightTexture;
  renderer.setViewport(0.5 * width, 0, width * 0.5, height);
  renderer.render(scene, camera);

  requestAnimationFrame(render);

}
