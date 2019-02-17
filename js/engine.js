class Entity {
    constructor() {
        this.position = [0, 0, 0];
        this.rotation = [0, 0, 0];
        this.scale = [1, 1, 1];
        this.buffers = { position: null, index: null, };
        this.textures = {};
        this.shader = null;
    }

    draw(gl) {
        for(let i in this.textures) this.textures[i].load(gl);
        this.shader.load(gl);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    getWorldMatrix() {
        const worldMatrix = mat4.create();
        mat4.translate(worldMatrix, worldMatrix, this.position);
        mat4.rotate(worldMatrix, worldMatrix, this.rotation[0], [1, 0, 0]);
        mat4.rotate(worldMatrix, worldMatrix, this.rotation[1], [0, 1, 0]);
        mat4.rotate(worldMatrix, worldMatrix, this.rotation[2], [0, 0, 1]);
        mat4.scale(worldMatrix, worldMatrix, this.scale);
        return worldMatrix;
    }
}

class glShader {
    constructor(gl, vertexSrc, fragmentSrc, attributes, uniforms) {
        this.program = this._createShaderProgram(gl, vertexSrc, fragmentSrc);
        if(this.program == null) return;

        this.attributes = attributes;
        this.attributes.forEach(attr => attr.location = gl.getAttribLocation(this.program, attr.name));

        this.uniforms = uniforms;
        this.uniforms.forEach(unif => unif.location = gl.getUniformLocation(this.program, unif.name));
    }

    load(gl) {
        gl.useProgram(this.program);
        this.attributes.forEach(attr => attr.load(gl));
        this.uniforms.forEach(unif => unif.load(gl));
    }

    getAttribute(name) {
        let i;
        for(i in this.attributes) {
            const attr = this.attributes[i];
            if (attr.name === name)
                return attr;
        }
        return null;
    }

    getUniform(name) {
        let i;
        for(i in this.uniforms) {
            const unif = this.uniforms[i];
            if (unif.name === name)
                return unif;
        }
        return null;
    }

    _createShaderProgram(gl, vertexSrc, fragmentSrc) {
        const vertexShader = this._compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
        const fragmentShader = this._compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
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

    _compileShader(gl, type, source) {
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
}

class glAttribute {
    constructor(name, buffer, bufferType, numComponents, componentType, normalize, offset) {
        this.name = name;
        this.location = -1;
        this.buffer = buffer;
        this.bufferType = bufferType;
        this.numComponents = numComponents;
        this.componentType = componentType;
        this.normalize = normalize;
        this.offset = offset;
    }

    load(gl) {
        if(this.location === -1) return;
        gl.bindBuffer(this.bufferType, this.buffer);
        gl.vertexAttribPointer(this.location, this.numComponents, this.componentType, this.normalize, 0, this.offset);
        gl.enableVertexAttribArray(this.location);
    }
}

class glUniform {
    constructor(name, data, type) {
        this.name = name;
        this.location = -1;
        this.data = data;
        this.type = type;
    }

    load(gl) {
        gl["uniform" + this.type].apply(gl, [this.location].concat(this.data));
    }
}

class glTexture {
    constructor(gl, location, url) {
        this.id = this._createTexture(gl);
        this.location = location;

        const glTex = this;
        this.image = new Image();
        this.image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, glTex.id);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glTex.image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            if (glTex._isPowerOf2(glTex.image.width) && glTex._isPowerOf2(glTex.image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };
        this.image.src = url;
    }

    load(gl) {
        gl.activeTexture(gl["TEXTURE" + this.location]);
        gl.bindTexture(gl.TEXTURE_2D, this.id);
    }

    _createTexture(gl) {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([255, 0, 255, 255]));
        return texture;
    }

    _isPowerOf2(n) {
        return (n & (n - 1)) === 0;
    }
}

// Buffers
function loadBuffer(gl, data, type, drawType) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, data, drawType);
    return buffer;
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

    gl.viewport(0, 0, canvas.width, canvas.height);
    window.addEventListener("resize", function() {
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    });

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

function downloadData(url, callback, async = false) {
    let xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200)
            callback(xmlhttp.responseText);
    };
    xmlhttp.open("GET", url, async);
    xmlhttp.send();
}
