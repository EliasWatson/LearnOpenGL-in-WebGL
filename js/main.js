let gl, scene = {};

const triangleVertices = new Float32Array([
    // Front face
    -0.5, -0.5,  0.5,
    0.5, -0.5,  0.5,
    0.5,  0.5,  0.5,
    -0.5,  0.5,  0.5,

    // Back face
    -0.5, -0.5, -0.5,
    -0.5,  0.5, -0.5,
    0.5,  0.5, -0.5,
    0.5, -0.5, -0.5,

    // Top face
    -0.5,  0.5, -0.5,
    -0.5,  0.5,  0.5,
    0.5,  0.5,  0.5,
    0.5,  0.5, -0.5,

    // Bottom face
    -0.5, -0.5, -0.5,
    0.5, -0.5, -0.5,
    0.5, -0.5,  0.5,
    -0.5, -0.5,  0.5,

    // Right face
    0.5, -0.5, -0.5,
    0.5,  0.5, -0.5,
    0.5,  0.5,  0.5,
    0.5, -0.5,  0.5,

    // Left face
    -0.5, -0.5, -0.5,
    -0.5, -0.5,  0.5,
    -0.5,  0.5,  0.5,
    -0.5,  0.5, -0.5,
]);
const triangleUV = new Float32Array([
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Top
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Bottom
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Right
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Left
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
]);
const triangleIndices = new Uint16Array([
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
]);

const cubePositions = [
    [ 0.0,  0.0,  0.0],
    [ 2.0,  5.0, -15.0],
    [-1.5, -2.2, -2.5],
    [-3.8, -2.0, -12.3],
    [ 2.4, -0.4, -3.5],
    [-1.7,  3.0, -7.5],
    [ 1.3, -2.0, -2.5],
    [ 1.5,  2.0, -2.5],
    [ 1.5,  0.2, -1.5],
    [-1.3,  1.0, -1.5],
];

main();

function main() {
    gl = getGL();
    gl.enable(gl.DEPTH_TEST);

    for(let i = 0; i < 10; ++i) {
        tMakeRect(gl, "rect" + i);
        scene["rect" + i].position = cubePositions[i];

        const angle = (20 * i) * Math.PI / 180;
        scene["rect" + i].rotation = [angle, angle*0.3, angle*0.5];
    }

    setRenderFunction(renderScene);
}

function renderScene(time, deltatime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for(let i in scene) {
        let rect = scene[i];

        const worldMatrix = rect.getWorldMatrix();

        const viewMatrix = mat4.create();
        const radius = 10;
        const camX = Math.sin(time) * radius;
        const camZ = Math.cos(time) * radius;
        mat4.lookAt(viewMatrix, [camX, 0, camZ], [0, 0, 0], [0, 1, 0]);

        const projectionMatrix = mat4.create();
        mat4.perspective(projectionMatrix, 45 * Math.PI / 180, document.body.clientWidth / document.body.clientHeight, 0.1, 100);

        rect.shader.getUniform("uWorldMatrix").data = [false, worldMatrix];
        rect.shader.getUniform("uViewMatrix").data = [false, viewMatrix];
        rect.shader.getUniform("uProjectionMatrix").data = [false, projectionMatrix];
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
    rect.vertexCount = triangleIndices.length;

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
            new glUniform("uViewMatrix", [false, mat4.create()], "Matrix4fv"),
            new glUniform("uProjectionMatrix", [false, mat4.create()], "Matrix4fv"),
            new glUniform("uTime", [0.0], "1f"),
            new glUniform("uAlbedoSampler", [0], "1i"),
            new glUniform("uAOSampler", [1], "1i"),
        ]);

    scene[name] = rect;
}
