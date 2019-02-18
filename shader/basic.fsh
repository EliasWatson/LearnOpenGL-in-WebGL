uniform sampler2D uAlbedoSampler;
uniform sampler2D uAOSampler;

uniform highp vec3 uAmbientLightColor;
uniform highp vec3 uSunDirection;
uniform highp vec3 uSunColor;

varying highp vec3 pos;
varying highp vec3 nml;
varying highp vec2 uv;
varying lowp float time;

void main() {
    highp float AO = texture2D(uAOSampler, uv).r;
    highp float diffuse = dot(nml, uSunDirection) * .5 + .5;

    gl_FragColor = texture2D(uAlbedoSampler, uv);
    gl_FragColor.rgb *= diffuse;
    gl_FragColor.rgb += uAmbientLightColor;
    gl_FragColor.rgb *= mix(AO, 1., diffuse);
}