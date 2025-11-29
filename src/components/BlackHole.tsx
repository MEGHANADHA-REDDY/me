import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

const BlackHole = (props: any) => {
    const holeRef = useRef<THREE.Mesh>(null);
    const diskRef = useRef<THREE.Points>(null);
    const dustRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (holeRef.current) {
            holeRef.current.rotation.y = t * 0.1;
        }
        if (diskRef.current) {
            diskRef.current.rotation.z = t * 0.2;
        }
        if (dustRef.current) {
            dustRef.current.rotation.z = t * 0.15;
        }
    });

    // Main Accretion Disk
    const particleCount = 6000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2.5 + Math.random() * 3.5; // Wider disk
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.3;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const color = new THREE.Color();
        // Deep purple/blue/cyan mix
        color.setHSL(0.6 + Math.random() * 0.2, 0.8, 0.5 + Math.random() * 0.3);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    // Secondary "Dust" Layer (Fainter, wider)
    const dustCount = 3000;
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 3 + Math.random() * 4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = (Math.random() - 0.5) * 0.8; // More vertical spread

        dustPositions[i * 3] = x;
        dustPositions[i * 3 + 1] = y;
        dustPositions[i * 3 + 2] = z;
    }

    return (
        <group {...props}>
            {/* The Event Horizon */}
            <Sphere ref={holeRef} args={[2, 64, 64]}>
                <meshBasicMaterial color="#000000" />
            </Sphere>

            {/* Glowing Rim */}
            <Sphere args={[2.05, 64, 64]}>
                <meshBasicMaterial color="#4400ff" transparent opacity={0.4} side={THREE.BackSide} />
            </Sphere>

            {/* Main Disk */}
            <points ref={diskRef} rotation={[Math.PI / 2.5, 0, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleCount}
                        array={positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={particleCount}
                        array={colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.04}
                    vertexColors
                    transparent
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            {/* Dust Layer */}
            <points ref={dustRef} rotation={[Math.PI / 2.5, 0, 0]}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={dustCount}
                        array={dustPositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.02}
                    color="#8a2be2"
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
};

export default BlackHole;
