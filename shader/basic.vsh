attribute vec3 aPosition;

uniform float uTime;

varying lowp vec3 pos;
varying lowp float time;

void main() {
    gl_Position = vec4(aPosition, 1);
    gl_Position.x += sin(uTime * 2. + gl_Position.y) * .4;

    pos = gl_Position.xyz;
    time = uTime;
}