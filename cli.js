#!/usr/bin/env node

var Decoder = require('./index');
var fs = require('fs');

var argv = require('yargs')
    .usage('Usage: $0 <command> [file] [options]')
    .command('check', 'Detects if the provided file is a valid Drek image')
    .command('info', 'Prints image properties')
    .command('convert', 'Converts image to png')
    .example('$0 convert [file] -o [output file or directory]')
    .alias('o', 'output')
    .alias('f', 'frame')
    .demandCommand(2)
    .argv;

var command = argv._[0];
var file = argv._[1];

switch (command) {

    case 'check':

        Decoder.readFile(file)
            .then(() => {
                console.log(`${file} is a valid Drek file`);
            })
            .catch(error => console.error(error.message));

        break;

    case 'info':

        Decoder.readFile(file)
            .then(img => {
                console.log(img.getInfo());
            })
            .catch(error => console.error(error.message));

        break;

    case 'convert':

        let path = argv.output;
        if (!path) {
            console.error('Please provide an output file or directory name');
            return;
        }

        Decoder.readFile(file)
            .then(img => {

                let outputs = [];
                if (path.toLowerCase().endsWith('.png')) {
                    // save to png
                    if (!argv.frame && img.frames.length > 1) {
                        console.warn("This file contains multiple frames.");
                    }
                    outputs.push([img.frames[argv.frame || 0], path]);
                } else {
                    // save to directory
                    if (!fs.existsSync(path)) {
                        console.error("Directory does not exist.");
                        return;
                    }
                    outputs = img.frames.map((f, i) => ([f, path + '/' + i + '.png']));
                }

                outputs.forEach(([frame, path]) => {
                    let canvas = frame.generateImageData();

                    Decoder.writePng(path, canvas).then(() => {
                            console.log("File saved");
                        })
                        .catch(error => console.error(error.message));
                });

            })
            .catch(error => console.error(error.message));

        break;

    default:

        console.error("Unknown command");
}
