// Shaders
function loadShader(gl, vs, fs, attributes, uniforms) {
    const shaderProgram = createShaderProgram(gl, vs, fs);
    if(shaderProgram == null) return null;

    let programInfo = {
        program: shaderProgram,
        attributes: {},
        uniforms: {},
    };

    attributes.forEach(attribute =>
        programInfo.attributes[attribute] = gl.getAttribLocation(shaderProgram, attribute));

    uniforms.forEach(uniform =>
        programInfo.uniforms[uniform] = gl.getUniformLocation(shaderProgram, uniform));

    return programInfo;
}

function createShaderProgram(gl, vs, fs) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fs);
    if(vertexShader == null || fragmentShader == null) return null;

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Shader linking failed: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Shader compilation failed: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function loadAttribute(gl, buffer, bufferType, attribute, numComponents, componentType, normalize, offset) {
    gl.bindBuffer(bufferType, buffer);
    gl.vertexAttribPointer(attribute, numComponents, componentType, normalize, 0, offset);
    gl.enableVertexAttribArray(attribute);
}

// Buffers
function loadBuffer(gl, data, type, drawType) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, drawType);
    return buffer;
}

// Texture
function loadTexture(gl, url) {
    const texture = createTexture(gl);

    const image = new Image();
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function createTexture(gl) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
        gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([255, 0, 255, 255]));
    return texture;
}

// Utility
function getGL() {
    const canvasName = "#glCanvas";
    const canvas = document.querySelector(canvasName);
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    const gl = canvas.getContext("webgl");

    if(gl === null) {
        alert("WebGL is not supported in this browser");
        return null;
    }

    return gl;
}

function setRenderFunction(render) {
    let then = 0;

    function draw(now) {
        now *= 0.001;
        const deltatime = now - then;
        then = now;

        render(now, deltatime);
        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
}

function createBlankScene() {
    return {
        shaders: {},
        buffers: {},
        textures: {},
    };
}

function downloadData(url, callback, async = false) {
    let xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200)
            callback(xmlhttp.responseText);
    };
    xmlhttp.open("GET", url, async);
    xmlhttp.send();
}

function isPowerOf2(n) {
    return (n & (n - 1)) === 0;
}