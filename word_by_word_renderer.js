const {createCanvas} = require('canvas');
const GIFEncoder = require('gifencoder');
const fs = require('fs');

/**
 * Basic Word by Word Renderer.
 * 
 */
module.exports = (width, height, {wordsPerMin, imageQuality, backgroundColor, textColor} = {}) => {
    /**
     * Calculates animation interval rate in milliseconds, given the word per min
     * value.
     * 
     * @param int wpmValue
     * @return int the value representing animation rate 
     */
    function wpmToAnimationIntervalMillis(wpmValue) {
        return Math.floor(60000 / wpmValue);
    }

    wordsPerMin =  wordsPerMin || 150;
    backgroundColor = backgroundColor || '#000000';
    textColor = textColor || '#ffffff';
    imageQuality = imageQuality || 10;

    // TODO: Enable user to override this?
    const breather = "!!";
    // TODO: Enable user to override this?
    const pauseFrames = 10;
    // TODO: Enable user to override this?
    const CHARACTER_SIZE = 50;

    const canvas = createCanvas(width, height);
    const frameTime = wpmToAnimationIntervalMillis(wordsPerMin);

    function getGIFEncoder(filename) {
        const encoder = new GIFEncoder(width, height);
        encoder.createReadStream().pipe(fs.createWriteStream(filename));
            
        encoder.start();
        encoder.setRepeat(0);  // 0 for repeat, -1 for no-repeat
        encoder.setDelay(frameTime);
        encoder.setQuality(imageQuality);

        return encoder;
    }

    function getCanvasContext() {
        const context = canvas.getContext('2d');

        context.font = `${CHARACTER_SIZE}px Arial`;

        return context;
    }
   
    function render(text, filename) {
        const re = /\s/;
        const corpus = text.split(re).filter(val => val && val.length > 0);

        const encoder = getGIFEncoder(filename);
        const context = getCanvasContext();
        
        let previousWord = '';
        let currentWord =  '';

        function renderExtraFrames(context) {
            for(var i = 0; i < pauseFrames; i++) {
                context.fillStyle = backgroundColor;
                context.fillRect(0, 0, width, height);
                encoder.addFrame(context);
            }
        }

        for(var curIndex = 0; curIndex < corpus.length; curIndex++) {
            currentWord = corpus[curIndex];
            empty = ""; // in debug mode
            if (curIndex > 0 && curIndex < corpus.length) {
                previousWord = corpus[curIndex - 1];

                if (previousWord && previousWord.length > currentWord.length) {
                    empty = " ".repeat(previousWord.length - currentWord.length); 
                }
            }
            
            process.stdout.write(`\r${currentWord}${empty}`)

            context.fillStyle = backgroundColor;
            context.fillRect(0, 0, width, height);
            context.fillStyle = textColor;
            
            let takeABreather = breather == currentWord;

            if (!takeABreather) {
                // TODO: Put word in the center of the image..
                context.fillText(currentWord, width/2 - 100, height/2);
            }

            encoder.addFrame(context);
        }

        renderExtraFrames(context); 
        
        encoder.finish();
    }

    return {render};
};