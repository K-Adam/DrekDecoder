module.exports = class Canvas {

    constructor(width, height) {

        this.width = width;
        this.height = height;

        // RGBA
        this.data = new Uint8ClampedArray(width * height * 4);
        this.teamMask = new Uint8ClampedArray(width * height);
    }

    setPixel(x, y, [r, g, b, a], teamMask = false) {
        let di = (y * this.width + x) * 4;

        this.data[di + 0] = r;
        this.data[di + 1] = g;
        this.data[di + 2] = b;
        this.data[di + 3] = a;

        this.teamMask[y * this.width + x] = teamMask ? 255 : 0;
    }

}
