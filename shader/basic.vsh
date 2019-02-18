attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aUV;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uTime;

varying highp vec3 pos;
varying highp vec3 nml;
varying highp vec2 uv;
varying lowp float time;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aPosition, 1);

    pos = (uWorldMatrix * vec4(aPosition, 1)).xyz;
    nml = mat3(uWorldMatrix) * aNormal;
    uv = aUV;
    time = uTime;
}