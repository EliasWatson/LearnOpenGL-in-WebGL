attribute vec3 aPosition;

uniform float uTime;

varying lowp vec3 pos;
varying lowp float time;

void main() {
    gl_Position = vec4(aPosition, 1);
    pos = aPosition;
    time = uTime;
}