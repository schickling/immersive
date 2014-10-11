var oCamera, oScene, texture, buffer;
var dprHalfWidth, dprHeight;

THREE.StereoPipeline = function(renderer, dpr, width, height) {

  this.setSize(dpr, width, height);

  oCamera = new THREE.OrthographicCamera(-0.8, 0.8, 0.8, -0.8, 0, 1);
  oScene = new THREE.Scene();

  var shader = THREE.BarrelDistortionShader;
  var shaderMaterial = new THREE.ShaderMaterial(shader);
  var quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial);
  oScene.add(quad);

  texture = shader.uniforms.texture;

};

THREE.StereoPipeline.prototype.setSize = function(dpr, width, height) {

  dprHalfWidth = dpr * width * 0.5;
  dprHeight = dpr * height;

  var parameters = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBFormat,
  };

  buffer = new THREE.WebGLRenderTarget(dprHalfWidth, dprHeight, parameters);

};

THREE.StereoPipeline.prototype.render = function(pScene, pCamera, leftCallback, rightCallback) {

  // left image
  leftCallback();
  renderer.setViewport(0, 0, dprHalfWidth, dprHeight);
  renderer.render(pScene, pCamera, buffer, true);

  texture.value = buffer;
  renderer.render(oScene, oCamera);

  // right image
  rightCallback();
  renderer.setViewport(dprHalfWidth, 0, dprHalfWidth, dprHeight);
  renderer.render(pScene, pCamera, buffer, true);

  texture.value = buffer;
  renderer.render(oScene, oCamera);

};
