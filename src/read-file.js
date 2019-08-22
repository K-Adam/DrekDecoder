var fs = require("fs");
var FileReader = require("./util/file-reader");

function readFile(filename) {

    return new Promise((resolve, reject) => {

        fs.readFile(filename, (err, data) => {

            if (err) {
                reject(err);
                return;
            }

            try {

                let reader = new FileReader(data);
                let img = reader.read();

                resolve(img);

            } catch (err) {
                reject(err);
            }

        });

    });
}

module.exports = readFile;
