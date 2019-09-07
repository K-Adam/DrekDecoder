var Image = require('../image');
var Frame = require('../frame');

module.exports = class FileReader {

    constructor(data) {
        this.data = data;
    }

    read() {
        let img = new Image();

        this.checkSignature();

        this.readPalette(img);

        const data_start = this.data.readInt16LE(0x0010);
        const frame_count = this.data.readInt16LE(0x000e);

        let ptr = data_start;
        for (let fi = 0; fi < frame_count; fi++) {

            const data_size = this.data.readInt32LE(ptr + 0x0010) + 0x0060;

            const data_start = ptr;
            const data_end = data_start + data_size;

            let data = this.data.slice(data_start, data_end);

            let frame = this.readFrame(img, data);
            img.frames.push(frame);

            ptr = data_end;
        }

        return img;
    }

    //

    checkSignature() {
        // DREK signature backwards
        if (this.data.slice(0, 4).toString() != 'KERD') {
            throw new Error('DREK signature not found');
        }
    }

    readPalette(image) {
        const palette_offset = this.data.readInt32LE(0x0054);
        const palette_size = 3 * 256;

        image.palette = this.data.slice(palette_offset, palette_offset + palette_size);
    }

    readFrame(img, data) {

        let xs = data.readInt32LE(0x0014);
        let ys = data.readInt32LE(0x0018);

        let frame = new Frame(img);

        frame.width = xs;
        frame.height = ys;

        frame.offsetx = data.readInt32LE(0x001C);
        frame.offsety = data.readInt32LE(0x0020);

        const scanline_start = 0x0068;
        const scanline_size = ys * 4;

        frame.scanLineOffsets = new Int32Array(ys);
        //data.copy(Buffer.from(frame.scanLineOffsets.buffer), 0, scanline_start, scanline_start+scanline_size);
        for (let y = 0; y < ys; y++) {
            frame.scanLineOffsets[y] = data.readInt32LE(scanline_start + y * 4);
        }

        frame.data = data.slice(scanline_start + scanline_size);

        return frame;
    }

}
