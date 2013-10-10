var Effect = require('./Effect');

// TODO extract away
function r(radius) {
	return (Math.random() - 0.5) * radius;
}

var EffectBallsScene = function ( renderer ) {

	Effect.call( this );

	var scene,
		camera,
		cameraTarget;

	this.init = function() {

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 100000);
		cameraTarget = new THREE.Vector3();

		this.setSize(window.innerWidth, window.innerHeight);

		var material1 = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
		var material2 = new THREE.MeshBasicMaterial({ color: 0xffffff });
		var materials = [ material1, material2 ];
		var sphereMaterial = new THREE.MeshFaceMaterial(materials);

		var sphereGeometry = new THREE.SphereGeometry(r(10) + 2, 8);

		sphereGeometry.faces.forEach(function(face, idx) {
			// face.materialIndex = (idx >> 1) % materials.length; // Not exactly right like an amiga ball
			face.materialIndex = idx % materials.length;
		});

		var s = 40;

		for(var i = 0; i < 10; i++) {
			var mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
			mesh.position.set(r(s), r(s), r(s));
			mesh.initialPosition = mesh.position.clone();
			mesh.phase = r(2 * Math.PI);
			mesh.elongRadius = 10 * Math.random() + 3;
			scene.add(mesh);
		}

		camera.position.set(10, 0, 10);
		camera.lookAt(cameraTarget);

	};

	this.setSize = function(w, h) {

		if(camera) {
			camera.aspect = w / h;
			camera.updateProjectionMatrix();
		}

	};
	
	this.update = function ( time ) {
		var dist = 15;
		var t = time * 300;

		for(var i = 0; i < scene.children.length; i++) {
			var child = scene.children[i];
			child.position.y = child.initialPosition.y + child.elongRadius * Math.sin(t + child.phase);
		}

		camera.position.set( dist * Math.sin(t), 0, dist * Math.cos(t));
		camera.lookAt(cameraTarget);
		renderer.render(scene, camera);
	};

};

EffectBallsScene.prototype = new Effect();
EffectBallsScene.prototype.constructor = EffectBallsScene;

module.exports = EffectBallsScene;

