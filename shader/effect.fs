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
    gl_FragColor = texture2D(uSampler, vTextureCoord);
}
