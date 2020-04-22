const Canvas = require('canvas');
const GIFEncoder = require('gifencoder');
const fs = require('fs');
 
module.exports = (width, height, {backgroundColor, textColor, animationRate} = {}) => {
  const LINE_HPADDING = 0.1 * width;
  const LINE_VPADDING = 0.1 * height;
  const CHARACTER_SIZE = Math.round(width / 24); // Pixels

  const canvas = Canvas.createCanvas(width, height);
  backgroundColor = backgroundColor || '#013220';
  textColor = textColor || '#FFFFFF';
  animationRate = animationRate || 30;
  frameTime = 1000 / animationRate;

  function render(text, filename) {
    const context = getCanvasContext();
    const encoder = getGIFEncoder(filename);
    const lines = wrapTextToLines(text);
    const sprites = linesToSprites(lines);

    while (sprites.length > 0) {
      console.log(sprites);
      refreshCanvasContext(context);

      sprites.forEach(sprite => {
        renderTextToCanvasContext(context, sprite.line, sprite.x, sprite.y);
        sprite.y -= (1 / animationRate) * (height / 8);
      });

      encoder.addFrame(context);
      if (sprites[0].y < 0) sprites.shift();
    }

    encoder.finish();
  }

  function wrapTextToLines(text) {
      const words = text.split(/\s+/);

      return words.reduce((lines, word) => {
        console.log([word, lines])
        const line = lines.pop() || '';

        if (line.length === 0) {
          return [word];
        } else if (lineOverflowsOnScreen(`${line} ${word}`)) {
          return [...lines, line, word]; // What if the word is too long to fit on screen? Zofuna...
        } else {
          return [...lines, `${line} ${word}`.trim()];
        }

      }, []);
  }

  function lineOverflowsOnScreen(line) {
    return line.trim().length * CHARACTER_SIZE > width - (LINE_HPADDING * 2);
  }

  function linesToSprites(lines) {
    const startY = height / 2;

    return lines.map((line, i) => {
      const lineWidth = (line.length * CHARACTER_SIZE) / 2; // Assuming that a character's width is 1/2 of CHARACTER_SIZE;
      const x = Math.round((width - lineWidth) / 2);
      const y = startY + (i * CHARACTER_SIZE) + LINE_VPADDING;

      return {x, y, line};
    });
  }

  function getCanvasContext() {
    const context = canvas.getContext('2d');

    context.font = `${CHARACTER_SIZE}px Arial`;

    return context;
  }

  function getGIFEncoder(filename) {
    const encoder = new GIFEncoder(width, height);
    encoder.createReadStream().pipe(fs.createWriteStream(filename));
     
    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(frameTime);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default

    return encoder;
  }

  function refreshCanvasContext(context) {
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
  }

  function renderTextToCanvasContext(context, text, x, y) {
    context.fillStyle = textColor;
    context.fillText(text, x, y);
  }

  return {render};
};
