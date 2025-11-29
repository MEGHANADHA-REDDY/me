import { Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";
import fragmentShader from "./shaders/lens.frag?raw";

export class LensingEffectImpl extends Effect {
    constructor({ intensity = 0.3 } = {}) {
        super("LensingEffect", fragmentShader, {
            uniforms: new Map<string, any>([
                ["uIntensity", new Uniform(intensity)],
                ["uTime", new Uniform(0)],
                ["uMouse", new Uniform(new Vector2(0.5, 0.5))],
                ["uResolution", new Uniform(new Vector2(1, 1))]
            ]),
        });
    }

    update(_renderer: any, _inputBuffer: any, deltaTime: number) {
        const time = this.uniforms.get("uTime");
        if (time) time.value += deltaTime;
    }
}
