module.exports = class Canvas {

    constructor(width, height) {

        this.width = width;
        this.height = height;

        // RGBA
        this.data = new Buffer(width * height * 4);

    }

    setPixel(x, y, [r, g, b, a]) {
        let di = (y * this.width + x) * 4;

        this.data[di + 0] = r;
        this.data[di + 1] = g;
        this.data[di + 2] = b;
        this.data[di + 3] = a;
    }

}
