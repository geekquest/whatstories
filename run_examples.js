const {ScrollingRenderer, WordByWordRenderer} = require('./whatstories');

const FIRST_STORY = `The Tao gave birth to machine language. Machine language gave birth to the assembler.
The assembler gave birth to the compiler. Now there are ten thousand languages.
Each language has its purpose, however humble. Each language expresses the Yin and Yang of software. Each language has its place within the Tao.
But do not program in COBOL if you can avoid it.`

const common = {
    textColor: '#ffffff',
    backgroundColor: '#000000',
    imageQuality: 10
};

WordByWordRenderer(400, 400, {
    ...common,
    wordsPerMin: 100
}).render(FIRST_STORY, 'basic-example.gif');

ScrollingRenderer(400, 400, {
    ...common, 
    frameRate: 3, 
    imageQuality: 15, 
    scrollSpeed: 1.5
}).render(FIRST_STORY, 'scrolling-example.gif');