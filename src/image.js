module.exports = class Image {

    constructor() {

        this.frames = [];

        this.palette = null;

    }

    getInfo() {
        return {
            frames: this.frames.map(f => f.getInfo())
        };
    }

}
