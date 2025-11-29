uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform float uIntensity; // Lensing intensity

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    
    // Center of the screen (assuming planet is at center for now, or pass uniform)
    vec2 center = vec2(0.5, 0.5);
    
    // Distance from center
    vec2 dir = uv - center;
    float dist = length(dir);
    
    // Inverse square law distortion (stronger near center)
    // Avoid division by zero and clamp effect
    float distortion = uIntensity / (dist * dist + 0.01);
    
    // Warp UVs
    vec2 distortedUv = uv - dir * distortion * 0.02;
    
    // Sample texture
    vec4 color = texture2D(tDiffuse, distortedUv);
    
    // Black hole core (optional, if not covered by geometry)
    // if (dist < 0.1) color = vec4(0.0, 0.0, 0.0, 1.0);
    
    gl_FragColor = color;
}
