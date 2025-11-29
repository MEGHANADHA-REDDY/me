import * as THREE from 'three';
import { PROJECTS_CONFIG } from './config-projects';

export class ProjectsDepthStage {
    private container: HTMLElement;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private projects: any[];
    private platforms: THREE.Group[] = [];
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private animationId: number | null = null;
    private hoveredIndex: number = -1;
    private selectedIndex: number = -1;
    private onProjectSelect: (project: any) => void;

    // Scroll state
    private scrollX: number = 0;
    private scrollZ: number = 0; // Add Z scroll state
    private targetScrollX: number = 0;
    private targetScrollZ: number = 0; // Add target Z
    private maxScroll: number = 0;
    private minScroll: number = 0;

    // Config shortcuts
    private cfg = PROJECTS_CONFIG;

    constructor(container: HTMLElement, projects: any[], onSelect: (p: any) => void) {
        this.container = container;
        this.projects = projects;
        this.onProjectSelect = onSelect;

        this.scene = new THREE.Scene();
        // Fog for depth perception
        this.scene.fog = new THREE.FogExp2(this.cfg.colors.bgDeep, 0.001); // Reduced fog density

        this.camera = new THREE.PerspectiveCamera(
            this.cfg.camera.fov,
            container.clientWidth / container.clientHeight,
            this.cfg.camera.near,
            this.cfg.camera.far
        );
        this.camera.position.set(
            this.cfg.camera.startPos.x,
            this.cfg.camera.startPos.y,
            this.cfg.camera.startPos.z
        );
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.cfg.perf.dprClamp));
        container.appendChild(this.renderer.domElement);

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.initLights();
        this.initPlatforms();
        this.addEventListeners();
        this.animate();
    }

    private initLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Much brighter ambient
        this.scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0xffffff, 1.5); // Stronger key
        keyLight.position.set(100, 200, 100);
        this.scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(this.cfg.colors.neonOrchid, 0.8);
        fillLight.position.set(-100, 50, 100);
        this.scene.add(fillLight);

        const rimLight = new THREE.SpotLight(this.cfg.colors.neonOrchid, 5);
        rimLight.position.set(0, 100, -200);
        rimLight.lookAt(0, 0, 0);
        this.scene.add(rimLight);
    }

    private initPlatforms() {
        const textureLoader = new THREE.TextureLoader();
        const { count, spacingX, spacingZ, width, height, depth } = this.cfg.platforms;

        // Calculate total width to center the stage
        const totalWidth = (count - 1) * spacingX;
        const startX = -totalWidth / 2;

        // Exact scroll bounds: Center of first project to center of last project
        this.minScroll = startX;
        this.maxScroll = startX + totalWidth;

        this.projects.forEach((project, index) => {
            const group = new THREE.Group();

            // Position: Staggered in X and Z
            const x = startX + (index * spacingX);
            const z = -(index * spacingZ);
            group.position.set(x, 0, z);

            // 1. Platform Base (Box) - Reduced size for thinner borders
            // Width: image width + small padding
            // Height: image height + small padding
            const borderPadding = 20; // Reduced from implied larger padding
            const platformWidth = width + borderPadding;
            const platformHeight = height + borderPadding;

            const geometry = new THREE.BoxGeometry(platformWidth, platformHeight, depth);
            const material = new THREE.MeshStandardMaterial({
                color: this.cfg.colors.platformDark,
                roughness: 0.2, // Smoother for more reflection
                metalness: 0.6, // More metallic
                emissive: this.cfg.colors.platformEdge,
                emissiveIntensity: 0.4 // Brighter edges
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.userData = { isPlatform: true, index };
            group.add(mesh);

            // 2. Project Image (Plane on top)
            // Make image slightly larger relative to platform to reduce border thickness appearance
            const imgGeo = new THREE.PlaneGeometry(width, height);

            // Use BasicMaterial with toneMapped: false for maximum brightness/clarity
            // This ensures the image looks exactly like the source file, not affected by lighting
            const imgMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                toneMapped: false,
                fog: false // Disable fog for images so they don't fade out
            });

            if (project.heroImage) {
                textureLoader.load(project.heroImage, (tex) => {
                    tex.colorSpace = THREE.SRGBColorSpace; // Ensure correct color space
                    imgMat.map = tex;
                    imgMat.needsUpdate = true;
                });
            }

            const imgMesh = new THREE.Mesh(imgGeo, imgMat);
            imgMesh.position.set(0, 0, depth / 2 + 1);
            group.add(imgMesh);

            // 3. Text Label
            const label = this.createLabel(project.title);
            label.position.set(0, height / 2 + 40, 0);
            group.add(label);

            this.scene.add(group);
            this.platforms.push(group);
        });
    }

    private createLabel(text: string): THREE.Mesh {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return new THREE.Mesh();

        canvas.width = 512;
        canvas.height = 128;

        ctx.fillStyle = 'rgba(0,0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = 'bold 60px Inter, sans-serif';
        ctx.fillStyle = '#EDE7FF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const tex = new THREE.CanvasTexture(canvas);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const geo = new THREE.PlaneGeometry(200, 50);
        return new THREE.Mesh(geo, mat);
    }

    private addEventListeners() {
        this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.addEventListener('click', this.onClick.bind(this));
        // Wheel listener removed in favor of scroll-linked animation
        window.addEventListener('resize', this.onResize.bind(this));
    }

    // Called from React component based on scroll progress (0 to 1)
    public setScrollProgress(progress: number) {
        if (this.selectedIndex !== -1) return;

        // Map progress 0..1 to minScroll..maxScroll
        // 0 = First Project, 1 = Last Project
        const targetX = this.minScroll + (progress * (this.maxScroll - this.minScroll));
        this.targetScrollX = targetX;

        // Calculate Target Z
        // We want the camera to maintain a constant distance from the active project.
        // Projects are at Z = -(index * spacingZ)
        // So we need to interpolate Z from 0 to -(count-1)*spacingZ

        const { spacingZ, count } = this.cfg.platforms;
        const totalDepth = (count - 1) * spacingZ;

        // Progress 0 = Z 0
        // Progress 1 = Z -totalDepth
        const targetZ = -(progress * totalDepth);
        this.targetScrollZ = targetZ;

        // Calculate Active Index based on scroll position
        const { spacingX } = this.cfg.platforms;
        const startX = this.minScroll;

        const rawIndex = (this.targetScrollX - startX) / spacingX;
        const activeIndex = Math.round(rawIndex);

        // Clamp index
        const clampedIndex = Math.max(0, Math.min(this.projects.length - 1, activeIndex));

        this.updateActiveHighlight(clampedIndex);
    }

    private updateActiveHighlight(activeIndex: number) {
        this.platforms.forEach((group, index) => {
            // 1. Platform Border (Child 0)
            const mesh = group.children[0] as THREE.Mesh;
            const material = mesh.material as THREE.MeshStandardMaterial;

            // 2. Project Image (Child 1)
            const imgMesh = group.children[1] as THREE.Mesh;
            const imgMaterial = imgMesh.material as THREE.MeshBasicMaterial;

            // Skip if currently hovered (mouse hover takes precedence)
            if (index === this.hoveredIndex) return;

            const isActive = index === activeIndex;

            // Target values
            const targetY = isActive ? this.cfg.animation.hoverLift : 0;
            const targetScale = isActive ? 1.08 : 0.95; // Scale difference

            // Border Glow
            const targetEmissive = isActive ? 2.0 : 0.2; // Much stronger glow for active

            // Image Brightness (Dim inactive ones)
            const targetColor = isActive ? new THREE.Color(0xffffff) : new THREE.Color(0x666666);

            // Apply changes
            group.position.y = targetY;
            group.scale.setScalar(targetScale);

            material.emissiveIntensity = targetEmissive;
            imgMaterial.color.set(targetColor);
        });
    }

    private onMouseMove(e: MouseEvent) {
        if (this.selectedIndex !== -1) return;

        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const meshes = this.platforms.map(g => g.children[0]);
        const intersects = this.raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const index = intersects[0].object.userData.index;
            if (this.hoveredIndex !== index) {
                this.hoveredIndex = index;
                this.container.style.cursor = 'pointer';
                this.animateHover(index, true);
            }
        } else {
            if (this.hoveredIndex !== -1) {
                this.animateHover(this.hoveredIndex, false);
                this.hoveredIndex = -1;
                this.container.style.cursor = 'default';
            }
        }
    }

    private onClick() {
        if (this.hoveredIndex !== -1 && this.selectedIndex === -1) {
            this.selectProject(this.hoveredIndex);
        }
    }

    private animateHover(index: number, isHovering: boolean) {
        const group = this.platforms[index];
        const mesh = group.children[0] as THREE.Mesh;
        const material = mesh.material as THREE.MeshStandardMaterial;

        const imgMesh = group.children[1] as THREE.Mesh;
        const imgMaterial = imgMesh.material as THREE.MeshBasicMaterial;

        const targetY = isHovering ? this.cfg.animation.hoverLift : 0;
        const targetEmissive = isHovering ? 2.5 : 0.2; // Even brighter on hover
        const targetScale = isHovering ? 1.1 : 1.0;
        const targetColor = isHovering ? new THREE.Color(0xffffff) : new THREE.Color(0x666666);

        // Direct assignment for now (could be tweened for smoothness)
        group.position.y = targetY;
        material.emissiveIntensity = targetEmissive;
        group.scale.setScalar(targetScale);

        // Also ensure image is bright on hover
        if (isHovering) {
            imgMaterial.color.setHex(0xffffff);
        }
    }

    public selectProject(index: number) {
        this.selectedIndex = index;
        this.onProjectSelect(this.projects[index]);

        const targetGroup = this.platforms[index];

        // Calculate target camera position
        const offsetZ = 350; // Slightly further back for better view
        const offsetY = 20;

        const targetPos = new THREE.Vector3(
            targetGroup.position.x,
            targetGroup.position.y + offsetY,
            targetGroup.position.z + offsetZ
        );

        this.animateCamera(targetPos, new THREE.Vector3(targetGroup.position.x, targetGroup.position.y, targetGroup.position.z));
    }

    public resetCamera() {
        this.selectedIndex = -1;
        // Reset to start position but keep X scroll? 
        // Or reset to center? Let's reset to center (0) for "Home" feel
        // But if we want to return to where we were, we should use this.scrollX
        // Let's reset to the current scroll position to avoid jarring jump

        const { y, z } = this.cfg.camera.startPos;
        const x = this.scrollX; // Keep current scroll

        this.animateCamera(new THREE.Vector3(x, y, z), new THREE.Vector3(x, 0, 0));
    }

    private animateCamera(targetPos: THREE.Vector3, lookAt: THREE.Vector3) {
        const startPos = this.camera.position.clone();
        const startRot = this.camera.quaternion.clone();

        const dummy = new THREE.Object3D();
        dummy.position.copy(targetPos);
        dummy.lookAt(lookAt);
        const targetRot = dummy.quaternion;

        const startTime = performance.now();
        const duration = this.cfg.animation.cameraDuration;

        const update = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            this.camera.position.lerpVectors(startPos, targetPos, ease);
            this.camera.quaternion.slerpQuaternions(startRot, targetRot, ease);

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }

    private onResize() {
        if (!this.container) return;
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));

        // Scroll Physics
        if (this.selectedIndex === -1) {
            // Smooth damping
            this.scrollX += (this.targetScrollX - this.scrollX) * 0.1;
            this.scrollZ += (this.targetScrollZ - this.scrollZ) * 0.1; // Damp Z

            // Apply scroll to camera
            this.camera.position.x = this.scrollX;
            // Camera Z needs to be offset by startPos.z relative to the scrollZ
            // Wait, if projects are at negative Z, and we want to move camera to follow them...
            // Projects are at Z = 0, -500, -1000...
            // Camera starts at Z = 1000.
            // When looking at project 1 (Z=-500), camera should be at Z = 1000 - 500 = 500?
            // Yes, we want to maintain relative distance.
            // So camera.z = startPos.z + targetZ (where targetZ is negative)

            this.camera.position.z = this.cfg.camera.startPos.z + this.scrollZ;

            // Look slightly ahead/center
            // We look at the current scroll position in X and Z
            // But we want to look at the project plane (Z = scrollZ)
            this.camera.lookAt(this.scrollX, 0, this.scrollZ);

            // Idle animation
            const time = performance.now() * 0.001;
            this.platforms.forEach((p, i) => {
                if (i !== this.hoveredIndex) {
                    p.position.y = Math.sin(time + i) * 2;
                }
            });
        }

        this.renderer.render(this.scene, this.camera);
    }

    public dispose() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        window.removeEventListener('resize', this.onResize.bind(this));
        this.container.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this.container.removeEventListener('click', this.onClick.bind(this));
        // window.removeEventListener('wheel', this.onWheel.bind(this)); // Removed
        this.container.removeChild(this.renderer.domElement);
        this.renderer.dispose();
    }
}
