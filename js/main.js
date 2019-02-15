let gl, scene;

const triangleVertices = new Float32Array([
     0.5,  0.5, 0.0,  // top right
     0.5, -0.5, 0.0,  // bottom right
    -0.5, -0.5, 0.0,  // bottom let
    -0.5,  0.5, 0.0,  // top let
]);
const triangleIndices = new Uint16Array([
    0, 1, 3,   // first triangle
    1, 2, 3,   // second triangle
]);

main();

function main() {
    gl = getGL();
    scene = createBlankScene();

    loadShaders();
    loadBuffers();

    setRenderFunction(renderScene);
}

function renderScene(deltatime) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    loadAttribute(
        gl,
        scene.buffers.position,
        gl.ARRAY_BUFFER,
        scene.shaders.basic.attributes.aPosition,
        3,
        gl.FLOAT,
        false,
        0
    );

    gl.useProgram(scene.shaders.basic.program);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scene.buffers.index);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function loadShaders() {
    let basicVsh = "", basicFsh = "";
    downloadData("shader/basic.vsh", data => basicVsh = data);
    downloadData("shader/basic.fsh", data => basicFsh = data);

    scene.shaders.basic = loadShader(gl, basicVsh, basicFsh, ["aPosition"], []);
}

function loadBuffers() {
    scene.buffers.position = loadBuffer(gl, triangleVertices, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    scene.buffers.index = loadBuffer(gl, triangleIndices, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
}
