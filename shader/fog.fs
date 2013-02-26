precision highp float;

uniform sampler2D uSampler;
uniform float uUseDirectionalLight;
uniform vec3 uLightColor;
uniform vec3 uLookVec;
uniform vec4 uAmbient;
uniform vec4 uDiffuse;
uniform vec4 uSpecular;
uniform vec4 uEmission;
uniform vec4 uDetectColor;
uniform float uDetectTouch;
uniform float uUseTexture;
uniform float uShininess;
uniform vec3 uLightDirection;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vNormal;

void main() {
    vec4 texColor = texture2D(uSampler, vTextureCoord);
    vec4 baseColor = vColor;
    baseColor *= texColor * uUseTexture + vec4(1.0, 1.0, 1.0, 1.0) * (1.0 - uUseTexture);
    float alpha = baseColor.a * uDetectColor.a * uDetectTouch + baseColor.a * (1.0 - uDetectTouch);
    vec4 phongColor = uAmbient;
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uLightDirection);
    vec3 E = normalize(uLookVec);
    vec3 R = reflect(-L, N);
    float lamber = max(dot(N, L) , 0.0);
    phongColor += uDiffuse * lamber;
    float s = max(dot(R,-E), 0.0);
    vec4 specularColor= uSpecular * pow(s, uShininess) * sign(lamber);
    vec4 color = ((uEmission * baseColor + specularColor + vec4(baseColor.rgb * phongColor.rgb * uLightColor.rgb, baseColor.a)) 
        * uUseDirectionalLight + baseColor * (1.0 - uUseDirectionalLight)) 
        * (1.0 - uDetectTouch) + uDetectColor * uDetectTouch;
    
    float z = gl_FragCoord.z / gl_FragCoord.w;
    vec4 fogColor = vec4(0.0, 0.0, 0.0, 1.0);
    float fogStart = 1.0;
    float fogEnd = 500.0;
    float fogDensity = 0.017;
    float LOG2 = 1.442695;
    float fog = exp2(-fogDensity * fogDensity * z * z * LOG2);
    if (fog <= 0.0) {
        discard;
    }
    fog = clamp(fog, 0.0, 1.0);
    
    gl_FragColor = mix(fogColor, color, fog);
}
