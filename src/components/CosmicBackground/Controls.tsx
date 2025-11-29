import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { easing } from "maath";

const Controls = () => {
    const { camera } = useThree();
    const isSingularity = useRef(false);

    useEffect(() => {
        const handleMouseDown = () => { isSingularity.current = true; };
        const handleMouseUp = () => { isSingularity.current = false; };

        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    useFrame((state, delta) => {
        // Parallax
        easing.damp3(
            camera.position,
            [
                state.mouse.x * 2,
                3 + state.mouse.y * 2,
                isSingularity.current ? 8 : 14
            ],
            0.25,
            delta
        );

        // Singularity FOV warp
        const fov = isSingularity.current ? 60 : 45;
        easing.damp(camera, "fov", fov, 0.25, delta);
        camera.updateProjectionMatrix();
    });

    return null;
};

export default Controls;
