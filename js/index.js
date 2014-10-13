var supportsDeviceOrientation = false; //Former DBUG flag. 

var dpr = Math.min(window.devicePixelRatio || 1, 2);
var width = window.innerWidth;
var height = window.innerHeight;

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(105, (width / 2) / height, 1, 1000);
camera.position.x = 0.1;

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  devicePixelRatio: dpr
});
renderer.setSize(width, height);
renderer.autoClear = false;

var pipeline = new THREE.StereoPipeline(renderer, dpr, width, height);

renderer.setSize(width, height);

var meshes = [];

var placeId = location.hash.replace(/[#,\/]*/, '');
if (!placeId || !Places.hasOwnProperty(placeId)) {
  location.pathname = location.pathname.split('/').slice(0, -1).join('/') + '/selection.html';
}
var place = Places[placeId];

var leftTexture = [THREE.ImageUtils.loadTexture(place.left)];
var rightTexture = [THREE.ImageUtils.loadTexture(place.right)];

var sphere = new StereoMesh(leftTexture, rightTexture, new THREE.SphereGeometry(100, 20, 20));

sphere.scaleLeft.x = -1;
sphere.scaleRight.x = -1;

meshes.push(sphere);

var fframe;

for (var i = place.frames.length - 1; i >= 0; i--) {
  var frame = place.frames[i];

  var left = [];

  for (var tex in frame.left) {
    left.push(THREE.ImageUtils.loadTexture(frame.left[tex]));
  }
  var right = [];

  for (var tex in frame.right) {
    right.push(THREE.ImageUtils.loadTexture(frame.right[tex]));
  }

  var frameMesh = new StereoMesh(left, right, new THREE.CircleGeometry(10, 20));
  frameMesh.positionLeft = new THREE.Vector3(frame.positionL[0], frame.positionL[1], frame.positionL[2]);
  frameMesh.rotationLeft = new THREE.Euler(frame.rotationL[0], frame.rotationL[1], frame.rotationL[2], "XYZ");
  frameMesh.scaleLeft = new THREE.Vector3(frame.scaleL[0], frame.scaleL[1], frame.scaleL[2]);

  frameMesh.positionRight = new THREE.Vector3(frame.positionR[0], frame.positionR[1], frame.positionR[2]);
  frameMesh.rotationRight = new THREE.Euler(frame.rotationR[0], frame.rotationR[1], frame.rotationR[2], "XYZ");
  frameMesh.scaleRight = new THREE.Vector3(frame.scaleR[0], frame.scaleR[1], frame.scaleR[2]);
  frameMesh.aniDelay = frame.aniDelay;

  meshes.push(frameMesh);
  fframe = frameMesh;
}

meshes.forEach(function(m) {
  scene.add(m.mesh);
});

var controls;

var interval; 

var deviceOrientationCheck = function(event) {
  if(event.alpha) {
    supportsDeviceOrientation = true;
    window.removeEventListener('deviceorientation', deviceOrientationCheck, false);
  }
}

window.addEventListener('deviceorientation', deviceOrientationCheck, false);

var controlInitialization = function() {
  if (supportsDeviceOrientation) {
    controls = new THREE.DeviceOrientationControls(camera, true);
    controls.connect();
    controls.update();

    window.addEventListener('click', toggleFullscreen, false);
    window.addEventListener('touchmove', reload, false);
  } else {
    controls = new THREE.OrbitControls(camera);
    controls.noPan = true;
    controls.noZoom = true;
    controls.autoRotate = false;

    document.addEventListener('keydown', moveFrame, false);
  }

  window.clearInterval(interval)
}

interval = window.setInterval(controlInitialization, 1000);

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
  if(controls) {
    controls.update();
  }
  pipeline.render(scene, camera, leftPrerender, rightPrerender);
  requestAnimationFrame(render);
}

function resize() {

  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = (width / 2) / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  pipeline.setSize(dpr, width, height);

}

function toggleFullscreen() {
  if (document.mozFullScreen || document.webkitIsFullScreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
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
}

function reload() {
  location.reload();
}

function moveFrame(event) {
  if (event.keyCode == 37) {
    fframe.mesh.position.x += 0.5;
  }
  if (event.keyCode == 39) {
    fframe.mesh.position.x -= 0.5;
  }
  if (event.keyCode == 38) {
    fframe.mesh.position.z += 0.5;
  }
  if (event.keyCode == 40) {
    fframe.mesh.position.z -= 0.5;
  }

  if (event.keyCode == 79) { //O
    fframe.mesh.position.y += 0.5;
  }
  if (event.keyCode == 76) { //L
    fframe.mesh.position.y -= 0.5;
  }

  if (event.keyCode == 65) { //A
    fframe.mesh.rotation.y += 0.1;
  }
  if (event.keyCode == 68) { //D
    fframe.mesh.rotation.y -= 0.1;
  }

  if (event.keyCode == 87) { //W
    fframe.mesh.rotation.x += 0.1;
  }
  if (event.keyCode == 83) { //S
    fframe.mesh.rotation.x -= 0.1;
  }
  if (event.keyCode == 81) { //Q
    fframe.mesh.rotation.z += 0.1;
  }

  if (event.keyCode == 69) { //E
    fframe.mesh.rotation.z -= 0.1;
  }
  if (event.keyCode == 73) { //i
    fframe.mesh.scale.z += 0.1;
    fframe.mesh.scale.x += 0.1;
    fframe.mesh.scale.y += 0.1;
  }
  if (event.keyCode == 75) { //k
    fframe.mesh.scale.z -= 0.1;
    fframe.mesh.scale.x -= 0.1;
    fframe.mesh.scale.y -= 0.1;
  }
};

window.addEventListener('resize', resize, false);

var element = renderer.domElement;
document.body.appendChild(element);
