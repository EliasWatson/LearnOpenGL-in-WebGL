uniform sampler2D uAlbedoSampler;
uniform sampler2D uAOSampler;

varying highp vec3 pos;
varying highp vec2 uv;
varying lowp float time;

void main() {
    highp float AO = texture2D(uAOSampler, uv).r;
    AO = clamp(mix(AO, 1., abs(pos.x) * 3.), 0., 1.);

    gl_FragColor = texture2D(uAlbedoSampler, uv);
    gl_FragColor.rgb *= AO;
}