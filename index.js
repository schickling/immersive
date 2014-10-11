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
	for(var i = meshes.length - 1; i >= 0; i--) {
		meshes[i].beforeRenderLeft();	
	}
};

effect.preRightRender = function() {
	for(var i = meshes.length - 1; i >= 0; i--) {
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

var leftTexture = [THREE.ImageUtils.loadTexture(place.left)];
var rightTexture = [THREE.ImageUtils.loadTexture(place.right)];

var sphere = new StereoMesh(leftTexture, rightTexture, new THREE.SphereGeometry(100, 20, 20));

sphere.scaleLeft.x = -1;
sphere.scaleRight.x = -1;
meshes.push(sphere);

var fframe

for(var i = place.frames.length - 1; i >= 0; i--) {
	var frame = place.frames[i];
	
	var left = [] 

  for(var tex in frame.left) {
    left.push(THREE.ImageUtils.loadTexture(frame.left[tex]));
  }
	var right = []

  for(var tex in frame.right) {
    right.push(THREE.ImageUtils.loadTexture(frame.right[tex]));
  }

	var frameMesh = new StereoMesh(left, right, new THREE.CircleGeometry(10, 20));
	frameMesh.positionLeft = new THREE.Vector3(frame.positionL[0], frame.positionL[1], frame.positionL[2]);
  frameMesh.rotationLeft = new THREE.Euler(frame.rotationL[0], frame.rotationL[1], frame.rotationL[2], "XYZ");
  frameMesh.scaleLeft = new THREE.Vector3(frame.scaleL[0], frame.scaleL[1], frame.scaleL[2]);

  frameMesh.positionRight = new THREE.Vector3(frame.positionR[0], frame.positionR[1], frame.positionR[2]);
  frameMesh.rotationRight = new THREE.Euler(frame.rotationR[0], frame.rotationR[1], frame.rotationR[2], "XYZ");
  frameMesh.scaleRight = new THREE.Vector3(frame.scaleR[0], frame.scaleR[1], frame.scaleR[2]);

	meshes.push(frameMesh);
  fframe = frameMesh;
}


for(var i = meshes.length - 1; i >= 0; i--) {
   scene.add(meshes[i].mesh);	
}

var controls = new THREE.OrbitControls(camera);
controls.noPan = true;
controls.noZoom = true;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;

//var controls = new THREE.DeviceOrientationControls(camera, true);
//controls.connect();
//controls.update();

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

//window.addEventListener('click', function() {
//  if (window.innerWidth === screen.width && window.innerHeight === screen.height) {
//    location.reload();
//  } else {
//    fullscreen();
//  }
//}, false);
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 37) {
      fframe.mesh.position.x += 0.5;
    }
    else if(event.keyCode == 39) {
      fframe.mesh.position.x -= 0.5;
    }
    if(event.keyCode == 38) {
      fframe.mesh.position.z += 0.5;
    }
    else if(event.keyCode == 40) {
      fframe.mesh.position.z -= 0.5;
    }

    if(event.keyCode == 79) { //O
      fframe.mesh.position.y += 0.5;
    }
    else if(event.keyCode == 76) { //L
      fframe.mesh.position.y -= 0.5;
    }

    if(event.keyCode == 65) { //A
      fframe.mesh.rotation.y += 0.1;
    }
    else if(event.keyCode == 68) { //D
      fframe.mesh.rotation.y -= 0.1;
    }

    if(event.keyCode == 87) { //W
      fframe.mesh.rotation.x += 0.1;
    }
    else if(event.keyCode == 83) { //S
      fframe.mesh.rotation.x -= 0.1;
    }
    if(event.keyCode == 81) { //Q
      fframe.mesh.rotation.z += 0.1;
    }
    else if(event.keyCode == 69) { //E
      fframe.mesh.rotation.z -= 0.1;
    }
    if(event.keyCode == 73) { //i
      fframe.mesh.scale.z += 0.1;
      fframe.mesh.scale.x += 0.1;
      fframe.mesh.scale.y += 0.1;
    }
    else if(event.keyCode == 75) { //k
      fframe.mesh.scale.z -= 0.1;
      fframe.mesh.scale.x -= 0.1;
      fframe.mesh.scale.y -= 0.1;
    }
});

window.addEventListener('resize', resize, false);
