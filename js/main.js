let gl, scene;

const triangleVertices = new Float32Array([
    -0.5, -0.5, 0.0,
     0.5, -0.5, 0.0,
     0.0,  0.5, 0.0,
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
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function loadShaders() {
    let basicVsh = "", basicFsh = "";
    downloadData("shader/basic.vsh", data => basicVsh = data);
    downloadData("shader/basic.fsh", data => basicFsh = data);

    scene.shaders.basic = loadShader(gl, basicVsh, basicFsh, ["aPosition"], []);
}

function loadBuffers() {
    scene.buffers.position = loadBuffer(gl, triangleVertices, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
}
