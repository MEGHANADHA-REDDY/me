import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { wrapEffect } from "@react-three/postprocessing";
import { LensingEffectImpl } from "./LensingEffectImpl";
import { Vector2 } from "three";

// Wrap the custom effect
const Lensing = wrapEffect(LensingEffectImpl);

const Effects = () => {
    return (
        <EffectComposer>
            <Lensing intensity={0.2} />
            <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
            <ChromaticAberration offset={new Vector2(0.002, 0.002)} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
    );
};

export default Effects;
