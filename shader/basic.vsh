attribute vec3 aPosition;
attribute vec2 aUV;

uniform float uTime;

varying highp vec3 pos;
varying highp vec2 uv;
varying lowp float time;

void main() {
    gl_Position = vec4(aPosition, 1);
    gl_Position.x += sin(uTime * 2. + gl_Position.y) * .4;

    pos = gl_Position.xyz;
    uv = aUV;
    time = uTime;
}