function StereoMesh(leftTextures, rightTextures, geometry) {
	this.left = leftTextures;
	this.right = rightTextures;
	this.cleft = 0;
	this.cright = 0;
	this.rotationLeft = new THREE.Euler(0, 0, 0, "XYZ");
	this.rotationRight = new THREE.Euler(0, 0, 0, "XYZ");
	this.positionLeft = new THREE.Vector3(0, 0, 0);
	this.positionRight = new THREE.Vector3(0, 0, 0);
	this.scaleLeft = new THREE.Vector3(1, 1, 1);
	this.scaleRight = new THREE.Vector3(1, 1, 1);
	this.aniDelay = 30;
	
	this.material = new THREE.MeshBasicMaterial({
		map: this.left[0]
	});
	this.mesh = new THREE.Mesh(
		geometry,
		this.material
	);
}

StereoMesh.prototype.beforeRenderLeft = function() {
	this.cleft += 1;
	if(this.cleft / this.aniDelay >= this.left.length) {
		this.cleft = 0;
	}
	this.material.map = this.left[Math.floor(this.cleft / this.aniDelay)];
	this.mesh.position = this.positionLeft;
	this.mesh.rotation = this.rotationLeft;
	this.mesh.scale = this.scaleLeft;
}
StereoMesh.prototype.beforeRenderRight = function() {
	this.cright += 1;
	if(this.cright / this.aniDelay >= this.right.length) {
		this.cright = 0;
	}
	this.material.map = this.right[Math.floor(this.cright / this.aniDelay)];
	this.mesh.position = this.positionRight;
	this.mesh.rotation = this.rotationRight;
	this.mesh.scale = this.scaleRight;
}
