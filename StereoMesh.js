function StereoMesh(leftTexture, rightTextue, geometry) {
	this.left = leftTexture;
	this.right = rightTexture;
	this.material = new THREE.MeshBasicMaterial({
		map: this.left		
	});
	this.mesh = new THREE.Mesh(
		geometry,
		this.material
	);
}

StereoMesh.prototype.beforeRenderLeft = function() {
	this.material.map = left;
}
StereoMesh.prototype.beforeRenderRight = function() {
	this.material.map = right;
}
