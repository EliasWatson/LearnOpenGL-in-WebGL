uniform sampler2D uAlbedoSampler;

varying highp vec3 pos;
varying highp vec2 uv;
varying lowp float time;

void main() {
    gl_FragColor = texture2D(uAlbedoSampler, uv);
}