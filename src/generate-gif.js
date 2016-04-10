'use strict';

const async = require('async');
const fs = require('fs');
const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');

const finalWidth = 600;
const finalHeight = 600;
const allowedExtensions = ['jpg', 'png'];

module.exports = (folder, resultFileName, repeat, delay, quality) => {
  const encoder = new GIFEncoder(finalWidth, finalHeight);
  // stream the results as they are available into myanimated.gif
  encoder.createReadStream().pipe(fs.createWriteStream(resultFileName));

  encoder.start();
  encoder.setRepeat(repeat ? 0 : -1); // 0 for repeat, -1 for no-repeat
  encoder.setDelay(delay || 500); // frame delay in ms
  encoder.setQuality(quality || 10); // image quality. 10 is default.

  fs.readdir(folder, (err, files) => {
    if (err) throw err;
    async.forEach(files, (filename, cb) => {
      if (allowedExtensions.indexOf(filename.split('.').pop()) == -1) {
        cb();
        return;
      }

      fs.readFile(`${folder + filename}`, (err, data) => {
        if (err) throw err;

        const img = new Canvas.Image; // Create a new Image
        img.src = data;

        let width = img.width;
        let height = img.height;

        if(width < finalWidth) {
          height *= finalWidth / width;
          width = finalWidth;
        }

        if(height < finalHeight) {
          width *= finalHeight / height;
          height = finalHeight;
        }

        // Initialiaze a new Canvas with the same dimensions
        // as the image, and get a 2D drawing context for it.
        const _canvas = new Canvas(finalWidth, finalHeight);
        const _ctx = _canvas.getContext('2d');
        _ctx.drawImage(img, (finalWidth - width) / 2, (finalHeight - height) / 2, width, height);

        // _ctx.font = '30px Impact';
        // _ctx.rotate(.1);
        // _ctx.fillText("2x0!", 50, 200);
        // _ctx.fill(0xffffff);

        encoder.addFrame(_ctx);
        cb();
      });

    }, (err, result) => {
      encoder.finish();
    });
  });
};

// const pngFileStream = require('png-file-stream');
// module.exports = (filesRegex, resultFileName, repeat, delay, quality, callback) => {
//   return pngFileStream(filesRegex)
//     .pipe(encoder.createWriteStream({
//       repeat: repeat || 0,
//       delay: delay || 1000,
//       quality: quality || 10,
//     }))
//     .pipe(fs.createWriteStream(resultFileName));
// };
