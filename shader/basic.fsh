varying lowp vec3 pos;
varying lowp float time;

void main() {
    gl_FragColor = vec4(pos * .5 + .5, 1);
    gl_FragColor.rgb *= sin(time * 5.) * .5 + .5;
}