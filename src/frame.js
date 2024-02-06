var FrameDecoder = require('./util/frame-decoder');

module.exports = class Frame {

    constructor(image) {

        this.width = 0;
        this.height = 0;

        this.offsetX = 0;
        this.offsetY = 0;

        this.scanLineOffsets = null;
        this.data = null;

        this.image = image;
    }

    generateImageData() {
        let decoder = new FrameDecoder(this);

        return decoder.generateImageData();
    }

    getInfo() {
        return {
            width: this.width,
            height: this.height,
            offsetX: this.offsetX,
            offsetY: this.offsetY
        };
    }

}
