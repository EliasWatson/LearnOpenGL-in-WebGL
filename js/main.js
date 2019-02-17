let gl, scene = {};

const triangleVertices = new Float32Array([
     0.5,  0.5, 0.0,  // top right
     0.5, -0.5, 0.0,  // bottom right
    -0.5, -0.5, 0.0,  // bottom left
    -0.5,  0.5, 0.0,  // top left
]);
const triangleUV = new Float32Array([
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0,
    0.0, 1.0,
]);
const triangleIndices = new Uint16Array([
    0, 1, 3,   // first triangle
    1, 2, 3,   // second triangle
]);

main();

function main() {
    gl = getGL();

    tMakeRect(gl, "rect");
    scene.rect.position = [0, 0.5, 0];

    tMakeRect(gl, "rect2");
    scene.rect2.position = [0.5, 0, 0];

    setRenderFunction(renderScene);
}

function renderScene(time, deltatime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for(let i in scene) {
        let rect = scene[i];

        rect.rotation[2] = time;
        let worldMatrix = rect.getWorldMatrix();

        rect.shader.getUniform("uWorldMatrix").data = [false, worldMatrix];
        rect.shader.getUniform("uTime").data = [time];
        rect.draw(gl);
    }
}

function tMakeRect(gl, name) {
    let rect = new Entity();
    rect.buffers.position = loadBuffer(gl, triangleVertices, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    rect.buffers.index = loadBuffer(gl, triangleIndices, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
    rect.buffers.uv = loadBuffer(gl, triangleUV, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    rect.textures.albedo = new glTexture(gl, 0, "img/Tiles28_col.jpg");
    rect.textures.ao = new glTexture(gl, 1, "img/Tiles28_AO.jpg");

    let basicVsh = "", basicFsh = "";
    downloadData("shader/basic.vsh", data => basicVsh = data);
    downloadData("shader/basic.fsh", data => basicFsh = data);
    rect.shader = new glShader(gl, basicVsh, basicFsh,
        [
            new glAttribute("aPosition", rect.buffers.position, gl.ARRAY_BUFFER, 3, gl.FLOAT, false, 0),
            new glAttribute("aUV", rect.buffers.uv, gl.ARRAY_BUFFER, 2, gl.FLOAT, false, 0),
        ],
        [
            new glUniform("uWorldMatrix", [false, mat4.create()], "Matrix4fv"),
            new glUniform("uTime", [0.0], "1f"),
            new glUniform("uAlbedoSampler", [0], "1i"),
            new glUniform("uAOSampler", [1], "1i"),
        ]);

    scene[name] = rect;
}
