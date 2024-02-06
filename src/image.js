module.exports = class Image {

    constructor() {

        this.frames = [];

        this.palette = null;

        this.teamColorCount = 0;

    }

    getInfo() {
        return {
            frames: this.frames.map(f => f.getInfo())
        };
    }

}
