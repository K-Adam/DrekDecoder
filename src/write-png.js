var fs = require('fs');
var PNG = require('pngjs').PNG;

module.exports = function(path, canvas) {
    return new Promise((resolve, reject) => {
        let png = new PNG({
            width: canvas.width,
            height: canvas.height,
            filterType: -1
        });

        canvas.data.copy(png.data);

        png.pack().pipe(fs.createWriteStream(path)).on("close", () => {
            resolve();
        });
    });
};
