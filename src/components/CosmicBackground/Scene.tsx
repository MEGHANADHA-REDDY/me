import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Planet from "./Planet";
import AccretionDisc from "./AccretionDisc";
import Particles from "./Particles";
import Effects from "./Effects";
import Controls from "./Controls";
import StarsCanvas from "../StarBackground";

const Scene = () => {
    return (
        <div className="fixed inset-0 z-0 bg-black">
            <Canvas camera={{ position: [0, 3, 14], fov: 45 }} dpr={[1, 1.5]}>
                <color attach="background" args={["#000000"]} />
                <ambientLight intensity={0.2} />

                <group rotation={[0.2, 0, 0]}>
                    <Planet />
                    <AccretionDisc />
                    <Particles count={50000} />
                </group>

                <StarsCanvas />
                {/* <Effects /> */}
                <Controls />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};

export default Scene;
