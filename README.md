# DrekDecoder

## Installation
```
npm i drek-decoder
```

## Usage

### Command line interface:
```
node cli.js convert ./IMG.DRK -o ./img.png
```
### Node.js:
```javascript
var Decoder = require('drek-decoder');

Decoder.readFile('./IMG.DRK')
    .then(img => {

        // Export the first frame
        let selected_frame = 0;
        let canvas = img.frames[selected_frame].generateImageData();

        Decoder.writePng('./img.png', canvas).then(() => {
            console.log("File saved");
        });

    })
    .catch(error => console.error(error.message))
;
```
