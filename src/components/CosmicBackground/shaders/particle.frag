varying vec3 vColor;

void main() {
  // Center coordinates
  vec2 xy = gl_PointCoord.xy - vec2(0.5);
  float dist = length(xy);
  
  if (dist > 0.5) discard;
  
  // Exponential falloff for soft glow
  // 0.5 is the radius, so we normalize dist to 0..1 range relative to radius
  float strength = 1.0 - (dist * 2.0);
  strength = pow(strength, 3.0); // Sharper core, soft glow
  
  gl_FragColor = vec4(vColor, strength);
}
