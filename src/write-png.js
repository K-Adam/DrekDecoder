var fs = require('fs');
var PNG = require('pngjs').PNG;

module.exports = function(canvas, path, teamMaskPath = null) {
    return new Promise((resolve, reject) => {
        let frameImage = new PNG({
            width: canvas.width,
            height: canvas.height,
            filterType: -1
        });

        let teamMaskImage = new PNG({
            width: canvas.width,
            height: canvas.height,
            colorType: 0,
            inputColorType: 0,
            filterType: -1
        });

        frameImage.data.set(canvas.data);
        teamMaskImage.data.set(canvas.teamMask);

        frameImage.pack().pipe(fs.createWriteStream(path)).on("close", () => {
            if (teamMaskPath) {
                teamMaskImage.pack().pipe(fs.createWriteStream(teamMaskPath)).on("close", () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    });
};
