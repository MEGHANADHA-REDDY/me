import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import vertexShader from "./shaders/blackHole.vert?raw";
import fragmentShader from "./shaders/blackHole.frag?raw";

const Planet = (props: any) => {
    const meshRef = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(
        () => ({
            uColor: { value: new THREE.Color("#000000") },
            uRimColor: { value: new THREE.Color("#4400ff") },
            uRimIntensity: { value: 2.0 },
            uRimPower: { value: 3.0 },
        }),
        []
    );

    return (
        <mesh ref={meshRef} {...props}>
            <sphereGeometry args={[2, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
            />
        </mesh>
    );
};

export default Planet;
