class MagicRoom {
    constructor() {
        this.init3D();
        this.setupScene();
        this.setupLights();
        this.createRoom();
        this.createRobot();
        this.setupControls();
        this.animate();
    }

    init3D() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('game-canvas'),
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xe0f2fe);
        this.renderer.shadowMap.enabled = true;
    }

    setupScene() {
        this.camera.position.set(8, 8, 8);
        this.camera.lookAt(0, 0, 0);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2.1;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 15;
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(5, 5, 5);
        mainLight.castShadow = true;
        this.scene.add(mainLight);
    }

    createRoom() {
        // Sol
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshStandardMaterial({ color: 0xf0fdf4 })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);

        // Murs
        const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        
        // Mur arrière
        const backWall = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 10),
            wallMaterial
        );
        backWall.position.z = -10;
        backWall.position.y = 5;
        this.scene.add(backWall);

        // Mur gauche
        const leftWall = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 10),
            wallMaterial
        );
        leftWall.position.x = -10;
        leftWall.position.y = 5;
        leftWall.rotation.y = Math.PI / 2;
        this.scene.add(leftWall);

        // Créer les meubles selon la configuration
        Object.entries(ROOM_CONFIG.positions).forEach(([item, position]) => {
            const color = ROOM_CONFIG.colors[item];
            this[`create${item.charAt(0).toUpperCase() + item.slice(1)}`](position, color);
        });
    }

    createBed(position, color) {
        const bed = new THREE.Group();
        
        // Structure
        const frame = new THREE.Mesh(
            new THREE.BoxGeometry(3, 1, 6),
            new THREE.MeshStandardMaterial({ color })
        );
        
        // Matelas
        const mattress = new THREE.Mesh(
            new THREE.BoxGeometry(2.8, 0.3, 5.8),
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        mattress.position.y = 0.5;
        
        bed.add(frame, mattress);
        bed.position.copy(position);
        this.scene.add(bed);
    }

    createDesk(position, color) {
        const desk = new THREE.Group();
        
        // Plateau
        const top = new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.2, 2),
            new THREE.MeshStandardMaterial({ color })
        );
        
        // Pieds
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, 2),
                new THREE.MeshStandardMaterial({ color })
            );
            leg.position.set(
                (i < 2 ? -1.8 : 1.8),
                -1,
                (i % 2 === 0 ? -0.8 : 0.8)
            );
            desk.add(leg);
        }
        
        desk.add(top);
        desk.position.copy(position);
        this.scene.add(desk);
    }

    createWardrobe(position, color) {
        const wardrobe = new THREE.Group();
        
        // Corps
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(2, 4, 1),
            new THREE.MeshStandardMaterial({ color })
        );
        
        // Portes
        const doorMaterial = new THREE.MeshStandardMaterial({ 
            color: new THREE.Color(color).multiplyScalar(0.9) 
        });
        
        const leftDoor = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, 3.8, 0.1),
            doorMaterial
        );
        leftDoor.position.set(-0.475, 0, 0.45);
        
        const rightDoor = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, 3.8, 0.1),
            doorMaterial
        );
        rightDoor.position.set(0.475, 0, 0.45);
        
        wardrobe.add(body, leftDoor, rightDoor);
        wardrobe.position.copy(position);
        this.scene.add(wardrobe);
    }

    createRobot() {
        this.robot = new THREE.Group();
        
        // Corps
        const body = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.2, 0.8),
            new THREE.MeshStandardMaterial({ color: 0x3b82f6 })
        );
        
        // Tête
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0x60a5fa })
        );
        head.position.y = 0.8;
        
        // Yeux
        const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const leftEye = new THREE.Mesh(
            new THREE.SphereGeometry(0.1),
            eyeMaterial
        );
        leftEye.position.set(-0.2, 0.9, 0.3);
        
        const rightEye = new THREE.Mesh(
            new THREE.SphereGeometry(0.1),
            eyeMaterial
        );
        rightEye.position.set(0.2, 0.9, 0.3);
        
        this.robot.add(body, head, leftEye, rightEye);
        this.robot.position.set(0, 0.6, 0);
        this.scene.add(this.robot);
    }

    setupControls() {
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.moveRobot(btn.dataset.direction);
            });
        });

        document.getElementById('help-btn').addEventListener('click', () => {
            this.playSound('Déplace le robot dans la direction indiquée !');
        });

        window.addEventListener('keydown', (e) => {
            const keyMap = {
                'ArrowUp': 'forward',
                'ArrowDown': 'backward',
                'ArrowLeft': 'left',
                'ArrowRight': 'right'
            };
            if (keyMap[e.key]) {
                e.preventDefault();
                this.moveRobot(keyMap[e.key]);
            }
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    moveRobot(direction) {
        const speed = 0.5;
        const oldPosition = { ...this.robot.position };

        switch(direction) {
            case 'forward':
                this.robot.position.z -= speed;
                break;
            case 'backward':
                this.robot.position.z += speed;
                break;
            case 'left':
                this.robot.position.x -= speed;
                break;
            case 'right':
                this.robot.position.x += speed;
                break;
        }

        if (this.checkCollisions()) {
            this.robot.position.copy(oldPosition);
        }
    }

    checkCollisions() {
        return (
            this.robot.position.x < -9.5 ||
            this.robot.position.x > 9.5 ||
            this.robot.position.z < -9.5 ||
            this.robot.position.z > 9.5
        );
    }

    playSound(text) {
        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';
            utterance.volume = 1;
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.robot) {
            this.robot.rotation.y += 0.01;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Démarrage du jeu
window.addEventListener('load', () => {
    const game = new MagicRoom();
});
