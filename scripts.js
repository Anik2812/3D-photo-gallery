function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

const gallery = document.querySelector('.gallery');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, gallery.clientWidth / gallery.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(gallery.clientWidth, gallery.clientHeight);
gallery.appendChild(renderer.domElement);

scene.background = new THREE.Color(0x1a1a1d);

const images = [
    'photo_1.webp',
    'photo_2.jpg',
    'photo_3.png',
    'photo_4.jpg',
    'photo_5.jpg',
];

const loader = new THREE.TextureLoader();
const textures = images.map(image => loader.load(image));

const geometry = new THREE.BoxGeometry(5, 5, 5);
const materials = textures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

camera.position.z = 10;

const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

gallery.addEventListener('mousedown', (event) => {
    isDragging = true;
});

gallery.addEventListener('mouseup', (event) => {
    isDragging = false;
});

gallery.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaMove = {
            x: event.offsetX - previousMousePosition.x,
            y: event.offsetY - previousMousePosition.y
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 0.1),
                toRadians(deltaMove.x * 0.1),
                0,
                'XYZ'
            ));

        cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
    }

    previousMousePosition = {
        x: event.offsetX,
        y: event.offsetY
    };
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
