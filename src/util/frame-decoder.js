var Canvas = require('../canvas');

var CanvasPainter = require('./canvas-painter');
var DataConsumer = require('./data-consumer');
var LineWriter = require('./line-writer');

module.exports = class FrameDecoder {

    constructor(frame) {
        this.frame = frame;
    }

    writeLine(painter, consumer) {
        let wr = new LineWriter(painter, consumer);
        wr.write();
    }

    generateImageData() {

        let canvas = new Canvas(this.frame.width, this.frame.height);
        let painter = new CanvasPainter(canvas, this.frame.image.palette);

        // Start of the algorithm
        for (let y = 0; y < this.frame.height; y++) {

            // read the next scanline start
            const line_start = this.frame.scanLineOffsets[y];
            const line_end = (y == (this.frame.height - 1)) ? this.frame.data.length : this.frame.scanLineOffsets[y + 1];

            let line_data = this.frame.data.slice(line_start, line_end);
            let consumer = new DataConsumer(line_data);

            this.writeLine(painter, consumer);

        }

        return canvas;

    }

}
