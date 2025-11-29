import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "./shaders/particle.vert?raw";
import fragmentShader from "./shaders/particle.frag?raw";

const Particles = ({ count = 50000 }: { count?: number }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const { positions, colors, sizes } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const color1 = new THREE.Color("#ff00ff");
        const color2 = new THREE.Color("#00ffff");
        const tempColor = new THREE.Color();

        for (let i = 0; i < count; i++) {
            // Disc distribution
            const angle = Math.random() * Math.PI * 2;
            const radius = 3.0 + Math.random() * 5.0; // Outside the black hole
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * 0.5; // Flat disc

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Color mix
            tempColor.lerpColors(color1, color2, Math.random());
            colors[i * 3] = tempColor.r;
            colors[i * 3 + 1] = tempColor.g;
            colors[i * 3 + 2] = tempColor.b;

            sizes[i] = Math.random() * 2.0;
        }

        return { positions, colors, sizes };
    }, [count]);

    useFrame((state) => {
        if (meshRef.current) {
            // Rotate the whole system for performance
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <points>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default Particles;
