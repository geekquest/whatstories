const {WordByWordRenderer} = require('./whatstories');
const clipboard = require('clipboardy');

let textFromClipboard = clipboard.readSync()
let ts = (new Date()).getTime()

const common = {
    textColor: '#ffffff',
    backgroundColor: '#000000',
    imageQuality: 10
};

WordByWordRenderer(600, 200, {
    ...common,
    wordsPerMin: 300
}).render(textFromClipboard, `output/clipboard${ts}.gif`);
