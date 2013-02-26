attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

attribute vec3 aNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelMat;
uniform mat4 uRotMat;
uniform mat4 uCameraMat;
uniform mat4 uProjMat;
uniform mat3 uNormMat;
uniform float uUseCamera;

varying vec2 vTextureCoord;
varying vec4 vColor;
varying vec3 vNormal;

void main() {
    vec4 p = uModelMat * vec4(aVertexPosition, 1.0);
    gl_Position = uProjMat * (uCameraMat * uUseCamera) * p + uProjMat * p * (1.0 - uUseCamera);
    vTextureCoord = aTextureCoord;
    vColor = aVertexColor;
    vNormal = uNormMat * aNormal;
}
