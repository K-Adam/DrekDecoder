module.exports = class DataConsumer {

    constructor(buffer) {
        this.buffer = buffer;
        this.ptr = 0;
    }

    hasData() {
        return this.ptr < this.buffer.length;
    }

    readByte() {
        return this.buffer[this.ptr++];
    }

    readBytes(num) {
        let data = this.buffer.slice(this.ptr, this.ptr + num);
        this.ptr += num;
        return data;
    }

}
