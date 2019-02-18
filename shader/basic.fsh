uniform sampler2D uAlbedoSampler;
uniform sampler2D uRoughnessSampler;
uniform sampler2D uAOSampler;

uniform highp vec3 uAmbientLightColor;
uniform highp vec3 uSunDir;
uniform highp vec3 uSunColor;
uniform highp vec3 uViewPos;

varying highp vec3 pos;
varying highp vec3 nml;
varying highp vec2 uv;
varying lowp float time;

void main() {
    highp float AO = texture2D(uAOSampler, uv).r;
    highp float diffuse = dot(nml, uSunDir) * .5 + .5;
    highp float roughness = texture2D(uRoughnessSampler, uv).r;

    highp vec3 viewDir = normalize(uViewPos - pos);
    highp vec3 reflectDir = reflect(-uSunDir, nml);
    highp float specular = pow(max(dot(viewDir, reflectDir), 0.), 2.) * roughness;

    gl_FragColor = texture2D(uAlbedoSampler, uv);
    gl_FragColor.rgb *= (uAmbientLightColor * AO) + diffuse + specular;
}