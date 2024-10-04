let scene, camera, renderer;
let planets = [];
const descriptions = {
    earth: "Earth: The Blue Planet.",
    mars: "Mars: The Red Planet.",
    jupiter: "Jupiter: The Largest Planet."
};

function init() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    
    // Add light
    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);
    
    // Load planets
    loadPlanet('models/earth.glb', { x: -2, y: 0, z: 0 }, 'earth');
    loadPlanet('models/mars.glb', { x: 0, y: 0, z: 0 }, 'mars');
    loadPlanet('models/jupiter.glb', { x: 2, y: 0, z: 0 }, 'jupiter');

    // Camera position
    camera.position.z = 5;

    // Event listener for window resize
    window.addEventListener('resize', onWindowResize, false);
    
    animate();
}

function loadPlanet(modelPath, position, name) {
    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, (gltf) => {
        const planet = gltf.scene;
        planet.position.set(position.x, position.y, position.z);
        scene.add(planet);
        planets.push({ model: planet, name: name });
        
        // Add hover effect
        planet.traverse((child) => {
            if (child.isMesh) {
                child.cursor = 'pointer'; // Change cursor style
                child.name = name; // Set the name for hover effect
            }
        });
    });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    planets.forEach((planet) => {
        planet.model.rotation.y += 0.01; // Rotate planets
    });
    renderer.render(scene, camera);
}

// Handle mouse hover to show descriptions
window.addEventListener('mousemove', onMouseMove, false);

function onMouseMove(event) {
    // Convert mouse position to normalized device coordinates
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    // Raycaster to detect intersections
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(planets.map(p => p.model), true);
    const descriptionDiv = document.getElementById('description');

    if (intersects.length > 0) {
        const name = intersects[0].object.name;
        descriptionDiv.style.display = 'block';
        descriptionDiv.innerText = descriptions[name];
    } else {
        descriptionDiv.style.display = 'none';
    }
}

init();
