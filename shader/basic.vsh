attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uWorldMatrix;
uniform mat4 uViewMatrix;
uniform float uTime;

varying highp vec3 pos;
varying highp vec2 uv;
varying lowp float time;

void main() {
    gl_Position = uViewMatrix * uWorldMatrix * vec4(aPosition, 1);

    pos = gl_Position.xyz;
    uv = aUV;
    time = uTime;
}