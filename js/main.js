let gl, scene;

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
    scene = createBlankScene();

    loadShaders();
    loadBuffers();
    loadTextures();

    setRenderFunction(renderScene);
}

function renderScene(time, deltatime) {
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

    loadAttribute(
        gl,
        scene.buffers.uv,
        gl.ARRAY_BUFFER,
        scene.shaders.basic.attributes.aUV,
        2,
        gl.FLOAT,
        false,
        0
    );

    gl.useProgram(scene.shaders.basic.program);
    gl.uniform1f(scene.shaders.basic.uniforms.uTime, time);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, scene.textures.albedo);
    gl.uniform1i(scene.shaders.basic.uniforms.uAlbedoSampler, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scene.buffers.index);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
}

function loadShaders() {
    let basicVsh = "", basicFsh = "";
    downloadData("shader/basic.vsh", data => basicVsh = data);
    downloadData("shader/basic.fsh", data => basicFsh = data);

    scene.shaders.basic = loadShader(gl, basicVsh, basicFsh,
        ["aPosition", "aUV"],
        ["uTime", "uAlbedoSampler"]);
}

function loadBuffers() {
    scene.buffers.position = loadBuffer(gl, triangleVertices, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
    scene.buffers.index = loadBuffer(gl, triangleIndices, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW);
    scene.buffers.uv = loadBuffer(gl, triangleUV, gl.ARRAY_BUFFER, gl.STATIC_DRAW);
}

function loadTextures() {
    scene.textures.albedo = loadTexture(gl, "img/Tiles28_col.jpg");
}
