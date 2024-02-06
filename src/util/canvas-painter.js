module.exports = class CanvasPainter {

    constructor(canvas, palette, teamColorCount) {
        this.canvas = canvas;

        this.palette = palette;

        this.teamColorCount = teamColorCount;

        this.x = 0;
        this.y = 0;
    }

    pushPixel(palette_index, a = 255) {
        let r = this.palette[palette_index * 3 + 2],
            g = this.palette[palette_index * 3 + 1],
            b = this.palette[palette_index * 3 + 0];

        let isTeamColor = (255-palette_index) < this.teamColorCount;

        this.canvas.setPixel(this.x, this.y, [r, g, b, a], isTeamColor);
        this.step();
    }

    skipPixels(num) {
        this.step(num);
    }

    finishLine() {
        this.y++;
        this.x = 0;
    }

    step(num = 1) {
        this.x += num;

        if (this.x > this.canvas.width) {
            this.y += Math.floor(this.x / this.canvas.width);
            this.x = this.x % this.canvas.width;
        }
    }

}
