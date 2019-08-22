const WriteMode = {
    None: 0,
    Skip: 1,
    Transparent: 2,
    Opaque: 3
};

module.exports = class LineWriter {

    constructor(painter, consumer) {
        this.painter = painter;
        this.consumer = consumer;

        this.mode = WriteMode.None;
        this.pixels_left = 0;
    }

    write() {

        let consumer = this.consumer;
        let painter = this.painter;

        this.processFlag();

        while (consumer.hasData()) {

            switch (this.mode) {
                case WriteMode.Transparent:
                    this.writeTransparent();
                    break;
                case WriteMode.Opaque:
                    this.writeOpaque();
                    break;
                case WriteMode.Skip:
                    this.writeSkip();
                    break;
            }

        }

    }

    processFlag() {

        let flag;

        do {
            // read the flag byte
            flag = this.consumer.readByte();

            const HAS_OFFSET = 0b1;
            const MODE_TRANSP = 0b10;

            if (flag == 0x0) {
                this.painter.finishLine();
            } else if (flag & HAS_OFFSET) {
                this.mode = WriteMode.Skip;
                this.pixels_left = (flag >> 1) + 1;
            } else {

                // unknown
                const uflag = flag & 0b100;

                this.mode = (flag & MODE_TRANSP) ? WriteMode.Transparent : WriteMode.Opaque;
                this.pixels_left = (flag >> 3) + 1;

            }
        } while (this.consumer.hasData() && flag == 0x0);
    }

    writeTransparent() {
        while (this.pixels_left-- > 0) {
            let v1 = this.consumer.readByte();
            let v2 = this.consumer.readByte();

            let a = Math.round((v1 / 0b11111) * 255);
            this.painter.pushPixel(v2, a);

        }

        const TR_FIN = 0b10;
        const TR_OP = 0b11;
        const TR_SK = 0b01;
        const TR_TR = 0b00; // ?

        let v1 = this.consumer.readByte();
        let v1_flag = v1 & 0b11;

        if (v1_flag == TR_FIN) {
            this.painter.finishLine();
            this.mode = WriteMode.None;
        } else if (v1_flag == TR_OP) {
            this.mode = WriteMode.Opaque
            this.pixels_left = (v1 >> 2) + 1;
        } else if (v1_flag == TR_SK) {
            this.mode = WriteMode.Skip;
            this.pixels_left = (v1 >> 2) + 1;
        } else {
            // stay TR
            if (v1 & 0b100) {
                this.pixels_left = (v1 >> 3) + 1;
            } else {
                console.log('TR->?', v1);
            }
        }
    }

    writeOpaque() {
        while (this.pixels_left-- > 0) {
            let vv = this.consumer.readByte();
            this.painter.pushPixel(vv);
        }

        let v1 = this.consumer.readByte();
        let op_flag = v1 & 0b111;

        const OP_FIN = 0b000;
        const OP_TR = 0b001;
        const OP_CON = 0b110;
        const OP_SK = 0b100; // ?

        if (op_flag == OP_FIN) {
            this.painter.finishLine();
            this.mode = WriteMode.None;
        } else if (op_flag & OP_TR) {
            this.mode = WriteMode.Transparent;
            this.pixels_left = (v1 >> 1) + 1;
        } else if (op_flag == OP_CON) {
            this.pixels_left = (v1 >> 3) + 1;
        } else if (op_flag == OP_SK) {
            this.mode = WriteMode.Skip;
            this.pixels_left = (v1 >> 3) + 1;
        } else {
            console.log('OP->?', v1);
            // ??
        }
    }

    writeSkip() {
        if (this.pixels_left > 0) {
            this.painter.skipPixels(this.pixels_left);
            this.pixels_left = 0;
        }

        let vv = this.consumer.readByte();

        const SK_TR = 0b1;

        if (vv & SK_TR) {
            this.mode = WriteMode.Transparent;
            this.pixels_left = (vv >> 1) + 1;
        } else {

            if ((vv & 0b111) == 0b100) {
                // stay skip
                this.pixels_left = (vv >> 3) + 1;
            } else {
                // Opaque ?
                this.mode = WriteMode.Opaque;
                this.pixels_left = (vv >> 3) + 1;
            }

        }
    }

}
