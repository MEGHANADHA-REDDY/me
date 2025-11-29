uniform vec3 uColor;
uniform vec3 uRimColor;
uniform float uRimIntensity;
uniform float uRimPower;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  
  // Fresnel Rim
  float fresnel = pow(1.0 - dot(normal, viewDir), uRimPower);
  vec3 rim = uRimColor * fresnel * uRimIntensity;
  
  // Core color (Black hole consumes light)
  vec3 color = mix(uColor, rim, fresnel);
  
  gl_FragColor = vec4(color, 1.0);
}
